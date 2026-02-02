import express from 'express';
import nodemailer from 'nodemailer';
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
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure Directories Exist & Initialize defaults
['json', 'uploads'].forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

// Seed JSON defaults if empty (for Docker volumes)
const jsonDir = path.join(__dirname, 'json');
const defaultsDir = path.join(__dirname, 'json_defaults');
if (fs.existsSync(defaultsDir)) {
    fs.readdirSync(defaultsDir).forEach(file => {
        const destPath = path.join(jsonDir, file);
        if (!fs.existsSync(destPath)) {
            console.log(`Initializing ${file} from defaults...`);
            fs.copyFileSync(path.join(defaultsDir, file), destPath);
        }
    });
}

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
    try {
        const filePath = path.join(__dirname, 'json', fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error(`Error saving file ${fileName}:`, e);
        return false;
    }
};

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.warn('Auth failed: No token provided');
        return res.status(401).json({ message: 'Token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Auth failed: JWT verify error', err.message);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
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
        console.log(`Login attempt: ${username}`);
        const users = getFileData('users.json');
        const user = users.find(u => u.username === username);

        if (!user) {
            console.warn(`Login failed: User ${username} not found`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        let isMatch = false;
        if (user.password.startsWith('$2b$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = user.password === password;
        }

        if (isMatch) {
            console.log(`Login success: ${username}`);
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '8h' });
            res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
        } else {
            console.warn(`Login failed: Invalid password for ${username}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
);

// Check if any admin exists (for first-time setup)
app.get('/api/auth/setup-status', (req, res) => {
    const users = getFileData('users.json');
    const hasAdmin = users.some(u => u.role === 'admin');
    res.json({ initialized: hasAdmin });
});

// Setup first admin
app.post('/api/auth/setup', async (req, res) => {
    const users = getFileData('users.json');
    if (users.some(u => u.role === 'admin')) {
        return res.status(400).json({ message: 'System already initialized' });
    }

    const { username, password, name } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    const newUser = {
        id: Date.now().toString(),
        name: name || 'Admin',
        username,
        password: bcrypt.hashSync(password, 10),
        role: 'admin'
    };

    users.push(newUser);
    if (saveFileData('users.json', users)) {
        res.json({ success: true, message: 'Admin created' });
    } else {
        res.status(500).json({ error: 'Failed to save admin' });
    }
});

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
        try {
            const items = getFileData(fileName);
            let itemData = {};

            if (typeof req.body.data === 'string') {
                try {
                    itemData = JSON.parse(req.body.data);
                } catch (e) {
                    return res.status(400).json({ error: 'Məlumat formatı yanlışdır (Invalid JSON)' });
                }
            } else {
                itemData = req.body.data || {};
            }

            if (req.file) {
                const baseUrl = process.env.PUBLIC_BASE_URL || '';
                if (baseUrl) {
                    itemData.image = `${baseUrl}/uploads/${req.file.filename}`;
                } else {
                    itemData.image = `/uploads/${req.file.filename}`;
                }
                itemData.img = itemData.image;
            }

            // YouTube Link Processing
            if (itemData.videoUrl) {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = itemData.videoUrl.match(regExp);
                if (match && match[2].length === 11) {
                    itemData.videoId = match[2];
                    itemData.url = `https://img.youtube.com/vi/${itemData.videoId}/0.jpg`;
                }
            }

            if (itemData.id) {
                const index = items.findIndex(i => String(i.id) === String(itemData.id));
                if (index !== -1) {
                    items[index] = { ...items[index], ...itemData };
                } else {
                    items.push(itemData);
                }
            } else {
                itemData.id = Date.now().toString();
                items.push(itemData);
            }

            if (saveFileData(fileName, items)) {
                res.json({ success: true, item: itemData });
            } else {
                res.status(500).json({ error: 'Məlumatı yadda saxlamaq mümkün olmadı' });
            }
        } catch (error) {
            console.error(`Error in POST /api/${entityName}:`, error);
            res.status(500).json({ error: 'Server xətası baş verdi' });
        }
    });

    app.delete(`/api/${entityName}/:id`, authenticateToken, (req, res) => {
        let items = getFileData(fileName);
        items = items.filter(i => String(i.id) !== String(req.params.id));
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

app.post('/api/users', authenticateToken, upload.none(), (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);

        const items = getFileData('users.json');
        let itemData = {};

        if (typeof req.body.data === 'string') {
            itemData = JSON.parse(req.body.data);
        } else {
            itemData = req.body.data || {};
        }

        // Handle Password
        if (itemData.password && itemData.password.trim() !== '') {
            itemData.password = bcrypt.hashSync(itemData.password, 10);
        } else {
            if (itemData.id) {
                const existing = items.find(i => String(i.id) === String(itemData.id));
                if (existing) itemData.password = existing.password;
            }
        }

        if (itemData.id) {
            const index = items.findIndex(i => String(i.id) === String(itemData.id));
            if (index !== -1) {
                items[index] = { ...items[index], ...itemData };
            } else {
                items.push(itemData);
            }
        } else {
            itemData.id = Date.now().toString();
            items.push(itemData);
        }

        if (saveFileData('users.json', items)) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Error saving users' });
        }
    } catch (e) {
        console.error('Error in POST /api/users:', e);
        res.status(500).json({ error: 'Server error' });
    }
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
setupCrud('video_archive', 'video_archive.json');
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

// --- CONTACT / SMTP API ---
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message, subject } = req.body;

    // 1. Get SMTP settings
    const settings = getFileData('settings.json');
    const smtp = Array.isArray(settings) ? settings[0] : settings;

    if (!smtp.smtpHost || !smtp.smtpUser || !smtp.smtpPass) {
        console.error('SMTP settings missing');
        return res.status(500).json({ error: 'Mail serveri tənzimlənməyib' });
    }

    // 2. Create Transporter
    const transporter = nodemailer.createTransport({
        host: smtp.smtpHost,
        port: parseInt(smtp.smtpPort) || 465,
        secure: smtp.smtpSecure !== false, // default to true if not specified
        auth: {
            user: smtp.smtpUser,
            pass: smtp.smtpPass
        }
    });

    // 3. Setup Email Data
    const mailOptions = {
        from: `"${name}" <${smtp.smtpFromEmail || smtp.smtpUser}>`,
        to: smtp.contactEmail || smtp.smtpUser,
        replyTo: email,
        subject: subject || `Yeni Əlaqə Formu: ${name}`,
        text: `Ad: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\nMesaj:\n${message}`,
        html: `
            <h3>Yeni Əlaqə Mesajı</h3>
            <p><b>Ad:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Telefon:</b> ${phone}</p>
            <br/>
            <p><b>Mesaj:</b></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Mesajınız uğurla göndərildi' });
    } catch (error) {
        console.error('SMTP Error:', error);
        res.status(500).json({ error: 'Mesaj göndərilərkən xəta baş verdi: ' + error.message });
    }
});

// --- TRANSLATION API (Pure Proxy) ---
app.post('/api/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'Missing parameters' });

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang.toLowerCase()}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data[0] && data[0][0] && data[0][0][0]) {
            const translatedText = data[0].map(s => s[0]).join('');
            res.json({ translatedText });
        } else {
            res.status(500).json({ error: 'Translation failed' });
        }
    } catch (e) {
        console.error('Translation error:', e);
        res.status(500).json({ error: 'Translation failed' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CMS Server running on port ${PORT}`);
});
