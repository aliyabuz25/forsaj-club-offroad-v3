import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || '';

// --- MIDDLEWARE ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure Directories Exist
['json', 'uploads'].forEach(dir => {
    if (!fs.existsSync(path.join(__dirname, dir))) fs.mkdirSync(path.join(__dirname, dir));
});

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- HELPER FUNCTIONS ---
const getFileData = (fileName) => {
    const filePath = path.join(__dirname, 'json', fileName);
    if (!fs.existsSync(filePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveFileData = (fileName, data) => {
    const filePath = path.join(__dirname, 'json', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/login',
    body('username').isString(),
    body('password').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        const users = getFileData('users.json');
        const user = users.find(u => u.username === username);

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Check if password matches (support both hash and legacy plain text for migration if needed, but we prefer hash)
        let isMatch = false;
        if (user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy fallback (Should ideally be removed in production)
            isMatch = user.password === password;
        }

        if (isMatch) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '8h' });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
);

app.get('/api/me', authenticateToken, (req, res) => {
    res.json(req.user);
});


// --- GENERIC CRUD ---
const setupCrud = (entityName, fileName) => {
    // PUBLIC READ
    app.get(`/api/${entityName}`, (req, res) => {
        res.json(getFileData(fileName));
    });

    // PROTECTED WRITE
    app.post(`/api/${entityName}`, authenticateToken, upload.single('image'), (req, res) => {
        const items = getFileData(fileName);
        let itemData = {};
        try {
            itemData = JSON.parse(req.body.data || '{}');
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON in data field' });
        }

        if (req.file) {
            const baseUrl = process.env.PUBLIC_BASE_URL || '';
            // If local dev, we might want http://localhost:PORT, but for production relative is better or CDN
            // We will stick to the relative path strategy or full URL from env
            if (baseUrl) {
                itemData.image = `${baseUrl}/uploads/${req.file.filename}`;
            } else {
                itemData.image = `/uploads/${req.file.filename}`; // Relative path for frontend proxy
            }
            itemData.img = itemData.image;
        }

        if (itemData.id) {
            const index = items.findIndex(i => i.id === itemData.id);
            if (index !== -1) {
                items[index] = { ...items[index], ...itemData };
            } else {
                items.push(itemData);
            }
        } else {
            itemData.id = Date.now().toString();
            items.push(itemData);
        }

        saveFileData(fileName, items);
        res.json({ success: true, item: itemData });
    });

    app.delete(`/api/${entityName}/:id`, authenticateToken, (req, res) => {
        let items = getFileData(fileName);
        items = items.filter(i => i.id !== req.params.id);
        saveFileData(fileName, items);
        res.json({ success: true });
    });
};

// --- SPECIFIC ROUTES ---

// Users Management (Admin Only)
app.get('/api/users', authenticateToken, (req, res) => {
    // Only allow admins
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const users = getFileData('users.json').map(u => ({ ...u, password: '' })); // Hide passwords
    res.json(users);
});

app.post('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);

    const items = getFileData('users.json');
    let itemData = JSON.parse(req.body.data || '{}');

    // Handle Password
    if (itemData.password && itemData.password.trim() !== '') {
        // In real app, hash password here. For now we accept it but ideally it should be:
        // itemData.password = bcrypt.hashSync(itemData.password, 10);
        // Since we already have bcrypt imported:
        itemData.password = bcrypt.hashSync(itemData.password, 10);
    } else {
        if (itemData.id) {
            // Keep existing password
            const existing = items.find(i => i.id === itemData.id);
            if (existing) itemData.password = existing.password;
        }
    }

    if (itemData.id) {
        const index = items.findIndex(i => i.id === itemData.id);
        if (index !== -1) {
            items[index] = { ...items[index], ...itemData };
        } else {
            items.push(itemData);
        }
    } else {
        itemData.id = Date.now().toString();
        items.push(itemData);
    }

    saveFileData('users.json', items);
    res.json({ success: true });
});

// Settings
app.get('/api/settings', (req, res) => {
    const settings = getFileData('settings.json');
    res.json(Array.isArray(settings) ? settings[0] || {} : settings);
});

app.post('/api/settings', authenticateToken, (req, res) => {
    saveFileData('settings.json', req.body);
    res.json({ success: true, settings: req.body });
});

// Translations
// (Moved to setupCrud)


// Initialize Entities
setupCrud('translations', 'translations.json');
setupCrud('drivers', 'drivers.json');
setupCrud('content', 'content.json');
setupCrud('about', 'about.json');
setupCrud('news', 'news.json');
setupCrud('events', 'events.json');
setupCrud('gallery', 'gallery.json');
setupCrud('partners', 'partners.json');

// --- FILE MANAGER API ---
app.get('/api/files', authenticateToken, (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: 'Failed to list files' });

        // Filter out hidden files
        const fileList = files
            .filter(f => !f.startsWith('.'))
            .map(f => ({
                name: f,
                url: `/uploads/${f}`,
                size: fs.statSync(path.join(uploadDir, f)).size
            }));
        res.json(fileList);
    });
});

app.post('/api/files', authenticateToken, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({
        success: true,
        file: {
            name: req.file.filename,
            url: `/uploads/${req.file.filename}`
        }
    });
});

app.delete('/api/files/:filename', authenticateToken, (req, res) => {
    const filename = req.params.filename;
    // Prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) return res.status(400).json({ error: 'Invalid filename' });

    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// --- TRANSLATION API (Free/No-Key) ---
app.post('/api/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'Missing parameters' });

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();

        // Google returns nested arrays: [[["Translated Text", "Original", ...], ...], ...]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            res.json({ translatedText: data[0].map(s => s[0]).join('') });
        } else {
            res.status(500).json({ error: 'Translation failed format' });
        }
    } catch (e) {
        console.error('Translation error:', e);
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CMS Server running on port ${PORT}`);
});
