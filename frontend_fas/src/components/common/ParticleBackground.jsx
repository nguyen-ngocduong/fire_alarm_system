import { useEffect, useRef } from 'react';

const ParticleBackground = ({ preset = 'auth' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Config based on Preset
    const getConfig = () => {
      switch (preset) {
        case 'danger':
          return {
            color: ['rgba(239, 68, 68, 0.45)', 'rgba(249, 115, 22, 0.45)', 'rgba(239, 68, 68, 0.2)'],
            speedY: -1.8,
            speedX: 0.8,
            maxSize: 4.5,
            density: 80,
            direction: 'up',
          };
        case 'warning':
          return {
            color: ['rgba(245, 158, 11, 0.25)', 'rgba(251, 191, 36, 0.25)', 'rgba(245, 158, 11, 0.1)'],
            speedY: -0.6,
            speedX: 0.4,
            maxSize: 3.5,
            density: 45,
            direction: 'up',
          };
        case 'safe':
          return {
            color: ['rgba(16, 185, 129, 0.15)', 'rgba(52, 211, 153, 0.15)', 'rgba(16, 185, 129, 0.05)'],
            speedY: 0.2,
            speedX: 0.3,
            maxSize: 3.0,
            density: 40,
            direction: 'all',
          };
        case 'auth':
        default:
          return {
            color: ['rgba(239, 68, 68, 0.25)', 'rgba(249, 115, 22, 0.25)', 'rgba(245, 158, 11, 0.15)'],
            speedY: -0.8,
            speedX: 0.5,
            maxSize: 4.0,
            density: 60,
            direction: 'up',
          };
      }
    };

    const config = getConfig();

    class Particle {
      constructor(layer = null) {
        // Assign a layer (0 = back, 1 = mid, 2 = front)
        this.layer = layer !== null ? layer : Math.floor(Math.random() * 3);
        
        let scale = 1;
        let speedMult = 1;
        let alphaMult = 1;
        
        if (this.layer === 0) { // Back
          scale = 0.5;
          speedMult = 0.35;
          alphaMult = 0.35;
        } else if (this.layer === 2) { // Front
          scale = 1.8;
          speedMult = 1.5;
          alphaMult = 0.5;
        } else { // Mid
          scale = 1.0;
          speedMult = 1.0;
          alphaMult = 0.75;
        }

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = (Math.random() * config.maxSize + 1) * scale;
        this.speedX = (Math.random() - 0.5) * config.speedX * speedMult;
        
        if (config.direction === 'up') {
          this.speedY = (Math.random() * config.speedY - 0.3) * speedMult;
        } else {
          this.speedY = (Math.random() - 0.5) * config.speedY * speedMult;
        }
        
        this.color = config.color[Math.floor(Math.random() * config.color.length)];
        this.alpha = (Math.random() * 0.7 + 0.3) * alphaMult;
        this.fadeRate = (Math.random() * 0.003 + 0.001) * (1 / speedMult);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset if fade or out of bounds
        if (this.alpha <= 0 || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
          this.x = Math.random() * canvas.width;
          this.y = config.direction === 'up' ? canvas.height + 10 : Math.random() * canvas.height;
          
          let scale = 1;
          let speedMult = 1;
          let alphaMult = 1;
          
          if (this.layer === 0) {
            scale = 0.5;
            speedMult = 0.35;
            alphaMult = 0.35;
          } else if (this.layer === 2) {
            scale = 1.8;
            speedMult = 1.5;
            alphaMult = 0.5;
          } else {
            scale = 1.0;
            speedMult = 1.0;
            alphaMult = 0.75;
          }

          this.size = (Math.random() * config.maxSize + 1) * scale;
          this.speedX = (Math.random() - 0.5) * config.speedX * speedMult;
          if (config.direction === 'up') {
            this.speedY = (Math.random() * config.speedY - 0.3) * speedMult;
          } else {
            this.speedY = (Math.random() - 0.5) * config.speedY * speedMult;
          }
          this.alpha = (Math.random() * 0.7 + 0.3) * alphaMult;
          this.color = config.color[Math.floor(Math.random() * config.color.length)];
        }
        
        this.alpha -= this.fadeRate;
      }

      drawRaw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Add glow for fires/embers
        if (preset === 'danger' || preset === 'auth') {
          ctx.shadowBlur = this.size * 2;
          ctx.shadowColor = this.color;
        }
        
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles across 3 layers
    for (let i = 0; i < config.density; i++) {
      // Equal distribution of particles per layer
      particles.push(new Particle(i % 3));
    }

    // Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const layers = [[], [], []];
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        layers[particles[i].layer].push(particles[i]);
      }

      // Draw Back Layer (Layer 0) - blurred
      ctx.save();
      ctx.filter = 'blur(1.5px)';
      for (let i = 0; i < layers[0].length; i++) {
        layers[0][i].drawRaw();
      }
      ctx.restore();

      // Draw Mid Layer (Layer 1) - sharp
      ctx.save();
      ctx.filter = 'none';
      for (let i = 0; i < layers[1].length; i++) {
        layers[1][i].drawRaw();
      }
      ctx.restore();

      // Draw Front Layer (Layer 2) - blurred
      ctx.save();
      ctx.filter = 'blur(3px)';
      for (let i = 0; i < layers[2].length; i++) {
        layers[2][i].drawRaw();
      }
      ctx.restore();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
};

export default ParticleBackground;
