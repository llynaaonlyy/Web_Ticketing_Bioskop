# 📖 TICKETING BACKEND - DOCUMENTATION INDEX

**Welcome!** Ini adalah dokumentasi lengkap untuk Ticketing Backend system dengan WhatsApp OTP forgot password.

---

## 🎯 START HERE

Pilih sesuai kebutuhan Anda:

### 👤 Saya Baru Pertama Kali Setup
👉 **Baca:** [QUICKSTART.md](QUICKSTART.md)
- 5 menit untuk understand sistem
- Step-by-step instruksi
- Testing checklist

### 🔧 Saya Ingin Detail Setup Instructions
👉 **Baca:** [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- Instalasi dependencies
- Konfigurasi environment
- WhatsApp bot setup
- Troubleshooting guide

### 💻 Saya Ingin Integrate ke Frontend
👉 **Baca:** [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- Complete HTML code
- Complete JavaScript code
- Integration checklist
- Debugging tips

### 🚀 Saya Sudah Ready dan Mau Langkah Selanjutnya
👉 **Baca:** [NEXT_STEPS.md](NEXT_STEPS.md)
- Frontend implementation
- Testing walkthrough
- Production deployment
- Best practices

### 📚 Saya Ingin Detail Teknis API
👉 **Baca:** [README.md](README.md)
- Complete API documentation
- Endpoint specifications
- Request/response examples
- Error handling

### 📱 Saya Ingin Test dengan Postman
👉 **Import:** [Postman_Collection.json](Postman_Collection.json)
- 4 ready-to-use requests
- Example payloads
- Expected responses

---

## 📊 QUICK OVERVIEW

### Apa ini?
Backend system untuk **forgot password** dengan OTP yang dikirim via **WhatsApp Web.js**.

### Fitur:
- ✅ Express.js backend
- ✅ WhatsApp bot integration
- ✅ 6-digit OTP generation
- ✅ OTP validation & expiry
- ✅ Password reset functionality
- ✅ JSON database simulation
- ✅ Complete API documentation
- ✅ Postman testing collection

### Tech Stack:
- **Runtime:** Node.js
- **Framework:** Express.js
- **WhatsApp:** WhatsApp Web.js
- **Database:** JSON file (simulasi)
- **Port:** 5000 (default)

---

## 📁 FOLDER STRUCTURE

```
D:\ticketing-backend/
├── 📄 server.js                    Main entry point
├── 📄 package.json                 Dependencies
├── 📄 .env                         Configuration
│
├── 📁 services/                    Business logic
│   ├── otpService.js              
│   ├── whatsappService.js         
│   └── userService.js             
│
├── 📁 controllers/                 Request handling
│   └── forgotPasswordController.js
│
├── 📁 routes/                      API endpoints
│   └── forgotPasswordRoutes.js
│
├── 📁 data/                        Database
│   └── data.json
│
└── 📚 Documentation
    ├── 📖 INDEX.md                 (File ini)
    ├── 📖 README.md                Full API docs
    ├── 📖 QUICKSTART.md            Quick start
    ├── 📖 SETUP_INSTRUCTIONS.md    Detailed setup
    ├── 📖 FRONTEND_INTEGRATION.md  Frontend guide
    ├── 📖 NEXT_STEPS.md            Next steps
    ├── 📖 SUMMARY.md               Overview
    ├── 📖 Postman_Collection.json  Testing
    └── 📖 INDEX.md                 This file
```

---

## 🚀 QUICK START (3 STEPS)

### 1. Install
```bash
cd D:\ticketing-backend
npm install
```

### 2. Run
```bash
npm run dev
```

### 3. Setup WhatsApp
- Scan QR code dari terminal dengan WhatsApp
- Tunggu bot ready (di terminal)

**Done!** Server running di `http://localhost:5000`

---

## 📚 DOCUMENTATION MAP

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **INDEX.md** (ini) | Roadmap & overview | 5 min |
| **QUICKSTART.md** | Get running ASAP | 10 min |
| **SETUP_INSTRUCTIONS.md** | Detailed installation | 20 min |
| **README.md** | API reference | 15 min |
| **FRONTEND_INTEGRATION.md** | Frontend code | 25 min |
| **NEXT_STEPS.md** | After backend ready | 15 min |
| **SUMMARY.md** | Project summary | 10 min |
| **Postman_Collection.json** | Testing tool | 5 min |

**Total Read Time:** ~90 minutes (pilih sesuai kebutuhan)

---

## 🎯 COMMON WORKFLOWS

### Workflow 1: First Time Setup
```
1. Read QUICKSTART.md
2. Run: npm install
3. Run: npm run dev
4. Scan QR code
5. Test with Postman
6. Done!
```
⏱️ **Time:** 15 minutes

---

### Workflow 2: Integrate Frontend
```
1. Read FRONTEND_INTEGRATION.md
2. Create forgot-password.html
3. Create forgot-password.js
4. Update login.html link
5. Test in browser
6. Debug if needed
7. Done!
```
⏱️ **Time:** 1-2 hours

---

### Workflow 3: Full Implementation
```
1. Setup backend (15 min)
2. Integrate frontend (1-2 hours)
3. Test everything (1 hour)
4. Deploy (1-2 hours)
```
⏱️ **Time:** 3-5 hours total

---

## 🔗 API ENDPOINTS QUICK REFERENCE

```
POST   /api/forgot-password/request-otp     Generate & send OTP
POST   /api/forgot-password/verify-otp      Verify OTP
POST   /api/forgot-password/reset-password  Update password
GET    /api/forgot-password/bot-status      Check bot status
GET    /api/health                          Server health
```

**Full details:** See [README.md](README.md)

---

## 🧪 TESTING QUICK START

### Test with Postman:
1. Import: `Postman_Collection.json`
2. Run 4 requests in order
3. Check responses

### Test with cURL:
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/forgot-password/bot-status
```

### Test with Browser:
```
http://localhost:5000/api/health
http://localhost:5000/api/forgot-password/bot-status
```

---

## 📋 FORGOT PASSWORD FLOW

```
User klik "Lupa Sandi"
    ↓
Step 1: Input nama & nomor HP
  → Backend: Generate OTP
  → Backend: Kirim ke WhatsApp
  → Frontend: Show success
    ↓
Step 2: Input OTP (dari WhatsApp)
  → Backend: Validasi OTP
  → Frontend: Show success
    ↓
Step 3: Input sandi baru
  → Backend: Update password
  → Frontend: Show success & redirect login
    ↓
Login dengan sandi baru ✅
```

---

## ⚙️ CONFIGURATION

### Key Settings (.env):
```
PORT=5000                      Server port
OTP_EXPIRY_MINUTES=15         OTP valid duration
OTP_MAX_ATTEMPTS=3            Max wrong attempts
FRONTEND_URL=http://localhost:3000
```

**Edit .env untuk customize**

---

## 🆘 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Port 5000 taken | Change PORT in .env |
| CORS error | Check FRONTEND_URL in .env |
| Bot not ready | Scan QR code in terminal |
| Module not found | Run: npm install |
| OTP expires | Default 15 min, change OTP_EXPIRY_MINUTES |

**More help:** See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

## 📞 SUPPORT & HELP

### I need help with...

- **Installation:** → [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
- **API usage:** → [README.md](README.md)
- **Frontend:** → [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- **Quick start:** → [QUICKSTART.md](QUICKSTART.md)
- **Next steps:** → [NEXT_STEPS.md](NEXT_STEPS.md)
- **Testing:** → [Postman_Collection.json](Postman_Collection.json)
- **Overview:** → [SUMMARY.md](SUMMARY.md)

---

## ✅ PROJECT CHECKLIST

### Before using backend:
- [ ] Node.js installed
- [ ] npm installed
- [ ] Read QUICKSTART.md
- [ ] Run: npm install
- [ ] Run: npm run dev
- [ ] Bot ready status

### Before integrating frontend:
- [ ] Backend running
- [ ] Bot status: Ready
- [ ] Tested API in Postman
- [ ] Read FRONTEND_INTEGRATION.md
- [ ] Created HTML & JS files

### Before deployment:
- [ ] Full end-to-end tested
- [ ] No console errors
- [ ] No CORS errors
- [ ] Password updates verified
- [ ] Documentation reviewed

---

## 🎓 LEARNING RESOURCES

- **Express.js:** https://expressjs.com
- **WhatsApp Web.js:** https://docs.wwebjs.dev
- **Node.js:** https://nodejs.org
- **Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## 🚀 NEXT STEPS

### Option 1: Immediate Action
```bash
cd D:\ticketing-backend
npm install
npm run dev
```
→ Then read [QUICKSTART.md](QUICKSTART.md)

### Option 2: Learn First
→ Read [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) first
→ Then follow installation steps

### Option 3: Integration Now
→ Read [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
→ Create HTML & JS files
→ Test integration

---

## 📊 STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Backend | ✅ Ready | Production ready |
| API Endpoints | ✅ Ready | 5 endpoints |
| WhatsApp Bot | ✅ Ready | Needs QR scan |
| Frontend Guide | ✅ Ready | Complete code |
| Documentation | ✅ Ready | Comprehensive |
| Postman Collection | ✅ Ready | 4 test cases |

---

## 🎉 YOU'RE ALL SET!

Your backend is **fully functional and documented**.

### Pick your next step:

1. **New to this?** → [QUICKSTART.md](QUICKSTART.md)
2. **Want details?** → [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
3. **Ready frontend?** → [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
4. **Need API docs?** → [README.md](README.md)
5. **Testing?** → [Postman_Collection.json](Postman_Collection.json)
6. **What's next?** → [NEXT_STEPS.md](NEXT_STEPS.md)

---

**Happy coding!** 🚀

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Maintainer:** Your Team
