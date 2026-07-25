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
      padding: 48px 40px 40px;
      border-radius: 8px;
      border: 1px solid #D9CEC0;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(44, 36, 22, 0.06);
    }
    .site-title {
      font-family: "LXGW WenKai", serif;
      color: #2C2416;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 4px;
      margin-bottom: 4px;
    }
    .site-title .slash {
      color: #A6342B;
      font-weight: 300;
      margin: 0 4px;
    }
    .site-sub {
      font-family: "LXGW WenKai", serif;
      color: #7A6B5A;
      font-size: 14px;
      letter-spacing: 6px;
      margin-bottom: 24px;
    }
    .divider {
      width: 40px;
      height: 2px;
      background: #A6342B;
      margin: 0 auto 20px;
    }
    .stance {
      font-size: 13px;
      color: #7A6B5A;
      line-height: 1.8;
      margin-bottom: 24px;
      padding: 0 4px;
    }
    .stance em {
      font-style: normal;
      color: #2C2416;
      font-weight: 600;
    }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #D9CEC0;
      border-radius: 4px;
      font-size: 15px;
      margin-bottom: 16px;
      box-sizing: border-box;
      background: white;
      color: #2C2416;
      font-family: "Noto Serif SC", serif;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #A6342B;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #A6342B;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-family: "Noto Serif SC", serif;
      cursor: pointer;
      transition: background 0.2s;
      letter-spacing: 2px;
    }
    button:hover {
      background: #C44536;
    }
    .error {
      color: #A6342B;
      font-size: 14px;
      margin-top: 12px;
    }
    .footer-note {
      margin-top: 20px;
      font-size: 12px;
      color: #B0A89A;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="site-title">
      读<span class="slash">·</span>感
    </div>
    <div class="site-sub">女 = 神</div>
    <div class="divider"></div>

    <div class="stance">
      <em>不解释，不讨好，不自证。</em><br>
      女性存在的本身，就是神圣的。
    </div>

    <form method="GET" action="">
      <input type="password" name="password" placeholder="请输入访问密码" autofocus>
      <button type="submit">进入档案馆</button>
    </form>

    ${url.searchParams.get('error') ? '<div class="error">密码错误，请重试</div>' : ''}

    <div class="footer-note">—— 用文字抵抗遗忘 · 用身体记住感受 ——</div>
  </div>
</body>
</html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}