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

  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>读 · 感丨女=神</title>
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

        /* === 门框 === */
        .door-frame {
          background: #1a1a1a;
          padding: 48px 44px 40px;
          border: 2px solid #d4af37;
          border-radius: 12px;
          max-width: 480px;
          width: 92%;
          position: relative;
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.06), inset 0 0 60px rgba(212, 175, 55, 0.02);
        }

        /* === 门楣装饰 === */
        .lintel {
          text-align: center;
          margin-bottom: 20px;
          letter-spacing: 8px;
          color: #d4af37;
          font-size: 12px;
          font-weight: 300;
          opacity: 0.5;
        }
        .lintel span {
          display: inline-block;
          width: 40px;
          height: 1px;
          background: #d4af37;
          vertical-align: middle;
          margin: 0 12px;
          opacity: 0.3;
        }

        /* === 门上匾额 === */
        .plaque {
          text-align: center;
          margin-bottom: 4px;
        }
        .plaque h1 {
          font-family: "LXGW WenKai", "华文楷体", serif;
          color: #d4af37;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 10px;
          margin-bottom: 2px;
        }
        .plaque .sub {
          color: #888;
          font-size: 13px;
          letter-spacing: 6px;
          font-weight: 300;
        }

        /* === 门缝透出的光 === */
        .light-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 16px auto 22px;
          opacity: 0.4;
        }

        /* === 门上的文字：邀请 === */
        .invitation {
          color: #aaa;
          font-size: 15px;
          line-height: 2;
          text-align: center;
          letter-spacing: 1px;
          margin-bottom: 28px;
          padding: 0 4px;
        }
        .invitation .gold {
          color: #d4af37;
        }

        /* === 密码输入区（居中） === */
        .entry {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .entry input {
          width: 100%;
          max-width: 320px;
          padding: 14px 18px;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          font-size: 16px;
          color: #e5e5e5;
          text-align: center;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          font-family: inherit;
          letter-spacing: 2px;
        }
        .entry input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.06);
        }
        .entry input::placeholder {
          color: #444;
          letter-spacing: 4px;
          font-size: 14px;
        }
        .entry button {
          width: 100%;
          max-width: 320px;
          margin-top: 14px;
          padding: 14px;
          background: #d4af37;
          color: #0a0a0a;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
          font-family: inherit;
          letter-spacing: 6px;
        }
        .entry button:hover {
          background: #f1c40f;
          transform: scale(1.01);
        }

        /* === 错误提示 === */
        .error {
          color: #d4af37;
          margin-top: 16px;
          font-size: 14px;
          text-align: center;
          letter-spacing: 1px;
          opacity: 0.8;
        }

        /* === 门框底部 === */
        .doorsill {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #1a1a1a;
          text-align: center;
          color: #444;
          font-size: 12px;
          letter-spacing: 2px;
        }
        .doorsill .invite {
          color: #666;
          font-size: 13px;
          letter-spacing: 3px;
        }

        /* === 门把手装饰（纯粹好看） === */
        .handle {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 28px;
          border-radius: 4px;
          background: linear-gradient(180deg, #d4af37, #b8963a);
          opacity: 0.15;
          pointer-events: none;
        }
        @media (max-width: 480px) {
          .door-frame { padding: 32px 20px 28px; }
          .plaque h1 { font-size: 26px; letter-spacing: 6px; }
          .invitation { font-size: 14px; }
        }
      </style>
    </head>
    <body>
      <div class="door-frame">

        <!-- 门楣 -->
        <div class="lintel">
          <span></span> ✦ 请 进 ✦ <span></span>
        </div>

        <!-- 匾额 -->
        <div class="plaque">
          <h1>读 · 感</h1>
          <div class="sub">女 = 神</div>
        </div>

        <!-- 门缝微光 -->
        <div class="light-line"></div>

        <!-- 邀请 -->
        <div class="invitation">
          这扇门不锁。<br>
          只需要轻轻<span class="gold">推开</span>。
        </div>

        <!-- 密码输入（居中） -->
        <div class="entry">
          <input type="password" name="password" placeholder="··· 请输入密码 ···" autofocus>
          <button type="submit">推 开</button>
        </div>

        ${url.searchParams.get('error') ? '<div class="error">· 密码不对，再试一次 ·</div>' : ''}

        <!-- 门底 -->
        <div class="doorsill">
          <div class="invite">—— 欢迎每一位愿意倾听的人 ——</div>
        </div>

        <!-- 装饰把手（纯视觉） -->
        <div class="handle"></div>

      </div>

      <script>
        // 自动聚焦，方便直接输入
        document.querySelector('input[name="password"]')?.focus();
      </script>
    </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}