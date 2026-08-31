// Gimanaya - Subtle Background Falling Petal Animation (Orange & Grey)
class Petal {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
        this.y = Math.random() * canvas.height; // Random initial position so they drift instantly
    }
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6; // Petal sizes: 6px to 14px
        this.speedY = Math.random() * 0.8 + 0.4; // Drifting speed: slow and floating
        this.speedX = Math.random() * 0.6 - 0.3; // Gentle side drift
        
        // 2D Rotation (roll/spin on 2D plane)
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.015 - 0.0075;
        
        // 3D Yaw Rotation (flipping/tumbling along horizontal axis)
        this.yaw = Math.random() * Math.PI * 2;
        this.yawSpeed = Math.random() * 0.04 + 0.02; // Tumbling speed
        
        this.opacity = Math.random() * 0.15 + 0.05; // 5% to 20% opacity (subtle, non-distracting)
        
        // Brand color mapping: 40% Orange, 60% Soft Grey/White
        const isOrange = Math.random() < 0.4;
        this.color = isOrange ? '221, 93, 27' : '200, 200, 200';
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.15; // Swaying motion
        
        this.rotation += this.rotationSpeed;
        this.yaw += this.yawSpeed; // Tumbling spin
        
        // Reset when passing screen bounds
        if (this.y > this.canvas.height + 20 || this.x < -20 || this.x > this.canvas.width + 20) {
            this.reset();
        }
    }
    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        
        // Simulate 3D yaw by scaling width using cosine of the yaw angle
        this.ctx.scale(Math.cos(this.yaw), 1);
        
        this.ctx.beginPath();
        
        // Draw organic teardrop / flower petal vector path
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        this.ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        
        this.ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.restore();
    }
}

function initPetals() {
    // Create the background overlay canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'petal-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0'; // Keep behind text, cards, and interactive elements
    document.body.prepend(canvas);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const ctx = canvas.getContext('2d');
    
    // Scale count based on width (less on mobile)
    const count = width < 768 ? 12 : 28;
    const petals = Array.from({ length: count }, () => new Petal(canvas));

    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
    });

    function animate() {
        if (isTabVisible) {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(p => {
                p.update();
                p.draw();
            });
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Initialise when DOM is parsed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPetals);
} else {
    initPetals();
}
