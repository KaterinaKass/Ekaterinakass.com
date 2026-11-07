// Отправка заявки из формы «Start a conversation» Кате на почту через Resend (https://resend.com).
// Нужны переменные окружения на Vercel (и в .env.local для локальной проверки):
//   RESEND_API_KEY — ключ из Resend → API Keys
//   CONTACT_TO     — куда слать (по умолчанию почта из content.ts)
//   CONTACT_FROM   — от кого (по умолчанию onboarding@resend.dev; без своего домена Resend
//                    доставляет только на почту владельца аккаунта Resend)
// Письмо в том же формате, что раньше собирал mailto: тема «Тема — Имя», в теле сообщение, имя и почта.
// «Ответить» в почте сразу пишет отправителю (reply_to).

import { content } from "@/content";
import { EMAIL_RE } from "@/lib/validateEmail";

const LIMITS = { name: 120, email: 254, subject: 120, message: 5000 };

export async function POST(req: Request) {
  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // ловушка для ботов: скрытое поле, человек его не видит и не заполняет
  if (typeof d.website === "string" && d.website.trim()) return Response.json({ ok: true });

  const f = (k: keyof typeof LIMITS) => (typeof d[k] === "string" ? (d[k] as string).trim().slice(0, LIMITS[k]) : "");
  const name = f("name");
  const email = f("email");
  const subject = f("subject") || "Message";
  const message = f("message");

  if (!name || !message || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return Response.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || content.contact.email],
      reply_to: email,
      subject: `${subject} — ${name}`,
      text: `${message}\n\n${name}\n${email}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
