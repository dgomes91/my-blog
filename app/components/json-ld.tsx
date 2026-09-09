/**
 * Injeta um bloco <script type="application/ld+json"> no HTML server-rendered.
 * Server Component — o markup vai no HTML inicial, que é o que Google Notícias
 * e crawlers de IA leem.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // JSON já serializado por jsonLdGraph(); sem dados de usuário.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
