import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../data/data.json');

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

// Find user by nama and noHp
export function findUserByNamaAndPhone(nama, noHp) {
    const data = readData();
    
    // Debug logging
    console.log('🔍 Searching for user:');
    console.log('  Input nama:', `"${nama}"`, '(trimmed)', `"${nama.trim()}"`);
    console.log('  Input noHp:', `"${noHp}"`);
    console.log('  Available users in database:');
    data.users.forEach(u => {
        console.log(`    - ${u.nama} (${u.noHp})`);
    });
    
    return data.users.find(u => 
        u.nama.toLowerCase().trim() === nama.toLowerCase().trim() && 
        u.noHp === noHp
    );
}

// Find user by phone number
export function findUserByPhone(noHp) {
    const data = readData();
    return data.users.find(u => u.noHp === noHp);
}

// Find user by email
export function findUserByEmail(email) {
    const data = readData();
    return data.users.find(u => u.email === email);
}

// Update user password
export function updateUserPassword(noHp, newPassword) {
    const data = readData();
    const userIndex = data.users.findIndex(u => u.noHp === noHp);
    
    if (userIndex === -1) {
        return {
            success: false,
            message: 'User tidak ditemukan'
        };
    }
    
    data.users[userIndex].password = newPassword;
    const success = writeData(data);
    
    return {
        success: success,
        message: success ? 'Password berhasil diperbarui' : 'Gagal memperbarui password'
    };
}

// Get all users (for development/debugging)
export function getAllUsers() {
    const data = readData();
    return data.users.map(u => ({
        id: u.id,
        nama: u.nama,
        email: u.email,
        noHp: u.noHp
        // password not returned
    }));
}
