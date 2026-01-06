import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/data.json');

// Generate random 6 digit OTP
export function generateOTP(length = 6) {
    return Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, '0');
}

// Read data from JSON
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return { users: [], otps: [] };
    }
}

// Write data to JSON
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing data file:', error);
        return false;
    }
}

// Save OTP to database (JSON file)
export function saveOTP(phoneNumber, otp, expiryMinutes = 5) {
    const data = readData();
    const expiryTime = new Date(Date.now() + expiryMinutes * 60 * 1000);
    
    const otpRecord = {
        id: Date.now(),
        phoneNumber: phoneNumber,
        otp: otp,
        createdAt: new Date().toISOString(),
        expiresAt: expiryTime.toISOString(),
        attempts: 0,
        verified: false
    };
    
    data.otps.push(otpRecord);
    writeData(data);
    
    console.log(`⏱️  OTP akan expire pada: ${expiryTime.toLocaleTimeString('id-ID')}`);
    
    return otpRecord;
}

// Get OTP by phone number (active/not expired, not yet verified)
export function getOTPByPhone(phoneNumber) {
    const data = readData();
    const otpRecord = data.otps.find(o => 
        o.phoneNumber === phoneNumber && 
        new Date(o.expiresAt) > new Date() &&
        !o.verified
    );
    
    return otpRecord || null;
}

// Get OTP by phone number (for verified OTP - used in reset password)
export function getVerifiedOTPByPhone(phoneNumber) {
    const data = readData();
    const otpRecord = data.otps.find(o => 
        o.phoneNumber === phoneNumber && 
        new Date(o.expiresAt) > new Date() &&
        o.verified
    );
    
    return otpRecord || null;
}

// Verify OTP
export function verifyOTP(phoneNumber, inputOTP) {
    const otpRecord = getOTPByPhone(phoneNumber);
    
    if (!otpRecord) {
        return {
            success: false,
            message: 'OTP tidak ditemukan atau sudah expired',
            data: null
        };
    }
    
    // Check max attempts
    if (otpRecord.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS || 3)) {
        deleteOTP(otpRecord.id);
        return {
            success: false,
            message: 'Terlalu banyak percobaan salah. OTP di-reset. Mohon minta OTP baru',
            data: null
        };
    }
    
    // Check OTP
    if (otpRecord.otp !== inputOTP) {
        // Increment attempts
        const data = readData();
        const index = data.otps.findIndex(o => o.id === otpRecord.id);
        if (index !== -1) {
            data.otps[index].attempts += 1;
            writeData(data);
        }
        
        return {
            success: false,
            message: `OTP salah. Percobaan ${otpRecord.attempts + 1}/${process.env.OTP_MAX_ATTEMPTS || 3}`,
            data: null
        };
    }
    
    // OTP benar - mark as verified
    const data = readData();
    const index = data.otps.findIndex(o => o.id === otpRecord.id);
    if (index !== -1) {
        data.otps[index].verified = true;
        writeData(data);
    }
    
    return {
        success: true,
        message: 'OTP berhasil diverifikasi',
        data: { otpId: otpRecord.id }
    };
}

// Delete OTP
export function deleteOTP(otpId) {
    const data = readData();
    data.otps = data.otps.filter(o => o.id !== otpId);
    writeData(data);
}

// Clean expired OTPs
export function cleanExpiredOTPs() {
    const data = readData();
    const now = new Date();
    data.otps = data.otps.filter(o => new Date(o.expiresAt) > now);
    writeData(data);
}
