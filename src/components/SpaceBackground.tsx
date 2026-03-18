import { useEffect, useRef } from 'react';

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Создание звезд
    interface Star {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleDirection: number;
    }

    const stars: Star[] = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Создание планет
    interface Planet {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }

    const planets: Planet[] = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        radius: 40,
        color: '#5865f2',
        vx: 0.1,
        vy: 0.05,
      },
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.7,
        radius: 30,
        color: '#7289da',
        vx: -0.08,
        vy: -0.06,
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.1,
        radius: 25,
        color: '#99aab5',
        vx: 0.05,
        vy: 0.08,
      },
    ];

    // Анимация
    let animationId: number;

    const animate = () => {
      // Градиентный фон
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a3e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисование и анимация планет
      planets.forEach((planet) => {
        // Обновление позиции
        planet.x += planet.vx;
        planet.y += planet.vy;

        // Отскок от краев
        if (planet.x - planet.radius < 0 || planet.x + planet.radius > canvas.width) {
          planet.vx *= -1;
        }
        if (planet.y - planet.radius < 0 || planet.y + planet.radius > canvas.height) {
          planet.vy *= -1;
        }

        // Рисование планеты с градиентом
        const planetGradient = ctx.createRadialGradient(
          planet.x - planet.radius * 0.3,
          planet.y - planet.radius * 0.3,
          0,
          planet.x,
          planet.y,
          planet.radius
        );
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(1, '#0f0f23');

        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planetGradient;
        ctx.fill();

        // Свечение планеты
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = planet.color + '20';
        ctx.fill();
      });

      // Рисование и анимация звезд
      stars.forEach((star) => {
        // Обновление позиции
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Мерцание
        star.opacity += star.twinkleSpeed * star.twinkleDirection;
        if (star.opacity <= 0.2 || star.opacity >= 1) {
          star.twinkleDirection *= -1;
        }

        // Рисование звезды
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Свечение звезды
        if (star.radius > 1) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
