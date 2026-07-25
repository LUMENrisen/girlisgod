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
        .container {
          background: #1a1a1a;
          padding: 48px 40px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          max-width: 420px;
          width: 90%;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
        h1 {
          font-family: "LXGW WenKai", "华文楷体", serif;
          color: #d4af37;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 6px;
          margin-bottom: 6px;
        }
        .subtitle {
          color: #888;
          font-size: 13px;
          letter-spacing: 4px;
          margin-bottom: 24px;
          border-bottom: 1px solid #2a2a2a;
          padding-bottom: 20px;
        }
        .statement {
          color: #aaa;
          font-size: 14px;
          line-height: 1.8;
          margin-bottom: 28px;
          letter-spacing: 1px;
        }
        .statement span {
          color: #d4af37;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 4px;
          font-size: 16px;
          color: #e5e5e5;
          margin-bottom: 16px;
          outline: none;
          transition: border-color 0.3s;
          box-sizing: border-box;
          font-family: inherit;
        }
        input:focus {
          border-color: #d4af37;
        }
        input::placeholder {
          color: #555;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #d4af37;
          color: #0a0a0a;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
          font-family: inherit;
          letter-spacing: 2px;
        }
        button:hover {
          background: #f1c40f;
        }
        .error {
          color: #d4af37;
          margin-top: 14px;
          font-size: 14px;
        }
        .footer {
          margin-top: 24px;
          color: #444;
          font-size: 11px;
          letter-spacing: 1px;
          border-top: 1px solid #1a1a1a;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>读 · 感</h1>
        <div class="subtitle">女 = 神</div>

        <div class="statement">
          故事还缺一半。<br>
          这里在做的，只是<span>补充</span>。<br>
          不取代，不讨伐，不站队。<br>
          只是让被忽略的声音，<span>重新被听见</span>。
        </div>

        <form method="GET" action="">
          <input type="password" name="password" placeholder="请输入访问密码" autofocus>
          <button type="submit">进 入</button>
        </form>

        ${url.searchParams.get('error') ? '<div class="error">密码错误，请重试</div>' : ''}

        <div class="footer">— 欢迎每一位愿意倾听的人 —</div>
      </div>
    </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}