// Configuration
const API_BASE_URL = 'http://localhost:5000/api/forgot-password';
const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes

// State
let currentStep = 1;
let otpData = {
    nama: '',
    noHp: '',
    otp: '',
    otpId: null
};
let timerInterval = null;
let otpTimeLeft = OTP_EXPIRY_SECONDS;

// ============================================
// UTILITIES
// ============================================

function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.classList.add('hidden');
        }, 5000);
    }
}

function hideAllMessages() {
    document.getElementById('error1').classList.add('hidden');
    document.getElementById('success1').classList.add('hidden');
    document.getElementById('info1').classList.add('hidden');
    document.getElementById('error2').classList.add('hidden');
    document.getElementById('success2').classList.add('hidden');
    document.getElementById('error3').classList.add('hidden');
    document.getElementById('success3').classList.add('hidden');
}

function goToStep(stepNumber) {
    // Hide all steps
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.remove('active');
    document.getElementById('stepSuccess').classList.remove('active');

    // Hide all messages
    hideAllMessages();

    // Update step indicator
    document.getElementById('stepDot1').classList.remove('active', 'completed');
    document.getElementById('stepDot2').classList.remove('active', 'completed');
    document.getElementById('stepDot3').classList.remove('active', 'completed');

    if (stepNumber === 1) {
        document.getElementById('step1').classList.add('active');
        document.getElementById('stepDot1').classList.add('active');
    } else if (stepNumber === 2) {
        document.getElementById('step2').classList.add('active');
        document.getElementById('stepDot1').classList.add('completed');
        document.getElementById('stepDot2').classList.add('active');
    } else if (stepNumber === 3) {
        document.getElementById('step3').classList.add('active');
        document.getElementById('stepDot1').classList.add('completed');
        document.getElementById('stepDot2').classList.add('completed');
        document.getElementById('stepDot3').classList.add('active');
    } else if (stepNumber === 'success') {
        document.getElementById('stepSuccess').classList.add('active');
        document.getElementById('stepDot1').classList.add('completed');
        document.getElementById('stepDot2').classList.add('completed');
        document.getElementById('stepDot3').classList.add('completed');
    }

    currentStep = stepNumber;
    window.scrollTo(0, 0);
}

function formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    
    // If it doesn't start with 62, add it
    if (!cleaned.startsWith('62')) {
        cleaned = '62' + cleaned;
    }
    
    return cleaned;
}

function formatTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startOTPTimer() {
    otpTimeLeft = OTP_EXPIRY_SECONDS;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Initial display
    document.getElementById('timer').textContent = formatTimer(otpTimeLeft);

    timerInterval = setInterval(() => {
        otpTimeLeft--;

        if (otpTimeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('otp').disabled = true;
            showMessage('error2', 'OTP sudah kadaluarsa. Silakan minta OTP baru.', 'error');
            document.getElementById('resendBtn').disabled = false;
        } else {
            document.getElementById('timer').textContent = formatTimer(otpTimeLeft);
            
            // Change color when less than 5 minutes
            if (otpTimeLeft < 300) {
                document.getElementById('timer').style.color = '#f44336';
            }
        }
    }, 1000);
}

function stopOTPTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ============================================
// STEP 1: REQUEST OTP
// ============================================

document.getElementById('form-step1').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('nama').value.trim();
    const noHp = document.getElementById('noHp').value.trim();

    // Validation
    if (!nama) {
        showMessage('error1', 'Nama harus diisi', 'error');
        return;
    }

    if (nama.length < 3) {
        showMessage('error1', 'Nama minimal 3 karakter', 'error');
        return;
    }

    if (!noHp) {
        showMessage('error1', 'Nomor WhatsApp harus diisi', 'error');
        return;
    }

    if (noHp.replace(/\D/g, '').length < 10) {
        showMessage('error1', 'Nomor WhatsApp tidak valid', 'error');
        return;
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(noHp);

    // Store data
    otpData.nama = nama;
    otpData.noHp = formattedPhone;

    // Disable button and show loading
    const button = document.getElementById('form-step1').querySelector('button');
    const btnText = document.getElementById('btnText1');
    button.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Mengirim...';

    try {
        hideAllMessages();
        const response = await fetch(`${API_BASE_URL}/request-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: nama,
                noHp: formattedPhone
            })
        });

        const data = await response.json();

        if (data.success) {
            // Show test OTP if in development mode
            if (data.testOTP) {
                showMessage('info1', `✓ OTP terbuat! Untuk testing, gunakan: ${data.testOTP}`, 'info');
            } else {
                showMessage('success1', '✓ ' + data.message, 'success');
            }

            // Move to step 2 after short delay
            setTimeout(() => {
                goToStep(2);
                startOTPTimer();
            }, 1500);
        } else {
            showMessage('error1', data.message || 'Gagal mengirim OTP', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('error1', 'Terjadi kesalahan: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        btnText.innerHTML = 'Minta Kode OTP';
    }
});

// ============================================
// STEP 2: VERIFY OTP
// ============================================

document.getElementById('form-step2').addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = document.getElementById('otp').value.trim();

    // Validation
    if (!otp) {
        showMessage('error2', 'Kode OTP harus diisi', 'error');
        return;
    }

    if (otp.length !== 6 || isNaN(otp)) {
        showMessage('error2', 'Kode OTP harus 6 digit angka', 'error');
        return;
    }

    if (otpTimeLeft <= 0) {
        showMessage('error2', 'OTP sudah kadaluarsa. Silakan minta OTP baru.', 'error');
        return;
    }

    // Store OTP
    otpData.otp = otp;

    // Disable button and show loading
    const button = document.getElementById('form-step2').querySelector('button');
    const btnText = document.getElementById('btnText2');
    button.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Verifikasi...';

    try {
        hideAllMessages();
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                noHp: otpData.noHp,
                otp: otp
            })
        });

        const data = await response.json();

        if (data.success) {
            stopOTPTimer();
            showMessage('success2', '✓ OTP berhasil diverifikasi', 'success');

            // Move to step 3 after short delay
            setTimeout(() => {
                goToStep(3);
            }, 1500);
        } else {
            showMessage('error2', data.message || 'OTP tidak valid', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('error2', 'Terjadi kesalahan: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        btnText.innerHTML = 'Verifikasi OTP';
    }
});

// ============================================
// STEP 3: RESET PASSWORD
// ============================================

document.getElementById('form-step3').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!newPassword) {
        showMessage('error3', 'Sandi baru harus diisi', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage('error3', 'Sandi minimal 6 karakter', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('error3', 'Sandi tidak cocok', 'error');
        return;
    }

    // Disable button and show loading
    const button = document.getElementById('form-step3').querySelector('button');
    const btnText = document.getElementById('btnText3');
    button.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Menyimpan...';

    try {
        hideAllMessages();
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                noHp: otpData.noHp,
                otp: otpData.otp,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        if (data.success) {
            // Move to success step
            goToStep('success');
        } else {
            showMessage('error3', data.message || 'Gagal mengubah sandi', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('error3', 'Terjadi kesalahan: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        btnText.innerHTML = 'Ubah Sandi';
    }
});

// ============================================
// ACTION FUNCTIONS
// ============================================

function backToStep1() {
    stopOTPTimer();
    // Reset form
    document.getElementById('form-step1').reset();
    document.getElementById('form-step2').reset();
    document.getElementById('form-step3').reset();
    goToStep(1);
}

async function resendOTP() {
    const button = document.getElementById('resendBtn');
    button.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/request-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama: otpData.nama,
                noHp: otpData.noHp
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('success2', '✓ OTP baru telah dikirim', 'success');
            
            // Reset OTP input
            document.getElementById('otp').value = '';
            document.getElementById('otp').disabled = false;
            
            // Reset timer
            startOTPTimer();
            
            // Show test OTP if in development mode
            if (data.testOTP) {
                showMessage('info2', `Untuk testing, gunakan: ${data.testOTP}`, 'info');
            }
        } else {
            showMessage('error2', data.message || 'Gagal mengirim ulang OTP', 'error');
            button.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('error2', 'Terjadi kesalahan: ' + error.message, 'error');
        button.disabled = false;
    }
}

function redirectToLogin() {
    // Redirect ke frontend index (sesuaikan path dengan lokasi folder frontend Anda)
    // Jika frontend di folder D:\projek_ticketing\ticketing-fronted\
    window.location.href = 'file:///D:/projek_ticketing/ticketing-fronted/index.html';
}

function togglePassword(inputId, element) {
    const passwordInput = document.getElementById(inputId);
    const icon = element.querySelector('i');
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        passwordInput.type = "password";
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    }
}

// ============================================
// AUTO-FORMAT OTP INPUT
// ============================================

document.getElementById('otp').addEventListener('input', (e) => {
    // Only allow numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    // Auto-move to next step if 6 digits entered
    if (e.target.value.length === 6) {
        // Focus moved, ready to submit
        e.target.parentElement.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
    }
});

document.getElementById('noHp').addEventListener('input', (e) => {
    // Allow only numbers and +
    e.target.value = e.target.value.replace(/[^0-9+]/g, '');
});

// ============================================
// INITIALIZATION
// ============================================

console.log('✓ Frontend Forgot Password Script Loaded');
console.log('API URL: ' + API_BASE_URL);