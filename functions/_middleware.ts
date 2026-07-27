// @ts-nocheck
export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const { request, next } = context;

  const PASSWORD = context.env?.SITE_PASSWORD || 'your-password-here';

  const cookie = request.headers.get('Cookie') || '';
  const isAuthenticated = cookie.includes('auth=true');

  if (isAuthenticated) {
    return await next();
  }

  const url = new URL(request.url);
  const password = url.searchParams.get('password');

  if (password === PASSWORD) {
    const response = await next();
    response.headers.set('Set-Cookie', 'auth=true; Max-Age=2592000; Path=/; HttpOnly; Secure');
    return response;
  }

  const errorHtml = url.searchParams.get('error')
    ? '<div class="error">密码错误，请重试</div>'
    : '';

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>女读丨WoMen</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+QingKe+HuangYou&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0a0a0a;
      font-family: "Noto Serif SC", "宋体", "SimSun", serif;
      padding: 20px;
      color: #e5e5e5;
    }
    .card {
      background: #1a1a1a;
      padding: 40px 32px 32px;
      border-radius: 4px;
      border: 1px solid #2a2a2a;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    }
    .frame {
      width: 100%;
      aspect-ratio: 1 / 1;
      max-width: 360px;
      margin: 0 auto 28px auto;
      border-radius: 4px;
      overflow: hidden;
      background: #0d0800;
      border: 1px solid rgba(255,215,0,0.12);
      position: relative;
    }
    .frame canvas { display: block; width: 100%; height: 100%; background: transparent; }
    input {
      width: 100%;
      padding: 14px 16px;
      background: #0a0a0a;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      font-size: 16px;
      font-family: "Noto Serif SC", "宋体", serif;
      color: #e5e5e5;
      margin-bottom: 16px;
      outline: none;
      transition: border-color 0.3s;
      text-align: center;
      letter-spacing: 2px;
    }
    input:focus { border-color: #d4af37; }
    input::placeholder { color: #888; letter-spacing: 2px; font-size: 15px; }
    button {
      width: 100%;
      padding: 14px;
      background: #d4af37;
      color: #0a0a0a;
      border: none;
      border-radius: 4px;
      font-size: 17px;
      font-family: "ZCOOL QingKe HuangYou", "Noto Serif SC", serif;
      font-weight: 400;
      letter-spacing: 6px;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover { background: #f1c40f; }
    .error { color: #d4af37; margin-top: 14px; font-size: 13px; letter-spacing: 1px; }
    .footer {
      margin-top: 20px;
      color: #666;
      font-size: 13px;
      letter-spacing: 2px;
      border-top: 1px solid #222;
      padding-top: 18px;
      font-family: "Noto Serif SC", "宋体", serif;
    }
    .footer span { color: #999; }
  </style>
</head>
<body>
  <div class="card">
    <div class="frame"><canvas id="goldenParticleCanvas"></canvas></div>
    <form method="GET" action="">
      <input type="password" name="password" placeholder="我是女性" autofocus>
      <button type="submit">进入阅读</button>
    </form>
    ${errorHtml}
    <div class="footer"><span>——光会自己找到路——</span></div>
    <div><span>rice_lab</span></div>
  </div>
  <script>
    (function() {
      const canvas = document.getElementById('goldenParticleCanvas');
      if (!canvas) return;
      const CONFIG = { particleCount: 80, maxDist: 120, baseRadius: 2.0, colorGold: '#FFD700', colorGoldLight: '#FFE066', colorGoldDark: '#D4A017', bgFrom: '#1a0f00', bgTo: '#0a0500' };
      let width = 0, height = 0;
      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext('2d');
      function resizeCanvas() {
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        width = size; height = size;
        canvas.width = width * dpr; canvas.height = height * dpr;
        canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
        particles.forEach(p => { p.x = Math.random() * width; p.y = Math.random() * height; });
      }
      class Particle {
        constructor() {
          this.x = Math.random() * 400; this.y = Math.random() * 400;
          this.radius = CONFIG.baseRadius + Math.random() * 2.5;
          this.dx = (Math.random() - 0.5) * 0.5; this.dy = (Math.random() - 0.5) * 0.5;
          this.brightness = 0.6 + Math.random() * 0.4;
          this.phase = Math.random() * Math.PI * 2;
        }
        update() {
          this.x += this.dx; this.y += this.dy; this.phase += 0.008;
          if (this.x < 0) { this.x = 0; this.dx *= -1; }
          if (this.x > width) { this.x = width; this.dx *= -1; }
          if (this.y < 0) { this.y = 0; this.dy *= -1; }
          if (this.y > height) { this.y = height; this.dy *= -1; }
        }
        draw() {
          const breath = 0.7 + 0.3 * Math.sin(this.phase);
          const currentRadius = this.radius * (0.9 + 0.2 * Math.sin(this.phase * 0.7));
          ctx.shadowColor = CONFIG.colorGold;
          ctx.shadowBlur = 18 * breath;
          const grad = ctx.createRadialGradient(
            this.x - currentRadius * 0.2, this.y - currentRadius * 0.2, 0,
            this.x, this.y, currentRadius
          );
          grad.addColorStop(0, '#FFF5CC');
          grad.addColorStop(0.3, CONFIG.colorGoldLight);
          grad.addColorStop(1, CONFIG.colorGoldDark);
          ctx.beginPath();
          ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(this.x - currentRadius * 0.25, this.y - currentRadius * 0.25, currentRadius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,240,0.7)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      let particles = [];
      function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) particles.push(new Particle());
        particles.forEach(p => { p.x = Math.random() * width; p.y = Math.random() * height; });
      }
      function drawBackground() {
        const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width,height)*0.8);
        grad.addColorStop(0, '#2a1805');
        grad.addColorStop(0.5, CONFIG.bgFrom);
        grad.addColorStop(1, CONFIG.bgTo);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        const glow = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width*0.5);
        glow.addColorStop(0, 'rgba(255,215,0,0.04)');
        glow.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      function drawLines() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < CONFIG.maxDist) {
              const alpha = 0.25 * (1 - dist / CONFIG.maxDist);
              const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
              gradient.addColorStop(0, 'rgba(255,215,0,' + (alpha*0.6) + ')');
              gradient.addColorStop(0.5, 'rgba(255,200,80,' + (alpha*0.9) + ')');
              gradient.addColorStop(1, 'rgba(255,215,0,' + (alpha*0.6) + ')');
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.8 + 0.6 * (1 - dist / CONFIG.maxDist);
              ctx.stroke();
            }
          }
        }
      }
      function animate() {
        drawBackground();
        particles.forEach(p => p.update());
        drawLines();
        particles.forEach(p => p.draw());
        requestAnimationFrame(animate);
      }
      function init() { resizeCanvas(); initParticles(); animate(); }
      let resizeTimer;
      function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          resizeCanvas();
          particles.forEach(function(p) { p.x = Math.min(p.x, width); p.y = Math.min(p.y, height); });
        }, 150);
      }
      window.addEventListener('resize', handleResize);
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function() { handleResize(); });
        ro.observe(canvas.parentElement);
      }
      init();
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}