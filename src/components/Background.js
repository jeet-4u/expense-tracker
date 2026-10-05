import React, { useEffect, useRef, useState } from 'react';

const COLORS = ['#FF6B9D', '#FFD23F', '#2EC4B6', '#7B5CFF', '#FF8A3D'];
const KINDS = ['circle', 'ring', 'square', 'triangle', 'plus', 'coin'];
const MODES = [
  { id: 'confetti', label: '🎉', title: 'Confetti: shapes flee your cursor' },
  { id: 'magnet', label: '🧲', title: 'Magnet: shapes follow your cursor' },
  { id: 'swirl', label: '🌀', title: 'Swirl: shapes orbit your cursor' },
  { id: 'trail', label: '✨', title: 'Trail: sparkles follow your cursor' },
  { id: 'stems', label: '🌸', title: 'Stems: flowers bend away from your cursor' },
];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function makeShape(w, h) {
  const x = Math.random() * w, y = Math.random() * h;
  return {
    hx: x, hy: y, x, y, vx: 0, vy: 0,
    size: rand(14, 44), kind: pick(KINDS), color: pick(COLORS),
    rot: Math.random() * 6.28, spin: rand(-0.01, 0.01),
    phase: Math.random() * 6.28, drift: rand(8, 26),
  };
}

function drawShape(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rot);
  ctx.fillStyle = s.color;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = Math.max(3, s.size / 5);
  ctx.lineCap = 'round';
  const r = s.size / 2;
  switch (s.kind) {
    case 'circle': ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill(); break;
    case 'ring': ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.stroke(); break;
    case 'square': ctx.fillRect(-r, -r, s.size, s.size); break;
    case 'triangle':
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, r); ctx.lineTo(-r, r);
      ctx.closePath(); ctx.fill(); break;
    case 'plus':
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
      ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke(); break;
    default:
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#2B2350';
      ctx.font = `700 ${r * 1.2}px Fredoka, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
  }
  ctx.restore();
}

function makeStems(w, h) {
  const gap = w < 600 ? 34 : 46;
  const n = Math.ceil(w / gap) + 1;
  return Array.from({ length: n }, (_, i) => ({
    x: i * gap + rand(-10, 10),
    len: rand(90, Math.min(300, h * 0.38)),
    ox: 0, vx: 0, phase: Math.random() * 6.28,
    color: pick(COLORS), petals: 5 + Math.floor(Math.random() * 3),
    head: rand(11, 19), spin: 0, rot: Math.random() * 6.28,
  }));
}

function drawStem(ctx, s, h) {
  const tipX = s.x + s.ox, tipY = h - s.len;
  ctx.strokeStyle = '#1f9d8f';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(s.x, h + 4);
  ctx.quadraticCurveTo(s.x + s.ox * 0.15, h - s.len * 0.6, tipX, tipY);
  ctx.stroke();
  // leaf
  const ly = h - s.len * 0.4, lx = s.x + s.ox * 0.06;
  ctx.fillStyle = '#2EC4B6';
  ctx.beginPath();
  ctx.ellipse(lx + 9, ly, 10, 4, -0.5, 0, 6.283);
  ctx.fill();
  // flower head
  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.rotate(s.rot);
  ctx.fillStyle = s.color;
  for (let p = 0; p < s.petals; p++) {
    ctx.rotate(6.283 / s.petals);
    ctx.beginPath();
    ctx.arc(s.head * 0.8, 0, s.head * 0.55, 0, 6.283);
    ctx.fill();
  }
  ctx.fillStyle = '#FFD23F';
  ctx.beginPath(); ctx.arc(0, 0, s.head * 0.5, 0, 6.283); ctx.fill();
  ctx.strokeStyle = '#2B2350'; ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

export default function Background() {
  const ref = useRef(null);
  const modeRef = useRef('confetti');
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('bgMode') || 'confetti'; } catch (e) { return 'confetti'; }
  });

  useEffect(() => {
    modeRef.current = mode;
    try { localStorage.setItem('bgMode', mode); } catch (e) { /* ignore */ }
  }, [mode]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, shapes = [], stems = [], sparks = [], raf, t = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor((w * h) / 18000));
      shapes = Array.from({ length: count }, () => makeShape(w, h));
      stems = makeStems(w, h);
    };

    const burst = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, sp = rand(2, 9);
        sparks.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2,
          life: 1, size: rand(5, 13), color: pick(COLORS), rot: Math.random() * 6.28,
        });
      }
    };

    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (modeRef.current === 'trail' && !reduce) burst(mouse.x, mouse.y, 1);
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onDown = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      const m = modeRef.current;
      if (m === 'trail') { burst(mouse.x, mouse.y, 40); return; }
      if (m === 'stems') {
        stems.forEach((s) => {
          if (Math.abs(s.x - mouse.x) < 220) { s.vx += (s.x > mouse.x ? 1 : -1) * 14; s.spin += 0.4; }
        });
        return;
      }
      shapes.forEach((s) => {
        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < 340) {
          const f = (1 - d / 340) * 28;
          s.vx += (dx / d) * f; s.vy += (dy / d) * f;
          s.spin += rand(-0.15, 0.15);
        }
      });
    };

    const stepShapes = (m) => {
      for (const s of shapes) {
        const tx = s.hx + Math.sin(t + s.phase) * s.drift;
        const ty = s.hy + Math.cos(t * 0.8 + s.phase) * s.drift;
        const home = m === 'magnet' ? 0.004 : 0.012;
        s.vx += (tx - s.x) * home;
        s.vy += (ty - s.y) * home;

        const dx = mouse.x - s.x, dy = mouse.y - s.y;
        const d = Math.hypot(dx, dy) || 1;
        if (m === 'confetti' && d < 180) {
          const f = (1 - d / 180) * 2.2;
          s.vx -= (dx / d) * f; s.vy -= (dy / d) * f;
          s.spin += 0.002 * (dx < 0 ? 1 : -1);
        } else if (m === 'magnet' && d < 320) {
          const f = (1 - d / 320) * (d > 60 ? 1.6 : -1.2); // pulled in, but kept off the pointer
          s.vx += (dx / d) * f; s.vy += (dy / d) * f;
        } else if (m === 'swirl' && d < 380) {
          const f = (1 - d / 380);
          s.vx += (-dy / d) * f * 2.4 + (dx / d) * f * (d > 90 ? 0.5 : -0.8);
          s.vy += (dx / d) * f * 2.4 + (dy / d) * f * (d > 90 ? 0.5 : -0.8);
          s.spin += 0.002;
        }
        s.vx *= 0.9; s.vy *= 0.9; s.spin *= 0.985;
        s.x += s.vx; s.y += s.vy;
        s.rot += s.spin + 0.004;
        drawShape(ctx, s);
      }
    };

    const stepSparks = () => {
      sparks = sparks.filter((p) => p.life > 0);
      for (const p of sparks) {
        p.vy += 0.18; p.vx *= 0.985;
        p.x += p.vx; p.y += p.vy; p.life -= 0.016; p.rot += 0.1;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    };

    const stepStems = () => {
      for (const s of stems) {
        const tipX = s.x + s.ox, tipY = h - s.len;
        const wind = Math.sin(t * 1.1 + s.phase + s.x * 0.004) * 14;
        let push = 0;
        const dx = tipX - mouse.x, dy = tipY - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 190) push = (dx >= 0 ? 1 : -1) * (1 - d / 190) * 90;
        s.vx += (wind + push - s.ox) * 0.03;
        s.vx *= 0.88;
        s.ox += s.vx;
        s.spin *= 0.96;
        s.rot += s.spin + s.vx * 0.01;
        drawStem(ctx, s, h);
      }
    };

    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      const m = modeRef.current;
      if (m === 'stems') stepStems();
      else {
        stepShapes(m);
        if (m === 'trail') stepSparks();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduce) {
      shapes.forEach((s) => drawShape(ctx, s));
    } else {
      tick();
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerdown', onDown);
      document.addEventListener('pointerleave', onLeave);
    }
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const bar = {
    position: 'fixed', right: 14, bottom: 14, zIndex: 5, display: 'flex', gap: 6,
    padding: 6, background: '#fff', border: '3px solid #2B2350', borderRadius: 16,
    boxShadow: '4px 4px 0 #2B2350',
  };
  const btn = (on) => ({
    width: 38, height: 38, fontSize: 20, cursor: 'pointer', borderRadius: 10,
    border: '2px solid #2B2350', background: on ? '#FFD23F' : '#FFF8EC',
    transform: on ? 'translateY(-2px)' : 'none',
  });

  return (
    <>
      <canvas ref={ref} className="bg-canvas" aria-hidden="true" />
      <div style={bar} role="group" aria-label="Background animation">
        {MODES.map((m) => (
          <button
            key={m.id}
            style={btn(mode === m.id)}
            title={m.title}
            aria-label={m.title}
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </>
  );
}