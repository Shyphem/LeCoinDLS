// app.js
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet')
const cookieParser = require('cookie-parser');
const { sequelize, Message, Conversation } = require('./models');
const authRoutes = require('./routes/auth');
const annonceRoutes = require('./routes/annonce');
const messageRoutes = require('./routes/message');
const userRoutes = require('./routes/user');
require('dotenv').config();

const { contientInsulte } = require('./utils/insultes');

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'https://lecoindls.site',
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true
    }
});

// Configuration de CORS
app.use(cors({
    origin: 'https://lecoindls.site',
    credentials: true
}));

app.use(helmet());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Middleware pour parser les cookies
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/annonces', annonceRoutes);
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);

// Servir le fichier de documentation
app.use(express.static('public'));

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(new Error('Authentication error'));
            socket.user = user;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    console.log('User connected:', socket.user.id);

    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('sendMessage', async (data, callback) => {
        const { conversation_id, content } = data;
        const sender_id = socket.user.id;

        try {
            if (contientInsulte(content)) {
                return callback({ status: 'error', error: 'Votre message contient des insultes' });
            }

            const message = await Message.create({
                conversation_id,
                sender_id,
                content
            });

            await Conversation.update(
                { last_message: content, updated_at: new Date() },
                { where: { id: conversation_id } }
            );

            io.to(conversation_id).emit('newMessage', message);
            callback({ status: 'ok', message });
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            callback({ status: 'error', error });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.user.id);
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
        await sequelize.sync({ force: true }); // Attention: force: true va supprimer et recréer les tables
        server.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}\nDocumentation disponible à l'adresse http://localhost:5173:${PORT}/documentation.html`);
        });
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
};

startServer();