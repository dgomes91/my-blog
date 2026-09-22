"use server";

/**
 * Inscrição na newsletter via Resend.
 *
 * Antes ligado a um `useState` que só fingia sucesso (`setSent(true)`), sem
 * nenhuma persistência. Agora grava o contato numa Audience do Resend.
 *
 * Env necessárias (ver `.env.example`):
 *   RESEND_API_KEY       — API key do Resend (server-side, nunca exposta)
 *   RESEND_AUDIENCE_ID   — ID da Audience onde o contato é criado
 *
 * Docs: https://resend.com/docs/api-reference/contacts/create-contact
 *
 * Obs.: arquivo "use server" só pode exportar funções assíncronas — o tipo
 * `NewsletterState` do estado do formulário vive em `app/components.tsx`.
 */

import { localeFromDocLang, type Locale } from "./i18n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES: Record<Locale, { invalidEmail: string; unavailable: string; failed: string; success: string }> = {
  "pt-br": {
    invalidEmail: "Informe um e-mail válido.",
    unavailable: "Newsletter indisponível no momento. Tente mais tarde.",
    failed: "Não foi possível concluir a inscrição. Tente novamente.",
    success: "Inscrição confirmada. Bem-vindo!",
  },
  "en-us": {
    invalidEmail: "Please enter a valid email.",
    unavailable: "Newsletter unavailable right now. Try again later.",
    failed: "Could not complete the subscription. Please try again.",
    success: "Subscription confirmed. Welcome!",
  },
};

/** O form manda um campo oculto `lang` (ver `Newsletter` em `app/components.tsx`). */
export async function subscribeToNewsletter(
  _prev: { status: "idle" | "success" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "success" | "error"; message?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const lang = localeFromDocLang(String(formData.get("lang") ?? ""));
  const msg = MESSAGES[lang];

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: msg.invalidEmail };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID não configurados.",
    );
    return { status: "error", message: msg.unavailable };
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );

    if (!res.ok && res.status !== 409 /* já inscrito */) {
      const detail = await res.text().catch(() => "");
      console.error("[newsletter] Resend respondeu", res.status, detail);
      return { status: "error", message: msg.failed };
    }

    return { status: "success", message: msg.success };
  } catch (err) {
    console.error("[newsletter] erro ao chamar Resend", err);
    return { status: "error", message: msg.failed };
  }
}
