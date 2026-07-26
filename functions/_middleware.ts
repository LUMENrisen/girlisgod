export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const { request, next } = context;

  // @ts-ignore — Cloudflare Pages 运行时 env 是真实存在的
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

  // 根据域名决定展示哪个入口
  const host = request.headers.get('host') || '';
  const isMom = host.includes('momisgod');

  const entry = isMom
    ? { title: '感 · 神', subtitle: 'MoTHer' }
    : { title: '女 · 读', subtitle: 'WoMen' };

  const errorHtml = url.searchParams.get('error')
    ? '<div class="error">密码错误，请重试</div>'
    : '';

  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${entry.title}丨${entry.subtitle}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #0a0a0a;
          font-family: "Noto Serif SC", "思源宋体", serif;
        }
        /* ===== 门 ===== */
        .door {
          background: #1a1a1a;
          padding: 48px 40px;
          border-radius: 4px;
          border: 1px solid #2a2a2a;
          max-width: 420px;
          width: 90%;
          text-align: center;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
        /* 门缝光效 */
        .door::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 20%;
          right: 20%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          opacity: 0.4;
        }
        .door::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 30%;
          right: 30%;
          height: 1px;
          background: #d4af37;
          opacity: 0.15;
        }

        /* ===== 门牌号 ===== */
        .door-number {
          color: #444;
          font-size: 11px;
          letter-spacing: 6px;
          margin-bottom: 16px;
          font-weight: 300;
        }

        /* ===== 标题 ===== */
        h1 {
          font-family: "LXGW WenKai", "华文楷体", serif;
          color: #d4af37;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 8px;
          margin-bottom: 2px;
        }
        .subtitle {
          color: #666;
          font-size: 12px;
          letter-spacing: 6px;
          text-transform: lowercase;
          margin-bottom: 28px;
          border-bottom: 1px solid #1a1a1a;
          padding-bottom: 24px;
        }

        /* ===== 门上的字（立场声明） ===== */
        .inscription {
          color: #999;
          font-size: 14px;
          line-height: 2;
          margin-bottom: 32px;
          letter-spacing: 1px;
          font-weight: 300;
        }
        .inscription span {
          color: #d4af37;
        }

        /* ===== 密码锁 ===== */
        .lock-icon {
          color: #444;
          font-size: 18px;
          margin-bottom: 12px;
          letter-spacing: 4px;
        }
        input {
          width: 100%;
          padding: 14px 16px;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 4px;
          font-size: 16px;
          color: #e5e5e5;
          margin-bottom: 16px;
          outline: none;
          transition: border-color 0.3s;
          box-sizing: border-box;
          font-family: inherit;
          text-align: center;
          letter-spacing: 2px;
        }
        input:focus {
          border-color: #d4af37;
        }
        input::placeholder {
          color: #444;
          letter-spacing: 2px;
          font-size: 14px;
        }
        button {
          width: 100%;
          padding: 14px;
          background: #d4af37;
          color: #0a0a0a;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          font-family: inherit;
          letter-spacing: 4px;
        }
        button:hover {
          background: #f1c40f;
        }
        .error {
          color: #d4af37;
          margin-top: 14px;
          font-size: 13px;
          letter-spacing: 1px;
        }

        /* ===== 门槛 ===== */
        .threshold {
          margin-top: 28px;
          color: #333;
          font-size: 11px;
          letter-spacing: 2px;
          border-top: 1px solid #141414;
          padding-top: 20px;
        }
        .threshold span {
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="door">
        <div class="door-number">✦ 001 ✦</div>

        <h1>${entry.title}</h1>
        <div class="subtitle">${entry.subtitle}</div>

        <div class="inscription">
          这里不制造对立。<br>
          只是让被忽略的声音，<span>重新被听见</span>。<br>
          门内没有战场，只有 <span>另一种视角</span>。
        </div>

        <div class="lock-icon">⌘</div>

        <form method="GET" action="">
          <input type="password" name="password" placeholder="· · · · · · · ·" autofocus>
          <button type="submit">推 门</button>
        </form>

        ${errorHtml}

        <div class="threshold">
          <span>欢迎每一位愿意倾听的人</span>
        </div>
      </div>
    </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}