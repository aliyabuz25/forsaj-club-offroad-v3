import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure JSON directory exists
const jsonDir = path.join(__dirname, 'json');
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir);
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Helper to read/write JSON files
const getFileData = (fileName) => {
    const filePath = path.join(__dirname, 'json', fileName);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const saveFileData = (fileName, data) => {
    const filePath = path.join(__dirname, 'json', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// --- GENERIC CRUD HELPER ---
const setupCrud = (entityName, fileName) => {
    app.get(`/api/${entityName}`, (req, res) => {
        res.json(getFileData(fileName));
    });

    app.post(`/api/${entityName}`, upload.single('image'), (req, res) => {
        const items = getFileData(fileName);
        const itemData = JSON.parse(req.body.data || '{}');

        if (req.file) {
            itemData.image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
            // Also supports 'img' key used in some components
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

    app.delete(`/api/${entityName}/:id`, (req, res) => {
        let items = getFileData(fileName);
        items = items.filter(i => i.id !== req.params.id);
        saveFileData(fileName, items);
        res.json({ success: true });
    });
};

// --- AUTH ---
app.get('/api/users', (req, res) => {
    res.json(getFileData('users.json'));
});

// --- SETTINGS ---
app.get('/api/settings', (req, res) => {
    const settings = getFileData('settings.json');
    res.json(Array.isArray(settings) ? settings[0] || {} : settings);
});

app.post('/api/settings', (req, res) => {
    saveFileData('settings.json', req.body);
    res.json({ success: true, settings: req.body });
});

// --- ENTITIES ---
setupCrud('drivers', 'drivers.json');
setupCrud('news', 'news.json');
setupCrud('events', 'events.json');
setupCrud('gallery', 'gallery.json');
setupCrud('partners', 'partners.json');

// --- TRANSLATIONS ---
app.get('/api/translations', (req, res) => {
    res.json(getFileData('translations.json'));
});

app.post('/api/translations', (req, res) => {
    saveFileData('translations.json', req.body);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`CMS Server running at http://localhost:${PORT}`);
});
