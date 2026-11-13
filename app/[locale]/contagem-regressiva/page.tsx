import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountdownPageContent, {
  countdownPageMetadata,
} from "./CountdownPageContent";
import { isLocale } from "@/app/lib/i18n";

const PATH = "/contagem-regressiva";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contagem-regressiva">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "pt-br") return {};
  return countdownPageMetadata(PATH, locale);
}

export default async function ContagemRegressivaPage({
  params,
}: PageProps<"/[locale]/contagem-regressiva">) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "pt-br") notFound();
  return <CountdownPageContent lang={locale} path={PATH} />;
}
