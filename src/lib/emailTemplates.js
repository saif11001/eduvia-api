const escapeHtml = (str = "") =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const base = {
    body: `margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;`,
    wrapper: `width:100%;background:#f4f4f5;padding:40px 0;`,
    container: `width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;`,
    header: `background:linear-gradient(135deg,#1f2937,#374151,#000000);padding:36px 30px;text-align:center;`,
    brand: `margin:0;color:#ffffff;font-size:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;`,
    headerTitle: `margin:14px 0 0;color:#ffffff;font-size:28px;font-weight:800;line-height:1.3;`,
    bodyTd: `padding:36px 40px;`,
    greeting: `margin:0 0 16px;color:#111827;font-size:20px;font-weight:800;`,
    text: `color:#6b7280;line-height:1.7;font-size:14px;margin:0 0 14px;`,
    card: `background:#f9fafb;border-radius:16px;padding:20px;margin:20px 0;`,
    divider: `border:none;border-top:1px solid #e5e7eb;margin:20px 0;`,
    footerTd: `padding:28px 30px;text-align:center;background:#f9fafb;border-top:1px solid #f1f1f1;`,
    footerBrand: `margin:0 0 8px;color:#111827;font-size:15px;font-weight:800;letter-spacing:1px;`,
    footerText: `margin:0;color:#9ca3af;font-size:12px;`,
};

const wrap = (title, content) => `
<!DOCTYPE html>
<html dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="${base.body}">
  <div style="${base.wrapper}">
    <table width="600" cellpadding="0" cellspacing="0" style="${base.container}" align="center">
      <tr>
        <td style="${base.header}">
          <p style="${base.brand}">🎓 Eduvia</p>
          <h1 style="${base.headerTitle}">${title}</h1>
        </td>
      </tr>
      <tr>
        <td style="${base.bodyTd}">
          ${content}
        </td>
      </tr>
      <tr>
        <td style="${base.footerTd}">
          <p style="${base.footerBrand}">EDUVIA</p>
          <p style="${base.footerText}">© 2026 Eduvia. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

export const verifyEmailTemplate = (name = "there", code = "000000") =>
    wrap("Verify Your Email", `
        <h2 style="${base.greeting}">Hey ${escapeHtml(name)} 👋</h2>
        <p style="${base.text}">Thanks for joining Eduvia! Use the code below to verify your email address.</p>

        <div style="text-align:center;font-size:34px;font-weight:800;letter-spacing:10px;margin:24px 0;padding:20px;background:#111827;border-radius:16px;color:#ffffff;">
          ${escapeHtml(code)}
        </div>

        <p style="${base.text}">This code will expire in <strong style="color:#111827;">15 minutes</strong>.</p>
        <hr style="${base.divider}" />
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          If you didn't create an account, you can safely ignore this email.
        </p>
    `);

export const welcomeEmailTemplate = (name = "there") =>
    wrap("Welcome Aboard 🎉", `
        <h2 style="${base.greeting}">Hey ${escapeHtml(name)},</h2>
        <p style="${base.text}">Your email has been verified successfully. You now have full access to your account.</p>

        <div style="${base.card}border-left:4px solid #111827;">
          <p style="margin:0;color:#111827;font-size:14px;font-weight:bold;">✅ Account Ready</p>
          <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Start exploring courses and learning at your own pace.</p>
        </div>
    `);