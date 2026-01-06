import { findUserByPhone, findUserByEmail } from '../services/userService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/data.json');

function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { users: [], otps: [] };
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

export async function registerUser(req, res) {
    try {
        const { nama, email, noHp, password, confirmPassword } = req.body;

        if (!nama || !email || !noHp || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Sandi tidak cocok'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Sandi minimal 6 karakter'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        if (noHp.replace(/\D/g, '').length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Nomor HP tidak valid'
            });
        }

        if (findUserByEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        if (findUserByPhone(noHp)) {
            return res.status(400).json({
                success: false,
                message: 'Nomor HP sudah terdaftar'
            });
        }

        const data = readData();

        const newId = data.users.length > 0 
            ? Math.max(...data.users.map(u => u.id)) + 1 
            : 1;

        const newUser = {
            id: newId,
            nama: nama.trim(),
            email: email.trim().toLowerCase(),
            noHp: noHp,
            password: password 
        };

        data.users.push(newUser);

        const saved = writeData(data);

        if (saved) {
            console.log(`✓ User baru terdaftar: ${newUser.nama} (${newUser.noHp})`);
            
            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil. Silakan login dengan akun Anda.',
                user: {
                    id: newUser.id,
                    nama: newUser.nama,
                    email: newUser.email,
                    noHp: newUser.noHp
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Gagal menyimpan data user'
            });
        }

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan sandi harus diisi'
            });
        }

        const data = readData();
        const user = data.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau sandi salah'
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Email atau sandi salah'
            });
        }

        console.log(`✓ User berhasil login: ${user.nama} (${user.noHp})`);

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                noHp: user.noHp
            }
        });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

export function getAllUsers(req, res) {
    try {
        const data = readData();
        const users = data.users.map(u => ({
            id: u.id,
            nama: u.nama,
            email: u.email,
            noHp: u.noHp
        }));

        res.status(200).json({
            success: true,
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}