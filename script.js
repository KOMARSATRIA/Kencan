const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('celebrate-btn');

// Memuat dua elemen audio dari HTML
const sound1 = document.getElementById('graduation-sound'); 
const sound2 = document.getElementById('graduation-sound2'); 

// Mengambil elemen overlay dari HTML
const overlay = document.getElementById('overlay-celebration');
const closeOverlayBtn = document.getElementById('close-overlay-btn');

// Elemen Baru untuk Halaman Pembuka (Welcome Screen)
const welcomeScreen = document.getElementById('welcome-screen');
const btnMau = document.getElementById('btn-mau');
const btnGak = document.getElementById('btn-gak');
const cardContainer = document.querySelector('.card-container');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Blueprint membuat partikel konfeti
class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 5;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function triggerConfetti() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Confetti());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render Konfeti di latar belakang
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.y > canvas.height) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// ==========================================
// 1. LOGIKA HALAMAN PEMBUKA (WELCOME SCREEN)
// ==========================================

function lariTombol() {
    const randomX = Math.random() * (window.innerWidth - 120);
    const randomY = Math.random() * (window.innerHeight - 50);
    
    btnGak.style.position = 'fixed';
    btnGak.style.left = `${randomX}px`;
    btnGak.style.top = `${randomY}px`;
}

btnGak.addEventListener('mouseover', lariTombol);
btnGak.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    lariTombol();
});

// Ketika tombol "Mau! 😍" diklik
btnMau.addEventListener('click', () => {
    // 🎵 MAINKAN LAGU PERTAMA (msc.mp3)
    sound1.play().then(() => {
        sound1.volume = 0.5; // Kunci volume di 50%
    }).catch(error => {
        console.log("Musik 1 tertahan sistem browser:", error);
    });

    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        cardContainer.classList.remove('hidden-content');
    }, 500);
});

// ==========================================
// 2. LOGIKA UTAMA (KARTU KELULUSAN & OVERLAY)
// ==========================================

// Ketika tombol "Rayakan!" diklik
btn.addEventListener('click', () => {
    triggerConfetti(); // Efek hujan konfeti menyala
    
    // 🎵 PROSES GANTI LAGU NYATA DI SINI
    sound1.pause();       // Hentikan lagu pertama
    sound1.currentTime = 0; // Reset durasi lagu pertama ke awal
    
    // Mainkan lagu kedua (msc2.mp3)
    sound2.play().then(() => {
        sound2.volume = 0.5; // Kunci volume lagu kedua di 50%
    }).catch(error => {
        console.log("Musik 2 tertahan sistem browser:", error);
    });

    // Memunculkan Overlay Pop-Up di Tengah Layar
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10); 
});

// Ketika tombol "Tutup" di dalam overlay diklik
closeOverlayBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 500); 
});

// SISTEM PENGUNCI VOLUME (Anti-Turun untuk kedua lagu)
function kunciVolume(e) {
    const audio = e.target;
    if (audio.currentTime > 0 && !audio.paused && audio.volume !== 0.5) {
        audio.volume = 0.5;
    }
}
sound1.addEventListener('volumechange', kunciVolume);
sound2.addEventListener('volumechange', kunciVolume);

animate();
