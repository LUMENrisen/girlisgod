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
      <title>请输入访问密码</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #F5F0E8;
          font-family: "Noto Serif SC", serif;
        }
        .container {
          background: #FBF8F0;
          padding: 40px;
          border-radius: 8px;
          border: 1px solid #D9CEC0;
          max-width: 400px;
          text-align: center;
        }
        h1 {
          font-family: "LXGW WenKai", serif;
          color: #2C2416;
          font-size: 24px;
          margin-bottom: 20px;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #D9CEC0;
          border-radius: 4px;
          font-size: 16px;
          margin-bottom: 16px;
          box-sizing: border-box;
          background: white;
        }
        button {
          width: 100%;
          padding: 12px;
          background: #A6342B;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background: #C44536;
        }
        .error {
          color: #A6342B;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>女=神 · 档案馆</h1>
        <p style="color:#7A6B5A;margin-bottom:20px;">请输入访问密码</p>
        <form method="GET" action="">
          <input type="password" name="password" placeholder="请输入密码" autofocus>
          <button type="submit">进入档案馆</button>
        </form>
        ${url.searchParams.get('error') ? '<p class="error">密码错误，请重试</p>' : ''}
      </div>
    </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}