import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: '"GalaZaGale" <projekt-na-webowke@cosiek.com>',
    to,
    subject,
    html,
  });
};

export async function sendActivationEmail(recipientEmail: string, token: string) {
  const activationUrl = `${process.env.FRONTEND_URL}activate/${token}`;

  const html = `
    <p>Dziękujemy za rejestrację! Kliknij link, aby aktywować konto:</p>
    <a href="${activationUrl}">${activationUrl}</a>
    <p>Link wygasa po 24 godzinach.</p>
  `;

  await sendEmail(recipientEmail, "Aktywuj swoje konto", html);
}
