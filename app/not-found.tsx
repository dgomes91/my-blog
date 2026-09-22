/**
 * Fallback pro not-found na raiz do app — só é alcançado se uma URL escapar
 * da reescrita do `proxy.ts` pra dentro de `app/[locale]/...` (ex: um path
 * excluído do matcher que não corresponde a nenhum arquivo real). A UI é a
 * mesma de `app/[locale]/not-found.tsx`, que já deduz o locale sozinha a
 * partir do pathname (não depende de `params`).
 */
export { default } from "./[locale]/not-found";
