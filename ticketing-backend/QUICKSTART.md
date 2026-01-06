# 🚀 QUICK START GUIDE

## Cara Menjalankan Backend Ticketing

### Step 1: Install Dependencies

```bash
cd D:\ticketing-backend
npm install
```

⏳ Tunggu proses instalasi selesai (2-5 menit)

---

### Step 2: Jalankan Server

```bash
npm run dev
```

Output akan terlihat seperti:

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

---

### Step 3: Scan QR Code untuk WhatsApp Bot

1. Terminal akan menampilkan **QR Code**
2. **Buka WhatsApp di HP Anda**
3. **Tap 3 titik (menu) → Linked Devices**
4. **Tap "Link a device"**
5. **Scan QR Code dari terminal**
6. Tunggu hingga muncul: `✅ WhatsApp Bot Ready!`

---

## 📍 Test Endpoints

### Option A: Menggunakan cURL

```bash
# Test 1: Check Bot Status
curl http://localhost:5000/api/forgot-password/bot-status

# Test 2: Request OTP
curl -X POST http://localhost:5000/api/forgot-password/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"nama\":\"John Doe\",\"noHp\":\"6281234567890\"}"

# Test 3: Verify OTP (gunakan OTP dari response Test 2)
curl -X POST http://localhost:5000/api/forgot-password/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"noHp\":\"6281234567890\",\"otp\":\"123456\"}"

# Test 4: Reset Password
curl -X POST http://localhost:5000/api/forgot-password/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"noHp\":\"6281234567890\",\"otp\":\"123456\",\"newPassword\":\"newPass123\",\"confirmPassword\":\"newPass123\"}"
```

### Option B: Menggunakan Postman

1. **Import file:** `D:\ticketing-backend\Postman_Collection.json`
2. **Jalankan setiap request secara berurutan**

---

## 📂 File-File Penting

| File | Deskripsi |
|------|-----------|
| `.env` | Konfigurasi (port, OTP timeout, dll) |
| `data/data.json` | Database simulasi (users & OTP) |
| `server.js` | Main server file |
| `services/otpService.js` | OTP logic (generate, verify, validate) |
| `services/whatsappService.js` | WhatsApp Bot integration |
| `controllers/forgotPasswordController.js` | Business logic |
| `routes/forgotPasswordRoutes.js` | API endpoints |

---

## 🔍 Debugging

### Lihat OTP yang digenerate

Buka file: `D:\ticketing-backend\data\data.json`

Cek bagian `"otps"` array untuk melihat OTP yang aktif.

---

### Bot Status

Akses di browser: `http://localhost:5000/api/forgot-password/bot-status`

Response:
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

---

## 🧪 Testing Data

**User yang tersedia di data.json:**

| Nama | No HP | Password |
|------|-------|----------|
| John Doe | 6281234567890 | (any) |
| Jane Smith | 6289876543210 | (any) |

**Testing Flow:**
1. Gunakan nama & nomor HP dari tabel di atas
2. Request OTP → Response akan include `testOTP`
3. Gunakan `testOTP` untuk verify
4. Reset password dengan sandi baru

---

## 🛑 Stop Server

Tekan: **CTRL + C** di terminal

---

## 📚 Dokumentasi Lengkap

- **Backend API:** `D:\ticketing-backend\README.md`
- **Frontend Integration:** `D:\ticketing-backend\FRONTEND_INTEGRATION.md`
- **Postman Collection:** `D:\ticketing-backend\Postman_Collection.json`

---

## ✅ Checklist

- [ ] Dependencies terinstall (`npm install` selesai)
- [ ] Server berjalan (`npm run dev` berjalan)
- [ ] WhatsApp Bot ready (QR code sudah di-scan)
- [ ] Bot status menunjukkan "Ready"
- [ ] Bisa akses `http://localhost:5000/api/forgot-password/bot-status`
- [ ] Test di Postman atau cURL berhasil
- [ ] Sandi berhasil diubah di data.json

---

**Siap! Backend Anda sudah fully operational.** 🎉

Untuk integrasi frontend, baca: `FRONTEND_INTEGRATION.md`
