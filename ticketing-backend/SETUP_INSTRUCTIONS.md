# 📖 SETUP INSTRUCTIONS - Complete Guide

Panduan lengkap setup backend ticketing dengan OTP forgot password via WhatsApp.

---

## 📦 Struktur Project yang Sudah Dibuat

```
D:\ticketing-backend/
├── config/                    (folder untuk config files)
├── services/
│   ├── otpService.js         ✅ OTP generation, validation, expiry
│   ├── whatsappService.js    ✅ WhatsApp bot initialization & sending
│   └── userService.js        ✅ User data management
├── controllers/
│   └── forgotPasswordController.js  ✅ Business logic untuk 3 steps
├── routes/
│   └── forgotPasswordRoutes.js      ✅ API endpoints definition
├── data/
│   └── data.json             ✅ Simulasi database (JSON file)
├── .wwebjs_auth/             ✅ WhatsApp session storage (auto-created)
├── server.js                 ✅ Main Express server
├── package.json              ✅ Dependencies configuration
├── .env                      ✅ Environment variables
├── README.md                 ✅ Full API documentation
├── FRONTEND_INTEGRATION.md   ✅ Frontend setup guide
├── QUICKSTART.md             ✅ Quick start guide
├── Postman_Collection.json   ✅ Postman API testing
└── SETUP_INSTRUCTIONS.md     ✅ File ini
```

---

## 🎯 Fitur yang Sudah Diimplementasi

### ✅ Backend Features:
- [x] Express.js server setup
- [x] WhatsApp Web.js integration
- [x] OTP generation (6 digit random)
- [x] OTP storage in JSON file (simulate database)
- [x] OTP expiry (15 menit default)
- [x] OTP validation dengan limit attempt (3x default)
- [x] User data management dari JSON
- [x] Password update functionality
- [x] CORS enabled untuk frontend
- [x] Complete API error handling
- [x] Environment configuration

### ✅ API Endpoints:
- [x] `POST /api/forgot-password/request-otp` - Step 1
- [x] `POST /api/forgot-password/verify-otp` - Step 2
- [x] `POST /api/forgot-password/reset-password` - Step 3
- [x] `GET /api/forgot-password/bot-status` - Check bot status
- [x] `GET /api/health` - Server health check

### ✅ Documentation:
- [x] API endpoints documentation
- [x] Frontend integration guide
- [x] Quick start guide
- [x] Postman collection untuk testing
- [x] Setup instructions (ini)

---

## 🚀 INSTALLATION STEPS

### Step 1: Verify Node.js Installation

```bash
node --version
npm --version
```

Harus menunjukkan versi. Jika tidak terinstall, download dari [nodejs.org](https://nodejs.org)

### Step 2: Navigate to Backend Folder

```bash
cd D:\ticketing-backend
```

### Step 3: Install Dependencies

```bash
npm install
```

**Dependencies yang akan diinstall:**
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `whatsapp-web.js` - WhatsApp automation
- `qrcode-terminal` - QR code di terminal
- `body-parser` - Parse request body
- `nodemon` - Auto-restart saat development

**Waktu instalasi:** 2-5 menit (tergantung internet)

### Step 4: Verify Installation

```bash
npm list
```

Akan menampilkan semua installed packages.

---

## ⚙️ KONFIGURASI

### File .env

Sudah dibuat dan siap digunakan. Jika perlu modifikasi:

```env
PORT=5000                           # Port server
NODE_ENV=development               # Environment mode
OTP_LENGTH=6                        # Panjang OTP
OTP_EXPIRY_MINUTES=15             # Waktu berlaku OTP
OTP_MAX_ATTEMPTS=3                # Max percobaan OTP salah
FRONTEND_URL=http://localhost:3000 # URL frontend
WHATSAPP_SESSION_NAME=ticketing-bot # Nama session WhatsApp
DEBUG=true                          # Debug mode
```

**Perubahan yang mungkin:**
- Ubah `PORT` jika port 5000 sudah terpakai
- Ubah `FRONTEND_URL` sesuai port frontend Anda
- Ubah `OTP_EXPIRY_MINUTES` jika ingin timeout OTP berbeda

---

## 🚀 MENJALANKAN SERVER

### Development Mode (Recommended)

```bash
npm run dev
```

**Kelebihan:**
- Auto-restart saat ada perubahan file (nodemon)
- Lebih mudah untuk development

**Output yang diharapkan:**
```
====================================
🚀 Ticketing Backend Server Started
====================================
📍 Server running at: http://localhost:5000
🔗 Frontend URL: http://localhost:3000
📱 WhatsApp Session: ticketing-bot
====================================

⏳ Initializing WhatsApp Bot...
```

### Production Mode

```bash
npm start
```

---

## 📱 SETUP WHATSAPP BOT (PENTING!)

### Saat Server Pertama Kali Dijalankan:

1. Terminal akan menampilkan **QR Code ASCII**
2. QR Code juga akan di-print sebagai teks: `QR CODE: <base64-string>`
3. **Ambil HP Anda dan buka WhatsApp**
4. Tap **3 titik (menu) → Linked Devices** (di bagian bawah)
5. Tap **Link a device**
6. **Scan QR Code dari terminal** dengan camera HP
7. Tunggu proses linking...

### Status WhatsApp Bot:

Jika sukses, terminal akan menampilkan:
```
✅ WhatsApp Bot Authenticated!
✅ WhatsApp Bot Ready!
```

Jika ada error:
```
❌ Authentication failure: ...
```

Solusi:
- Restart server: `CTRL + C` kemudian `npm run dev` lagi
- Hapus folder `.wwebjs_auth/` dan scan QR lagi
- Pastikan HP dengan WhatsApp aktif selama linking

---

## 🧪 TESTING API

### Cara 1: Menggunakan Postman

1. **Download Postman** dari [postman.com](https://www.postman.com/downloads/)
2. **Import collection:** `Postman_Collection.json`
3. **Jalankan requests** sesuai urutan

### Cara 2: Menggunakan cURL (Command Line)

```bash
# Test 1: Health Check
curl http://localhost:5000/api/health

# Test 2: Check Bot Status
curl http://localhost:5000/api/forgot-password/bot-status

# Test 3: Request OTP
curl -X POST http://localhost:5000/api/forgot-password/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"nama\":\"John Doe\",\"noHp\":\"6281234567890\"}"

# Test 4: Verify OTP
curl -X POST http://localhost:5000/api/forgot-password/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"noHp\":\"6281234567890\",\"otp\":\"<OTP_DARI_RESPONSE>\"}"

# Test 5: Reset Password
curl -X POST http://localhost:5000/api/forgot-password/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"noHp\":\"6281234567890\",\"otp\":\"<OTP>\",\"newPassword\":\"newPass123\",\"confirmPassword\":\"newPass123\"}"
```

### Cara 3: Menggunakan Browser

1. Buka: `http://localhost:5000/api/health`
2. Buka: `http://localhost:5000/api/forgot-password/bot-status`

---

## 📊 TESTING DATA

Pengguna yang tersedia untuk testing di `data/data.json`:

| Nama | Nomor HP | Email |
|------|----------|-------|
| John Doe | 6281234567890 | john@example.com |
| Jane Smith | 6289876543210 | jane@example.com |

**Menggunakan data ini di Step 1 (Request OTP)**

---

## 📁 DATABASE STRUKTUR (data.json)

### Users Array:
```json
{
  "id": 1,
  "nama": "John Doe",
  "email": "john@example.com",
  "noHp": "6281234567890",
  "password": "hashedPassword"
}
```

### OTPs Array:
```json
{
  "id": 1704067200000,
  "phoneNumber": "6281234567890",
  "otp": "123456",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "expiresAt": "2024-01-01T10:15:00.000Z",
  "attempts": 0,
  "verified": false
}
```

**File location:** `D:\ticketing-backend\data\data.json`

---

## 🔗 FRONTEND INTEGRATION

### HTML File yang Dibutuhkan:

Buat file di `D:\web_ticketing\`:
- `forgot-password.html` - UI untuk 3-step forgot password
- `js/forgot-password.js` - Logic untuk handle API calls

**Complete code & setup:** lihat file `FRONTEND_INTEGRATION.md`

---

## 🛡️ SECURITY NOTES

### Features Keamanan yang Sudah Diimplementasi:
- ✅ OTP auto-expire (15 menit default)
- ✅ Limit percobaan (max 3x salah)
- ✅ OTP adalah random 6 digit
- ✅ OTP hanya bisa diverifikasi setelah request
- ✅ Password bisa di-reset setelah OTP verified
- ✅ CORS enabled hanya untuk frontend

### Best Practices untuk Production:
- [ ] Gunakan real database (MongoDB, MySQL) bukan JSON
- [ ] Hash password dengan bcrypt (bukan plain text)
- [ ] Implementasi rate limiting untuk API
- [ ] Use HTTPS (SSL certificate)
- [ ] Implementasi authentication token (JWT)
- [ ] Log semua akses untuk audit trail
- [ ] Implementasi 2FA atau security questions

---

## 🐛 TROUBLESHOOTING

### Error: Port 5000 sudah terpakai

**Solusi:**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Atau ubah PORT di .env
```

### Error: Module not found (whitespace-web.js)

**Solusi:**
```bash
npm install whatsapp-web.js
```

### Error: CORS error dari frontend

**Solusi:**
1. Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend
2. Restart server
3. Clear browser cache

### WhatsApp Bot tidak connect

**Solusi:**
1. Restart server
2. Hapus folder `.wwebjs_auth/`
3. Scan QR code lagi
4. Pastikan HP dengan WhatsApp aktif

### OTP tidak masuk ke WhatsApp

**Possible causes:**
1. Bot belum "Ready" (lihat terminal)
2. Nomor HP tidak valid
3. WhatsApp tidak aktif di HP
4. Bot perlu re-authentication (scan QR code baru)

**Untuk testing:** Response akan include `testOTP` jika bot tidak ready

---

## 📚 DOKUMENTASI REFERENCE

| File | Isi |
|------|-----|
| `README.md` | API documentation lengkap |
| `FRONTEND_INTEGRATION.md` | Setup frontend, HTML & JS |
| `QUICKSTART.md` | Quick start (singkat) |
| `Postman_Collection.json` | Testing collection |
| `SETUP_INSTRUCTIONS.md` | File ini |

---

## ✅ VERIFICATION CHECKLIST

Sebelum production deployment, pastikan:

- [ ] `npm install` sudah selesai
- [ ] Server berjalan: `npm run dev`
- [ ] WhatsApp Bot status: "Ready"
- [ ] API endpoints bisa diakses via Postman/cURL
- [ ] OTP berhasil digenerate
- [ ] OTP berhasil diverifikasi
- [ ] Password berhasil diupdate di data.json
- [ ] Frontend bisa fetch dari backend (test CORS)
- [ ] .env sudah dikonfigurasi sesuai environment
- [ ] Database (data.json) sudah backup

---

## 🎓 LEARNING PATH

Untuk lebih memahami kode:

1. **Start with:** `server.js` - Main entry point
2. **Understand:** `services/` - Business logic
3. **Learn:** `controllers/` - Request handling
4. **Study:** `routes/` - Endpoint definition
5. **Practice:** Postman API calls
6. **Integrate:** Frontend dengan fetch API

---

## 📞 NEXT STEPS

### Setelah Selesai Setup:

1. **Test Backend** - Verify semua API berjalan
2. **Create Frontend** - Buat HTML & JS files
3. **Integrate** - Connect frontend ke backend
4. **Test E2E** - Full flow testing
5. **Deploy** - Production ready

Untuk langkah 2-5, lihat: `FRONTEND_INTEGRATION.md`

---

## 🎉 SELESAI!

Backend Anda sudah fully functional dengan:
- ✅ Express server
- ✅ WhatsApp bot integration
- ✅ OTP system
- ✅ User management
- ✅ Complete API
- ✅ Documentation

**Next:** Baca `FRONTEND_INTEGRATION.md` untuk setup frontend!

---

**Last Updated:** January 2024  
**Version:** 1.0.0
