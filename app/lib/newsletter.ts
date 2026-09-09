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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prev: { status: "idle" | "success" | "error"; message?: string },
  formData: FormData,
): Promise<{ status: "idle" | "success" | "error"; message?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Informe um e-mail válido." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "[newsletter] RESEND_API_KEY / RESEND_AUDIENCE_ID não configurados.",
    );
    return {
      status: "error",
      message: "Newsletter indisponível no momento. Tente mais tarde.",
    };
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
      return {
        status: "error",
        message: "Não foi possível concluir a inscrição. Tente novamente.",
      };
    }

    return { status: "success", message: "Inscrição confirmada. Bem-vindo!" };
  } catch (err) {
    console.error("[newsletter] erro ao chamar Resend", err);
    return {
      status: "error",
      message: "Não foi possível concluir a inscrição. Tente novamente.",
    };
  }
}
