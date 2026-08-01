import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { OswaldText } from "@/app/components";

export async function generateMetadata({ params }: PageProps<"/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => null);
  if (!page) return {};
  return {
    title: page.data.seo_title || page.data.title || undefined,
    description: page.data.seo_description || undefined,
    openGraph: { images: page.data.seo_image?.url ? [page.data.seo_image.url] : [] },
  };
}

export default async function GenericPage({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => null);
  if (!page) notFound();

  return (
    <main>
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
          {page.data.title}
        </OswaldText>
        {page.data.subtitle && <p className="text-muted-foreground text-lg">{page.data.subtitle}</p>}
      </div>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
