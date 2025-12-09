const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const sounds = [
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
];
let particles = [];
let flashAlpha = 0;
let shake = 0;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

function randomColor() {
    return `hsl(${Math.random()*360},100%,60%)`;
}

function playRandomSound() {
    const audio = new Audio(sounds[Math.floor(Math.random()*sounds.length)]);
    audio.currentTime = 0;
    audio.play();
}

function launchFireworks(x, y) {
    playRandomSound();
    flashAlpha = 0.7;
    shake = 10;

    for (let j = 0; j < 3 + Math.floor(Math.random()*3); j++) {
        const offsetX = x + (Math.random()-0.5)*100;
        const offsetY = y + (Math.random()-0.5)*100;
        const count = 50 + Math.floor(Math.random()*30);
        const size = 2 + Math.random()*4;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;
            particles.push({
                x: offsetX,
                y: offsetY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: randomColor(),
                size: size,
                trail: []
            });
        }
    }
}

canvas.addEventListener('click', e => {
    launchFireworks(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', e => {
    if (Math.random() < 0.02) {
        launchFireworks(e.clientX, e.clientY);
    }
});

function animate() {
    // effet de vibration
    if (shake > 0) {
        canvas.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
        shake *= 0.85;
        if (shake < 1) canvas.style.transform = '';
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((p, i) => {
        p.trail.push({x: p.x, y: p.y, alpha: p.alpha});
        if (p.trail.length > 10) p.trail.shift();
        for (let t = 0; t < p.trail.length; t++) {
            ctx.globalAlpha = p.trail[t].alpha * (t / p.trail.length);
            ctx.beginPath();
            ctx.arc(p.trail[t].x, p.trail[t].y, p.size/2, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04 + Math.random()*0.02;
        p.alpha -= 0.012 + Math.random()*0.008;
        if (p.alpha <= 0) particles.splice(i, 1);
    });
    // flash lumineus
    if (flashAlpha > 0) {
        ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flashAlpha -= 0.03;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}
animate();

//  crée les feux d'artifices
function createFireworks(x, y) {
    playRandomSound();
    flashAlpha = 0.7;
    shake = 10;
    for (let j = 0; j < 3 + Math.floor(Math.random()*3); j++) {
        const offsetX = x + (Math.random()-0.5)*100;
        const offsetY = y + (Math.random()-0.5)*100;
        const count = 50 + Math.floor(Math.random()*30);
        const size = 2 + Math.random()*4;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const speed = Math.random() * 5 + 2;
            particles.push({
                x: offsetX,
                y: offsetY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: randomColor(),
                size: size,
                trail: []
            });
        }
    }
}

window.launchFireworks = function(x, y) {
    if (typeof x !== "number" || typeof y !== "number") {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
    }
    createFireworks(x, y);
};
