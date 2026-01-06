import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';

const { Client, LocalAuth } = pkg;

let client = null;
let isReady = false;
let initAttempt = 0;
const MAX_RETRIES = 3;

export function initWhatsAppClient() {
    console.log(`📱 Memulai inisialisasi WhatsApp Bot (Attempt ${initAttempt + 1}/${MAX_RETRIES})...`);
    
    // Bersihkan old client jika ada
    if (client) {
        try {
            client.destroy().catch(() => {});
            client = null;
        } catch (e) {}
    }

    initAttempt++;
    
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: 'ticketing-bot'
        }),
        puppeteer: {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-background-networking',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-features=InterestFeedContentSuggestions',
                '--disable-sync',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-first-run',
                '--disable-popup-blocking',
                '--disable-prompt-on-repost',
                '--disable-renderer-backgrounding',
                '--disable-sync',
                '--enable-automation',
                '--export-tagged-pdf',
                '--generate-pdf-document-outline'
            ],
            timeout: 60000,
            protocolTimeout: 180000
        }
    });

    client.on('qr', (qr) => {
        console.log('\n=== SCAN QR CODE DI TERMINAL UNTUK CONNECT WHATSAPP ===');
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log('✅ WhatsApp Bot Authenticated! Menunggu fully ready...');
        initAttempt = 0; // Reset counter saat berhasil auth
    });

    client.on('ready', () => {
        isReady = true;
        console.log('🚀 WhatsApp Bot READY! Siap mengirim OTP.');
    });

    client.on('disconnected', (reason) => {
        console.log('⚠️  WhatsApp Bot disconnected:', reason);
        isReady = false;
    });

    client.on('error', (error) => {
        console.error('❌ WhatsApp Bot error:', error.message);
        isReady = false;
    });

    // Timeout setelah 120 detik jika tidak bisa initialize
    const initTimeout = setTimeout(() => {
        if (!isReady) {
            console.log('\n⚠️  ⚠️  ⚠️  TIMEOUT: WhatsApp Bot tidak bisa initialize dalam 120 detik!');
            console.log('Attempt:', initAttempt, '/', MAX_RETRIES);
            
            if (initAttempt < MAX_RETRIES) {
                console.log('\n🔄 Mencoba initialize ulang...\n');
                disconnectWhatsApp().then(() => {
                    setTimeout(() => {
                        initWhatsAppClient();
                    }, 3000);
                });
            } else {
                console.log('\nKemungkinan penyebab:');
                console.log('1. Chrome/Chromium tidak terinstall');
                console.log('2. Memory/RAM tidak cukup');
                console.log('3. Antivirus/Windows Defender block Chrome');
                console.log('4. Port sedang digunakan aplikasi lain');
                console.log('\n💡 Solusi:');
                console.log('- Pastikan Chrome sudah terinstall');
                console.log('- Restart komputer');
                console.log('- Disable antivirus sementara\n');
            }
        }
    }, 120000);

    client.initialize().then(() => {
        clearTimeout(initTimeout);
    }).catch((error) => {
        clearTimeout(initTimeout);
        console.error('❌ Gagal initialize WhatsApp Bot:', error.message);
        
        if (initAttempt < MAX_RETRIES) {
            console.log(`\n🔄 Retry ${initAttempt}/${MAX_RETRIES} dalam 10 detik...\n`);
            console.log('💡 Tips: Buka Task Manager, cek memory usage. Jika >90%, close aplikasi lain!');
            setTimeout(() => {
                initWhatsAppClient();
            }, 10000);
        } else {
            console.error('\n📌 Max retries exceeded.');
            console.error('⚠️  Kemungkinan: Memory/RAM tidak cukup atau Chrome error');
            console.error('💡 Solusi:');
            console.error('  1. Buka Task Manager (Ctrl+Shift+Esc)');
            console.error('  2. Lihat tab Performance → Memory');
            console.error('  3. Jika >80%, close Chrome, Discord, atau aplikasi berat lain');
            console.error('  4. Restart komputer jika tetap error\n');
        }
    });
}

export function isWhatsAppReady() {
    return isReady;
}

export function getWhatsAppClient() {
    return client;
}

export function getClientStatus() {
    return {
        initialized: !!client,
        ready: isReady,
        status: isReady ? 'Ready' : 'Not Ready'
    };
}

export async function sendOTPMessage(phoneNumber, otp, nama) {
    console.log(`\n📱 Trying to send OTP to ${phoneNumber}`);
    console.log(`   Client status: initialized=${!!client}, ready=${isReady}`);

    if (!client) {
        console.log('❌ WhatsApp client belum diinisialisasi');
        return false;
    }

    if (!isReady) {
        console.log('⚠️  WhatsApp client belum READY, akan tunggu sampai 10 detik...');
        let waitTime = 0;
        while (!isReady && waitTime < 10000) {
            await new Promise(resolve => setTimeout(resolve, 500));
            waitTime += 500;
        }
        
        if (!isReady) {
            console.log('❌ WhatsApp client masih belum READY setelah ditunggu 10 detik');
            console.log('⚠️  Coba:');
            console.log('   1. Periksa apakah HP WhatsApp masih logged in');
            console.log('   2. Buka WhatsApp di HP, pastikan kondisi aktif');
            console.log('   3. Coba lagi dalam beberapa detik');
            return false;
        }
    }

    try {
        // Format nomor dengan benar - hapus "0" di awal jika ada
        let cleanNumber = phoneNumber.replace(/^0/, '62');
        const chatId = cleanNumber.includes('@c.us')
            ? cleanNumber
            : `${cleanNumber}@c.us`;

        const message = `Halo ${nama}! 👋

Berikut adalah *kode OTP* untuk proses penggantian kata sandi akun Anda:

🔐 *${otp}*

Kode OTP ini berlaku selama *5 menit*.

⚠️ Demi menjaga keamanan akun, mohon tidak membagikan kode ini kepada pihak mana pun! ⚠️

Apabila Anda tidak merasa melakukan permintaan ini, silakan abaikan pesan ini.

Terima kasih,
Tim Support Cinema's`;

        console.log(`   Mengirim ke: ${chatId}`);
        console.log(`   Nama: ${nama}`);
        
        const result = await client.sendMessage(chatId, message);
        console.log(`✅ OTP berhasil dikirim ke ${phoneNumber}`);
        console.log(`   Message ID: ${result.id}`);
        return true;
    } catch (error) {
        console.error('❌ Gagal mengirim OTP:', error.message);
        console.error('   Error detail:', error);
        console.error('   💡 Tips: Pastikan nomor HP formatnya benar (6285727360656)');
        return false;
    }
}

export async function disconnectWhatsApp() {
    try {
        if (client) {
            await client.destroy();
            client = null;
            isReady = false;
            console.log('🔌 WhatsApp client disconnected');
        }
    } catch (error) {
        console.error('❌ Error disconnecting WhatsApp:', error.message);
        client = null;
        isReady = false;
    }
}

export async function reconnectWhatsApp() {
    await disconnectWhatsApp();
    console.log('\n⏳ Reinitializing WhatsApp Bot...');
    initWhatsAppClient();
}