import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initWhatsAppClient, disconnectWhatsApp } from './services/whatsappService.js';
import { cleanExpiredOTPs } from './services/otpService.js';
import forgotPasswordRoutes from './routes/forgotPasswordRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Auth Routes (Register, etc)
app.use('/api/auth', authRoutes);

// Forgot Password Routes
app.use('/api/forgot-password', forgotPasswordRoutes);

// ============ ERROR HANDLING ============
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan',
        path: req.path,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Terjadi error di server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============ START SERVER ============
const server = app.listen(PORT, () => {
    console.log('\n====================================');
    console.log('🚀 Ticketing Backend Server Started');
    console.log('====================================');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📱 WhatsApp Session: ${process.env.WHATSAPP_SESSION_NAME}`);
    console.log('====================================\n');

    // Initialize WhatsApp Client
    console.log('⏳ Initializing WhatsApp Bot...');
    initWhatsAppClient();

    // Clean expired OTPs every 5 minutes
    setInterval(() => {
        cleanExpiredOTPs();
    }, 5 * 60 * 1000);
});

// Handle server errors
server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.log(`\n⚠️  Port ${PORT} sudah dipakai aplikasi lain!`);
        console.log('💡 Solusi: Kill process yang pakai port ini atau ubah PORT di .env\n');
    }
});

// ============ GRACEFUL SHUTDOWN ============
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Shutting down server...');
    disconnectWhatsApp();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n⏹️  Shutting down server...');
    disconnectWhatsApp();
    process.exit(0);
});

export default app;
