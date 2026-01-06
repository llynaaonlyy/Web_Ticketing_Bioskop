import { generateOTP, saveOTP, verifyOTP, deleteOTP, getOTPByPhone, getVerifiedOTPByPhone } from '../services/otpService.js';
import { findUserByNamaAndPhone, findUserByPhone, updateUserPassword } from '../services/userService.js';
import { sendOTPMessage, getClientStatus, reconnectWhatsApp } from '../services/whatsappService.js';

// Step 1: Request OTP (user input nama & no HP)
export async function requestOTP(req, res) {
    try {
        const { nama, noHp } = req.body;

        // Validation
        if (!nama || !noHp) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan nomor HP harus diisi'
            });
        }

        // Check if user exists
        const user = findUserByNamaAndPhone(nama, noHp);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User dengan nama dan nomor HP tersebut tidak ditemukan'
            });
        }

        // Check if there's an active OTP already
        const existingOTP = getOTPByPhone(noHp);
        if (existingOTP) {
            return res.status(400).json({
                success: false,
                message: 'Anda sudah memiliki OTP yang aktif. Silakan gunakan OTP tersebut atau tunggu expire.'
            });
        }

        // Generate OTP
        const otp = generateOTP(6);
        const otpRecord = saveOTP(noHp, otp, 5);  // ← Changed dari 15 menjadi 5 menit!

        console.log(`📱 OTP untuk ${noHp}: ${otp}`);
        console.log(`⏱️  Expire time: ${otpRecord.expiresAt}`);

        // Send OTP via WhatsApp
        try {
            const sent = await sendOTPMessage(noHp, otp, nama);
            
            if (sent) {
                // OTP berhasil dikirim
                res.status(200).json({
                    success: true,
                    message: 'OTP berhasil dikirim ke WhatsApp Anda. Periksa nomor HP untuk kode 6 digit.',
                    phoneNumber: noHp
                });
            } else {
                // OTP gagal dikirim, tapi sudah tersimpan
                const clientStatus = getClientStatus();
                console.log('⚠️  OTP gagal dikirim via WhatsApp:', clientStatus);
                
                res.status(200).json({
                    success: true,
                    message: 'OTP sudah digenerate tapi gagal dikirim via WhatsApp. Silakan coba lagi atau hubungi admin.',
                    phoneNumber: noHp
                });
            }
        } catch (whatsappError) {
            console.error('❌ WhatsApp error:', whatsappError);
            res.status(200).json({
                success: true,
                message: 'OTP sudah digenerate tapi terjadi error saat mengirim. Silakan coba lagi.',
                phoneNumber: noHp
            });
        }
    } catch (error) {
        console.error('Error in requestOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

// Step 2: Verify OTP (user input OTP)
export function verifyOTPCode(req, res) {
    try {
        const { noHp, otp } = req.body;

        // Validation
        if (!noHp || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Nomor HP dan OTP harus diisi'
            });
        }

        // Verify OTP
        const result = verifyOTP(noHp, otp);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error in verifyOTPCode:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

// Step 3: Reset Password (after OTP verified)
export function resetPassword(req, res) {
    try {
        const { noHp, otp, newPassword, confirmPassword } = req.body;

        // Validation
        if (!noHp || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Sandi baru dan konfirmasi sandi tidak cocok'
            });
        }

        // Check password strength (minimal 6 karakter)
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Sandi minimal harus 6 karakter'
            });
        }

        // Verify OTP again (get verified OTP)
        const otpRecord = getVerifiedOTPByPhone(noHp);
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP tidak valid atau sudah expired. Silakan verifikasi OTP terlebih dahulu.'
            });
        }
        
        // Double check OTP code matches
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Kode OTP tidak cocok'
            });
        }

        // Check if user exists
        const user = findUserByPhone(noHp);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Update password
        const updateResult = updateUserPassword(noHp, newPassword);
        if (!updateResult.success) {
            return res.status(500).json({
                success: false,
                message: updateResult.message
            });
        }

        // Delete OTP after successful reset
        deleteOTP(otpRecord.id);

        res.status(200).json({
            success: true,
            message: 'Sandi berhasil diperbarui. Silakan login dengan sandi baru Anda'
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

// Check WhatsApp Bot Status
export function checkBotStatus(req, res) {
    try {
        const status = getClientStatus();
        res.status(200).json({
            success: true,
            data: status
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi error: ' + error.message
        });
    }
}

// Reconnect WhatsApp Bot (to show QR code again)
export async function reconnectBot(req, res) {
    try {
        console.log('🔄 User requesting WhatsApp Bot reconnection...');
        await reconnectWhatsApp();
        
        res.status(200).json({
            success: true,
            message: 'WhatsApp Bot sedang reconnect. Lihat terminal untuk QR code. Tunggu 10-15 detik...'
        });
    } catch (error) {
        console.error('Error reconnecting bot:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal reconnect: ' + error.message
        });
    }
}
