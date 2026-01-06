# Ticketing Backend - OTP Forgot Password with WhatsApp Integration

Sistem backend untuk menangani forgot password dengan OTP yang dikirim via WhatsApp Web.

## 📋 Fitur Utama

- ✅ Generate dan kirim OTP (6 digit) via WhatsApp
- ✅ Validasi OTP dengan limit percobaan
- ✅ Reset password setelah OTP terverifikasi
- ✅ OTP auto-expire setelah 15 menit
- ✅ Simulasi database JSON (no real database)
- ✅ CORS enabled untuk frontend
- ✅ Testable di Postman

## 🚀 Instalasi & Setup

### 1. Install Dependencies

```bash
cd D:\ticketing-backend
npm install
```

### 2. Konfigurasi .env

File `.env` sudah dibuat. Modifikasi sesuai kebutuhan:

```
PORT=5000
NODE_ENV=development
OTP_EXPIRY_MINUTES=15
OTP_MAX_ATTEMPTS=3
FRONTEND_URL=http://localhost:3000
WHATSAPP_SESSION_NAME=ticketing-bot
```

### 3. Jalankan Server

**Development (dengan nodemon):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

### 4. Setup WhatsApp Bot

Saat server pertama kali dijalankan:
1. **Terminal akan menampilkan QR Code**
2. **Scan QR Code menggunakan WhatsApp**
3. **Bot akan ter-authenticate**
4. **Status berubah menjadi "Ready"**

## 📚 API Endpoints

### 1. Check Bot Status
```
GET http://localhost:5000/api/forgot-password/bot-status
```
**Response:**
```json
{
  "success": true,
  "data": {
    "initialized": true,
    "ready": true,
    "status": "Ready"
  }
}
```

### 2. Request OTP (Step 1)
```
POST http://localhost:5000/api/forgot-password/request-otp
Content-Type: application/json

{
  "nama": "John Doe",
  "noHp": "6281234567890"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP berhasil dikirim ke WhatsApp Anda",
  "phoneNumber": "6281234567890"
}
```

**If WhatsApp Bot not ready (for testing):**
```json
{
  "success": true,
  "message": "OTP sudah digenerate, tapi WhatsApp Bot belum siap...",
  "testOTP": "123456",
  "phoneNumber": "6281234567890"
}
```

### 3. Verify OTP (Step 2)
```
POST http://localhost:5000/api/forgot-password/verify-otp
Content-Type: application/json

{
  "noHp": "6281234567890",
  "otp": "123456"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP berhasil diverifikasi",
  "data": {
    "otpId": 1704067200000
  }
}
```

### 4. Reset Password (Step 3)
```
POST http://localhost:5000/api/forgot-password/reset-password
Content-Type: application/json

{
  "noHp": "6281234567890",
  "otp": "123456",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Sandi berhasil diperbarui. Silakan login dengan sandi baru Anda"
}
```

## 📊 Data Structure

### data.json

```json
{
  "users": [
    {
      "id": 1,
      "nama": "John Doe",
      "email": "john@example.com",
      "noHp": "6281234567890",
      "password": "hashedPassword"
    }
  ],
  "otps": [
    {
      "id": 1704067200000,
      "phoneNumber": "6281234567890",
      "otp": "123456",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "expiresAt": "2024-01-01T10:15:00.000Z",
      "attempts": 0,
      "verified": false
    }
  ]
}
```

## 🧪 Testing di Postman

### Collection Flow:

1. **Check Bot Status** → Pastikan bot ready
2. **Request OTP** → Generate & kirim OTP
3. **Verify OTP** → Validasi OTP yang dikirim
4. **Reset Password** → Update password

### Catatan Testing:
- User test: `John Doe` dengan nomor `6281234567890`
- Jika WhatsApp Bot belum ready, response akan include `testOTP` untuk testing
- OTP valid selama 15 menit
- Max 3x percobaan salah sebelum OTP di-reset

## 🔄 Frontend Integration

### Contoh Fetch dari Frontend:

```javascript
// Step 1: Request OTP
fetch('http://localhost:5000/api/forgot-password/request-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nama: 'John Doe',
    noHp: '6281234567890'
  })
}).then(res => res.json()).then(data => console.log(data));

// Step 2: Verify OTP
fetch('http://localhost:5000/api/forgot-password/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    noHp: '6281234567890',
    otp: '123456'
  })
}).then(res => res.json()).then(data => console.log(data));

// Step 3: Reset Password
fetch('http://localhost:5000/api/forgot-password/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    noHp: '6281234567890',
    otp: '123456',
    newPassword: 'newPass123',
    confirmPassword: 'newPass123'
  })
}).then(res => res.json()).then(data => console.log(data));
```

## 📁 Folder Structure

```
D:\ticketing-backend/
├── config/
├── services/
│   ├── otpService.js          (OTP logic)
│   ├── whatsappService.js     (WhatsApp bot)
│   └── userService.js         (User management)
├── controllers/
│   └── forgotPasswordController.js
├── routes/
│   └── forgotPasswordRoutes.js
├── data/
│   └── data.json              (Simulasi database)
├── .wwebjs_auth/              (WhatsApp session - auto created)
├── .env                       (Environment config)
├── server.js                  (Main server)
├── package.json
└── README.md
```

## ⚠️ Important Notes

1. **WhatsApp Web.js**: Requires Puppeteer (headless browser). Pastikan sudah install dengan `npm install`
2. **Session Storage**: WhatsApp session disimpan di `.wwebjs_auth/` folder
3. **Data Persistence**: Data disimpan di `data/data.json` (bukan real database)
4. **OTP Cleanup**: OTP expired otomatis di-clean setiap 5 menit
5. **CORS**: Hanya accept dari `http://localhost:3000` (sesuai `FRONTEND_URL` di .env)

## 🐛 Troubleshooting

### WhatsApp Bot tidak connect
- Restart server
- Hapus folder `.wwebjs_auth/`
- Scan QR code lagi

### CORS Error dari Frontend
- Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend
- Restart server setelah ubah `.env`

### Port sudah digunakan
- Ubah `PORT` di `.env`
- Atau kill process: `lsof -ti:5000 | xargs kill -9` (Linux/Mac) atau `netstat -ano | findstr :5000` (Windows)

## 📞 Support

Untuk bantuan, check:
- Folder `services/` untuk logika OTP & WhatsApp
- File `controllers/` untuk business logic
- File `routes/` untuk endpoint definition

---

**Dibuat untuk: Web Ticketing System**
**Status: Production Ready** ✅