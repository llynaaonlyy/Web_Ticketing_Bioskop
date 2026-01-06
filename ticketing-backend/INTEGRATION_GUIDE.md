# 🚀 Panduan Lengkap: Integrasi Forgot Password dengan Frontend

## 📌 Overview

Anda sekarang punya sistem forgot password yang lengkap:
- **Backend**: API REST dengan OTP via WhatsApp
- **Frontend**: HTML, CSS, JavaScript yang sudah siap pakai

## 🎯 File-File yang Tersedia

```
d:\projek_ticketing\ticketing-backend\
├── frontend-forgot-password.html    ← Buka file ini di browser
├── frontend-forgot-password.js      ← Logic JavaScript
├── server.js                         ← Backend API
└── SETUP_INSTRUCTIONS.md            ← Setup lengkap
```

---

## ⚡ Quick Start (5 Menit)

### 1️⃣ **Pastikan Backend Berjalan**

```bash
cd d:\projek_ticketing\ticketing-backend
npm install
npm run dev
```

Hasilnya:
```
✓ Server berjalan di http://localhost:5000
✓ CORS enabled untuk frontend
✓ WhatsApp Bot siap (jika sudah ter-scan QR Code)
```

### 2️⃣ **Buka Frontend**

Pilih **SALAH SATU** cara:

#### Option A: Browser Langsung (Mudah)
```
Buka file: d:\projek_ticketing\ticketing-backend\frontend-forgot-password.html
Dengan browser (Chrome, Firefox, Edge, dll)
```

#### Option B: Local Server (Recommended)
```bash
# Menggunakan Python
python -m http.server 8000

# Atau jika menggunakan Node.js http-server
npx http-server

# Kemudian buka: http://localhost:8000/frontend-forgot-password.html
```

### 3️⃣ **Test di Frontend**

```
Nama: John Doe
No HP: 6281234567890

Klik: "Minta Kode OTP"

Jika WhatsApp Bot belum siap:
→ Akan muncul OTP untuk testing
Contoh: 123456

Input OTP yang ditampilkan
Buat sandi baru
Done! ✓
```

---

## 🔧 Integrasi ke Project Anda

### **Jika Pakai React:**

```jsx
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
```

Kemudian di `components/ForgotPassword.jsx`:
```jsx
export default function ForgotPassword() {
  return (
    <iframe 
      src="http://localhost:5000/frontend-forgot-password.html"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  );
}
```

### **Jika Pakai Vue:**

```vue
<template>
  <div class="forgot-password">
    <iframe 
      :src="forgotPasswordUrl"
      style="width: 100%; height: 100vh; border: none;"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      forgotPasswordUrl: 'http://localhost:5000/frontend-forgot-password.html'
    }
  }
}
</script>
```

### **Jika Pakai HTML Biasa:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- Menu Login -->
  <div class="login-container">
    <button onclick="goToForgotPassword()">Lupa Sandi?</button>
  </div>

  <!-- Forgot Password Container -->
  <div id="forgotPasswordContainer" style="display: none;">
    <iframe 
      id="forgotPasswordFrame"
      src="http://localhost:5000/frontend-forgot-password.html"
      style="width: 100%; height: 600px; border: none; border-radius: 8px;"
    />
  </div>

  <script>
    function goToForgotPassword() {
      document.getElementById('forgotPasswordContainer').style.display = 'block';
    }
  </script>
</body>
</html>
```

---

## 🎨 Customization

### **Ubah URL Login (Redirect Setelah Sukses)**

Edit di `frontend-forgot-password.js`, cari:

```javascript
function redirectToLogin() {
    // Change this URL to your actual login page
    window.location.href = '/login.html';
}
```

Ubah jadi:
```javascript
function redirectToLogin() {
    window.location.href = 'http://localhost:3000/login';
    // atau
    window.location.href = '/auth/login';
}
```

### **Ubah Warna/Theme**

Edit di `frontend-forgot-password.html`, cari bagian `:root` atau ubah color:

```css
/* Default: Ungu */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Ubah ke Biru */
background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);

/* Ubah ke Hijau */
background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
```

### **Ubah API URL (Jika Backend di URL Lain)**

Edit di `frontend-forgot-password.js`:

```javascript
// Sebelum:
const API_BASE_URL = 'http://localhost:5000/api/forgot-password';

// Sesudah (contoh):
const API_BASE_URL = 'http://192.168.1.10:5000/api/forgot-password';
// atau
const API_BASE_URL = 'https://api.ticketing.com/api/forgot-password';
```

---

## 🐛 Troubleshooting

### **Masalah: "Cannot GET /api/forgot-password/request-otp"**

❌ Backend tidak berjalan
✅ Solusi:
```bash
cd d:\projek_ticketing\ticketing-backend
npm run dev
```

### **Masalah: CORS Error**

❌ Frontend URL tidak match dengan .env
✅ Solusi:
- Edit `.env` di backend
- Set `FRONTEND_URL=http://localhost:3000` (sesuai dengan port frontend Anda)
- Restart backend: `npm run dev`

### **Masalah: OTP tidak dikirim ke WhatsApp**

❌ WhatsApp Bot belum ter-scan
✅ Solusi:
1. Buka terminal backend
2. Cari QR Code yang ditampilkan
3. Scan dengan WhatsApp HP Anda
4. Tunggu sampai status berubah "Ready"

### **Masalah: "User tidak ditemukan"**

❌ Nama atau No HP tidak match dengan data di `data/data.json`
✅ Solusi:
1. Cek file `data/data.json`
2. Pastikan nama dan no HP sudah terdaftar
3. Atau tambahkan user baru ke `data/data.json`

Contoh format:
```json
{
  "id": "user123",
  "nama": "John Doe",
  "noHp": "6281234567890",
  "email": "john@example.com",
  "password": "hashedpassword"
}
```

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────────────┐
│       USER BUKA FORGOT PASSWORD             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Input Nama & No HP                 │
│  ├─ Frontend validasi input                 │
│  └─ POST /request-otp                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend Process:                           │
│  ├─ Cek apakah user ada di database         │
│  ├─ Generate OTP 6 digit                    │
│  ├─ Simpan OTP ke memory (15 menit)        │
│  ├─ Kirim via WhatsApp Bot                  │
│  └─ Return status ke frontend               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Input OTP (Timer 15 menit)         │
│  ├─ User input 6 digit OTP                  │
│  └─ POST /verify-otp                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend Verify:                            │
│  ├─ Cek OTP di memory                       │
│  ├─ Validasi (belum expired, benar)         │
│  └─ Return status ke frontend               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  STEP 3: Input Sandi Baru                   │
│  ├─ User input sandi baru                   │
│  ├─ Validasi format                         │
│  └─ POST /reset-password                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Backend Reset:                             │
│  ├─ Update password di database             │
│  ├─ Hapus OTP dari memory                   │
│  └─ Return success                          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  ✓ SUCCESS - Redirect ke Login              │
└─────────────────────────────────────────────┘
```

---

## 🔐 Security Features

✅ **OTP Auto-Expire**: 15 menit (configurable di .env)
✅ **Max Attempts**: 3 kali gagal (configurable di .env)
✅ **Password Validation**: Minimal 6 karakter
✅ **CORS Protection**: Hanya accept request dari frontend URL yang terdaftar
✅ **Data Persistence**: Hanya di memory (bisa diubah ke database)

---

## 📱 API Endpoints

### 1️⃣ Request OTP
```
POST /api/forgot-password/request-otp

Body:
{
  "nama": "John Doe",
  "noHp": "6281234567890"
}

Response Success:
{
  "success": true,
  "message": "OTP berhasil dikirim ke WhatsApp Anda",
  "phoneNumber": "6281234567890"
}
```

### 2️⃣ Verify OTP
```
POST /api/forgot-password/verify-otp

Body:
{
  "noHp": "6281234567890",
  "otp": "123456"
}

Response Success:
{
  "success": true,
  "message": "OTP berhasil diverifikasi"
}
```

### 3️⃣ Reset Password
```
POST /api/forgot-password/reset-password

Body:
{
  "noHp": "6281234567890",
  "otp": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response Success:
{
  "success": true,
  "message": "Sandi berhasil diperbarui"
}
```

### 4️⃣ Check Bot Status
```
GET /api/forgot-password/bot-status

Response:
{
  "success": true,
  "data": {
    "initialized": true,
    "ready": true,
    "status": "Ready"
  }
}
```

---

## 🎓 Contoh Testing dengan Postman

### Setup Postman:

1. **New Request** → POST
2. URL: `http://localhost:5000/api/forgot-password/request-otp`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "nama": "John Doe",
  "noHp": "6281234567890"
}
```
5. Click **Send**

Expected Response:
```json
{
  "success": true,
  "message": "OTP berhasil dikirim ke WhatsApp Anda",
  "phoneNumber": "6281234567890"
}
```

---

## 💡 Tips & Tricks

### **Development Mode**
- Backend akan return testOTP di response jika WhatsApp Bot belum ready
- Gunakan testOTP untuk testing tanpa WhatsApp

### **Production Mode**
- Ensure WhatsApp Bot sudah authenticated
- Disable testOTP di response (security)
- Setup proper database (not just JSON file)
- Use HTTPS instead of HTTP
- Setup environment variables di `.env`

### **Performance**
- OTP disimpan di memory (fast)
- Bisa diubah ke Redis untuk scalability
- Jika banyak user, pertimbangkan database

---

## 📞 Support

Jika ada error atau pertanyaan:

1. **Check Backend Console** untuk error messages
2. **Check Browser Console** (F12) untuk frontend errors
3. **Verify Backend URL** di `frontend-forgot-password.js`
4. **Verify CORS Settings** di `server.js`
5. **Restart Backend** jika ada perubahan di `.env`

---

## ✅ Checklist Sebelum Deploy

- [ ] Backend sudah tested di Postman
- [ ] Frontend sudah tested di browser
- [ ] WhatsApp Bot sudah authenticated
- [ ] Database sudah ter-setup (atau gunakan JSON)
- [ ] Environment variables sudah di `.env`
- [ ] CORS URL sudah match dengan frontend
- [ ] Password validation sudah sesuai requirement
- [ ] Error handling sudah tested
- [ ] Timer dan auto-expire sudah work
- [ ] Redirect URL sudah correct

---

## 🚀 Next Steps

Setelah forgot password jalan:

1. **Integrasi ke Login Page**
   - Tambahkan link "Lupa Sandi?" di form login
   - Redirect ke `/forgot-password`

2. **Setup Database**
   - Ganti JSON file dengan MySQL/MongoDB
   - Update `userService.js`

3. **Production Deploy**
   - Setup domain dan HTTPS
   - Configure environment variables
   - Deploy backend ke server

4. **Email Notification**
   - Tambahkan email konfirmasi setelah password reset
   - Implementasi di `resetPassword` controller

5. **Security Hardening**
   - Rate limiting untuk prevent brute force
   - IP blocking untuk multiple failed attempts
   - Audit logging untuk semua aktivitas

---

**Good luck! Selamat menggunakan forgot password system! 🎉**
