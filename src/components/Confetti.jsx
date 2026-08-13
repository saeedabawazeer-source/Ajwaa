import { useEffect, useRef } from 'react';

export default function Confetti({ active, onDone }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const colors = ['#E0FF00', '#D62828', '#FFB800', '#1A1A1A', '#22C55E', '#3B82F6'];
        const particles = [];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height * 0.3,
                vx: (Math.random() - 0.5) * 12,
                vy: Math.random() * -14 - 4,
                w: Math.random() * 8 + 4,
                h: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.3,
                opacity: 1,
            });
        }

        let frame = 0;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            for (const p of particles) {
                p.x += p.vx;
                p.vy += p.gravity;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.008;

                if (p.opacity > 0 && p.y < canvas.height + 20) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            }
            frame++;
            if (alive && frame < 120) {
                requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                onDone && onDone();
            }
        }
        draw();
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 4000, pointerEvents: 'none',
            }}
        />
    );
}
