import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CountdownPageContent, {
  countdownPageMetadata,
} from "../contagem-regressiva/CountdownPageContent";
import { isLocale } from "@/app/lib/i18n";

const PATH = "/en-us/countdown";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/countdown">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en-us") return {};
  return countdownPageMetadata(PATH, locale);
}

export default async function CountdownPage({
  params,
}: PageProps<"/[locale]/countdown">) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en-us") notFound();
  return <CountdownPageContent lang={locale} path={PATH} />;
}
