import { Shield, Zap, Eye, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PrismicRichText } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { OswaldText, AdPlaceholder } from "../components";
import { getAboutPage, getAuthorByUid } from "../lib/queries";
import { createClient } from "@/prismicio";

const ICONS = { Shield, Zap, Eye, BookOpen } as const;
const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&auto=format";

export default async function AboutPage() {
  const client = createClient();
  const about = await getAboutPage();

  // team_members ainda não tem o campo `author` (Content Relationship) criado no
  // schema real — ver HANDOFF. Enquanto isso não existe, listamos os autores
  // diretamente pra seção "A Equipe" não ficar vazia.
  type TeamMemberItem = { author?: { data?: unknown } | null };
  const teamFromField = (about.data.team_members as unknown as TeamMemberItem[] ?? [])
    .map((m) => m.author)
    .filter((a): a is { data: unknown } => !!a && !!a.data);

  const team: { data: unknown }[] =
    teamFromField.length > 0
      ? teamFromField
      : await client.getAllByType("author", { limit: 8 }).catch(() => []);

  return (
    <main>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-primary" />
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {about.data.hero_label || "Sobre o projeto"}
            </span>
          </div>
          <OswaldText as="h1" className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            {about.data.hero_title || "Sobre o projeto"}
          </OswaldText>
          <div className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            <PrismicRichText field={about.data.hero_description} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20 space-y-20">
        {/* Princípios */}
        {about.data.principles.length > 0 && (
          <section>
            <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
              Nossos Princípios
            </OswaldText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.data.principles.map((v, i) => {
                const Icon = v.icon ? ICONS[v.icon] : Shield;
                return (
                  <div key={i} className="bg-card border border-border p-6 hover:border-primary/40 transition-colors">
                    <Icon className="w-6 h-6 text-primary mb-4" />
                    <OswaldText as="h3" className="text-lg font-bold text-foreground mb-2">
                      {v.title}
                    </OswaldText>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Equipe */}
        {team.length > 0 && (
          <section>
            <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
              A Equipe
            </OswaldText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {team.map((member, i) => {
                const data = member.data as {
                  name?: string | null;
                  role?: string | null;
                  avatar?: { url?: string | null } | null;
                  bio?: unknown;
                  focus_tags?: { tag?: string | null }[];
                };
                return (
                  <div key={i} className="bg-card border border-border p-6 flex gap-5 hover:border-primary/40 transition-colors">
                    <div className="w-16 h-16 shrink-0 overflow-hidden bg-secondary">
                      <img
                        src={data.avatar?.url || FALLBACK_AVATAR}
                        alt={data.name || "Membro da equipe"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <OswaldText as="h3" className="text-lg font-bold text-foreground">
                        {data.name || "Membro da equipe"}
                      </OswaldText>
                      <p className="text-xs text-primary font-bold mb-2 tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {data.role || "Equipe editorial"}
                      </p>
                      {isFilled.richText(data.bio as never) && (
                        <div className="text-sm text-muted-foreground leading-relaxed mb-3">
                          <PrismicRichText field={data.bio as never} />
                        </div>
                      )}
                      {data.focus_tags && data.focus_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {data.focus_tags.map((tag, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {tag.tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Timeline */}
        {about.data.timeline.length > 0 && (
          <section>
            <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
              Nossa História
            </OswaldText>
            <div className="relative">
              <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
              <div className="space-y-0">
                {about.data.timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 pb-8 last:pb-0">
                    <div className="shrink-0 flex flex-col items-center">
                      <OswaldText as="span" className="text-sm font-bold text-primary w-[52px] text-right pr-4 pt-0.5">
                        {item.year}
                      </OswaldText>
                    </div>
                    <div className="relative flex-1 pb-0">
                      <div className="absolute -left-[calc(1.5rem+1px)] top-1.5 w-3 h-3 bg-primary border-2 border-background" />
                      <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Política editorial */}
        {isFilled.richText(about.data.editorial_policy_body) && (
          <section className="bg-card border border-border p-8">
            <OswaldText as="h2" className="text-xl font-bold text-foreground mb-4 uppercase">
              {about.data.editorial_policy_title || "Política Editorial & Financiamento"}
            </OswaldText>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <PrismicRichText field={about.data.editorial_policy_body} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {isFilled.link(about.data.advertise_cta_link) && (
                <Link
                  href={about.data.advertise_cta_link.url ?? "/anuncie"}
                  className="flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white py-2.5 px-5 text-sm font-bold tracking-wide transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {about.data.advertise_cta_label || "ANUNCIE CONOSCO"} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              {isFilled.link(about.data.contact_cta_link) && (
                <Link
                  href={about.data.contact_cta_link.url ?? "/contato"}
                  className="flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary py-2.5 px-5 text-sm font-bold tracking-wide transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {about.data.contact_cta_label || "ENTRAR EM CONTATO"}
                </Link>
              )}
            </div>
          </section>
        )}

        <AdPlaceholder className="h-24" />
      </div>
    </main>
  );
}
