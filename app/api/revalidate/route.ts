import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Webhook do Prismic (Settings → Webhooks). O Prismic envia um POST com
 * `{ secret, ... }` no body quando um documento é publicado/arquivado — o
 * `secret` é o valor configurado no painel do Prismic ao criar o webhook.
 * Sem essa checagem, qualquer um que descobrisse a URL conseguiria forçar
 * revalidação (e, em volume, usar isso pra sobrecarregar o build/ISR).
 * Se `PRISMIC_REVALIDATE_SECRET` não estiver configurada, mantém o
 * comportamento antigo (sem checagem) pra não quebrar ambientes existentes
 * antes do segredo ser cadastrado — mas isso deve ser tratado como transitório.
 */
export async function POST(request: NextRequest) {
	const expectedSecret = process.env.PRISMIC_REVALIDATE_SECRET;

	if (expectedSecret) {
		let receivedSecret: string | null = null;
		try {
			const body = await request.json();
			receivedSecret = typeof body?.secret === "string" ? body.secret : null;
		} catch {
			receivedSecret = null;
		}

		if (receivedSecret !== expectedSecret) {
			return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
		}
	}

	revalidateTag("prismic", "max");

	return NextResponse.json({ revalidated: true, now: Date.now() });
}
