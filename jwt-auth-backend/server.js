// server.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key'; // Замените на ваш секретный ключ

app.use(bodyParser.json());
app.use(cors());

// Массив для хранения пользователей
let users = [];

// Маршрут для регистрации
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Проверка на существование пользователя
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Добавление нового пользователя
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// Маршрут для входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Поиск пользователя
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Создание JWT токена
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Маршрут для доступа к защищенным данным
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});