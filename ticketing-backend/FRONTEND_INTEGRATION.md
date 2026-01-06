# Frontend Integration Guide - Forgot Password dengan OTP

Panduan lengkap untuk mengintegrasikan forgot password system ke frontend web ticketing Anda.

## 🔗 Setup CORS & Connection

### 1. Update Frontend URL di Backend

File: `D:\ticketing-backend\.env`

```env
FRONTEND_URL=http://localhost:3000
```

Ubah sesuai dengan port frontend Anda.

### 2. Pastikan Backend Berjalan

```bash
cd D:\ticketing-backend
npm install
npm run dev
```

Server akan berjalan di `http://localhost:5000`

---

## 💻 Frontend Code Implementation

### Step 1: Create Forgot Password HTML Form

**File: `forgot-password.html`**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Lupa Sandi - Ticketing System</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 500px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h2 { margin-bottom: 20px; color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; color: #555; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        input:focus { outline: none; border-color: #007bff; }
        button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; }
        button:hover { background: #0056b3; }
        .error { color: #dc3545; font-size: 14px; margin-top: 5px; }
        .success { color: #28a745; font-size: 14px; margin-top: 5px; }
        .hidden { display: none; }
        .step-indicator { margin-bottom: 20px; text-align: center; font-size: 14px; color: #666; }
        .step-indicator span { font-weight: bold; color: #007bff; }
        .timer { color: #ff9800; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Lupa Sandi</h2>

        <!-- STEP 1: Input Nama & No HP -->
        <div id="step1" class="step">
            <div class="step-indicator">STEP <span>1</span>/3 - Verifikasi Identitas</div>
            <form id="form-step1">
                <div class="form-group">
                    <label for="nama">Nama Lengkap:</label>
                    <input type="text" id="nama" placeholder="Masukkan nama lengkap Anda" required>
                </div>
                <div class="form-group">
                    <label for="noHp">Nomor WhatsApp:</label>
                    <input type="tel" id="noHp" placeholder="62812345678xx" required>
                </div>
                <button type="submit">Minta Kode OTP</button>
                <div id="error1" class="error"></div>
                <div id="success1" class="success"></div>
            </form>
        </div>

        <!-- STEP 2: Input OTP -->
        <div id="step2" class="step hidden">
            <div class="step-indicator">STEP <span>2</span>/3 - Verifikasi OTP</div>
            <form id="form-step2">
                <div class="form-group">
                    <label>Kode OTP telah dikirim ke WhatsApp Anda</label>
                    <p style="color: #666; font-size: 14px; margin: 10px 0;">Waktu berlaku: <span class="timer" id="timer">15:00</span></p>
                </div>
                <div class="form-group">
                    <label for="otp">Masukkan Kode OTP (6 digit):</label>
                    <input type="text" id="otp" placeholder="000000" maxlength="6" required>
                </div>
                <button type="submit">Verifikasi OTP</button>
                <div id="error2" class="error"></div>
                <div id="success2" class="success"></div>
            </form>
            <p style="text-align: center; margin-top: 15px;">
                <a href="#" onclick="backToStep1()" style="color: #007bff; text-decoration: none;">← Kembali</a>
            </p>
        </div>

        <!-- STEP 3: Reset Password -->
        <div id="step3" class="step hidden">
            <div class="step-indicator">STEP <span>3</span>/3 - Ubah Sandi</div>
            <form id="form-step3">
                <div class="form-group">
                    <label for="newPassword">Sandi Baru (minimal 6 karakter):</label>
                    <input type="password" id="newPassword" placeholder="Masukkan sandi baru" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Konfirmasi Sandi Baru:</label>
                    <input type="password" id="confirmPassword" placeholder="Konfirmasi sandi baru" required>
                </div>
                <button type="submit">Ubah Sandi</button>
                <div id="error3" class="error"></div>
                <div id="success3" class="success"></div>
            </form>
        </div>

        <!-- SUCCESS MESSAGE -->
        <div id="stepSuccess" class="step hidden" style="text-align: center;">
            <h3 style="color: #28a745; margin-bottom: 10px;">✓ Sandi Berhasil Diubah</h3>
            <p style="margin-bottom: 15px;">Silakan login dengan sandi baru Anda.</p>
            <button onclick="redirectToLogin()">Kembali ke Login</button>
        </div>
    </div>

    <script src="forgot-password.js"></script>
</body>
</html>
```

### Step 2: Create JavaScript Logic

**File: `js/forgot-password.js`**

```javascript
const API_BASE_URL = 'http://localhost:5000/api/forgot-password';

let currentStep = 1;
let otpData = {
    noHp: '',
    otp: '',
    otpId: null
};

let timerInterval = null;

// ========== STEP 1: REQUEST OTP ==========
document.getElementById('form-step1').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const noHp = document.getElementById('noHp').value;
    const errorDiv = document.getElementById('error1');
    const successDiv = document.getElementById('success1');

    // Clear previous messages
    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        const response = await fetch(`${API_BASE_URL}/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, noHp })
        });

        const data = await response.json();

        if (data.success) {
            otpData.noHp = noHp;
            successDiv.textContent = '✓ ' + data.message;
            
            // Move to step 2 after 1.5 second
            setTimeout(() => goToStep(2), 1500);
        } else {
            errorDiv.textContent = '✗ ' + data.message;
        }
    } catch (error) {
        errorDiv.textContent = '✗ Error: ' + error.message;
    }
});

// ========== STEP 2: VERIFY OTP ==========
document.getElementById('form-step2').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const otp = document.getElementById('otp').value;
    const errorDiv = document.getElementById('error2');
    const successDiv = document.getElementById('success2');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ noHp: otpData.noHp, otp })
        });

        const data = await response.json();

        if (data.success) {
            otpData.otp = otp;
            otpData.otpId = data.data.otpId;
            successDiv.textContent = '✓ ' + data.message;
            
            setTimeout(() => goToStep(3), 1500);
        } else {
            errorDiv.textContent = '✗ ' + data.message;
        }
    } catch (error) {
        errorDiv.textContent = '✗ Error: ' + error.message;
    }
});

// ========== STEP 3: RESET PASSWORD ==========
document.getElementById('form-step3').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error3');
    const successDiv = document.getElementById('success3');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    // Validation
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = '✗ Sandi baru dan konfirmasi tidak cocok';
        return;
    }

    if (newPassword.length < 6) {
        errorDiv.textContent = '✗ Sandi minimal harus 6 karakter';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                noHp: otpData.noHp,
                otp: otpData.otp,
                newPassword,
                confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            successDiv.textContent = '✓ ' + data.message;
            
            // Move to success screen after 1.5 second
            setTimeout(() => goToStep('success'), 1500);
        } else {
            errorDiv.textContent = '✗ ' + data.message;
        }
    } catch (error) {
        errorDiv.textContent = '✗ Error: ' + error.message;
    }
});

// ========== HELPER FUNCTIONS ==========
function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
    document.getElementById('stepSuccess').classList.add('hidden');

    if (step === 'success') {
        document.getElementById('stepSuccess').classList.remove('hidden');
        if (timerInterval) clearInterval(timerInterval);
    } else {
        document.getElementById('step' + step).classList.remove('hidden');
        currentStep = step;
        
        if (step === 2) {
            startOTPTimer();
        }
    }
}

function backToStep1() {
    goToStep(1);
    // Reset form
    document.getElementById('form-step1').reset();
    document.getElementById('error1').textContent = '';
    document.getElementById('success1').textContent = '';
    otpData = { noHp: '', otp: '', otpId: null };
}

function startOTPTimer() {
    let timeLeft = 15 * 60; // 15 minutes
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('error2').textContent = '✗ OTP sudah expired. Minta OTP baru.';
            backToStep1();
        }
        timeLeft--;
    }

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

function redirectToLogin() {
    // Redirect ke login page
    window.location.href = '/login.html';
}

// ========== INITIALIZE ==========
goToStep(1);
```

---

## 🔗 Integrasi ke HTML Existing

### Di Login Page (`login.html`)

Tambahkan link "Lupa Sandi":

```html
<div style="text-align: center; margin-top: 15px;">
    <p>Belum memiliki akun? <a href="register.html">Daftar</a></p>
    <p><a href="forgot-password.html">Lupa Sandi?</a></p>
</div>
```

---

## ✅ Testing Checklist

- [ ] Backend server berjalan di port 5000
- [ ] Frontend berjalan di port 3000 (atau sesuaikan di `.env`)
- [ ] Bisa access `/api/forgot-password/bot-status`
- [ ] Test Step 1: Request OTP
- [ ] Test Step 2: Verify OTP (gunakan testOTP dari response)
- [ ] Test Step 3: Reset Password
- [ ] Cek data.json sudah terupdate password

---

## 🎯 CORS Troubleshooting

Jika dapat error CORS di frontend:

1. Pastikan `FRONTEND_URL` di `.env` sesuai
2. Restart backend server
3. Clear browser cache
4. Buka console browser (F12) untuk lihat detail error

---

## 📱 WhatsApp Bot Ready

Saat WhatsApp Bot ready, OTP akan otomatis dikirim ke WhatsApp user.

Cek status di: `http://localhost:5000/api/forgot-password/bot-status`

---

**Selesai! Sistem forgot password Anda siap digunakan.** 🎉
