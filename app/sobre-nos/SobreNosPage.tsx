import { Link } from "react-router";
import { OswaldText, AdPlaceholder } from "../components";
import { Shield, Zap, Eye, BookOpen, ChevronRight } from "lucide-react";

const VALORES = [
  {
    icon: Shield,
    title: "Independência Editorial",
    body: "Nenhuma análise é paga, patrocinada ou influenciada por publishers. Quando uma empresa nos envia uma key, dizemos isso explicitamente no artigo. Nossa nota é a nossa nota.",
  },
  {
    icon: Zap,
    title: "Profundidade Acima de Velocidade",
    body: "Preferimos publicar uma análise completa com 40 horas de jogo a ser o primeiro com 10. O leitor que chega aqui quer entender o jogo, não apenas saber se ele existe.",
  },
  {
    icon: Eye,
    title: "Transparência Radical",
    body: "Divulgamos como e quando recebemos cópias de revisão, conflitos de interesse, e o tempo exato que passamos com cada jogo antes de publicar a análise.",
  },
  {
    icon: BookOpen,
    title: "Contexto Histórico",
    body: "Grand strategy e simulação têm décadas de história. Cobrimos jogos novos sempre situando-os dentro de uma tradição — não como produtos isolados, mas como capítulos de algo maior.",
  },
];

const TIMELINE = [
  { year: "2019", event: "Danilo Gomes publica as primeiras análises no Medium, começando com Stellaris e Crusader Kings III." },
  { year: "2021", event: "O projeto migra para domínio próprio. Camila Fonseca e Bruno Lacerda entram como colaboradores regulares." },
  { year: "2023", event: "Mais de 200 artigos publicados. Letícia Drum assume a cobertura de Cities: Skylines e jogos de simulação." },
  { year: "2024", event: "Primeiro acordo de parceria com publishers — com política pública de divulgação de todas as chaves recebidas." },
  { year: "2026", event: "Relançamento do site com design editorial. Cobertura exclusiva do PDX Con 2026 em Estocolmo." },
];

const TEAM = [
  {
    name: "Danilo Gomes",
    role: "Fundador & Editor-Chefe",
    bio: "Engenheiro de software de dia, estrategista compulsivo de noite. Mais de 4.000 horas em Crusader Kings III e ainda não fundou uma dinastia estável.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    focus: "Grand Strategy · Paradox · Análises",
  },
  {
    name: "Camila Fonseca",
    role: "Editora de Estratégia",
    bio: "Historiadora por formação, gamer por vocação. Especialista em jogos que levam a história a sério — e em cobrar quando não levam.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&auto=format",
    focus: "História · 4X · Notícias",
  },
  {
    name: "Bruno Lacerda",
    role: "Editor de Reviews",
    bio: "Passou metade da graduação jogando Age of Empires na LAN house e a outra metade tentando justificar isso. Hoje escreve críticas que ninguém pode contestar.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    focus: "RTS · Reviews · Guias",
  },
  {
    name: "Letícia Drum",
    role: "Editora de Simulação",
    bio: "Arquiteta que encontrou em Cities: Skylines um escape criativo — e uma carreira paralela como jornalista de jogos de cidades.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
    focus: "Simulação · Cidades · Patches",
  },
];

export default function SobreNosPage() {
  return (
    <main>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&h=600&fit=crop&auto=format')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-primary" />
            <span
              className="text-xs font-bold tracking-widest text-muted-foreground uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Sobre o projeto
            </span>
          </div>
          <OswaldText
            as="h1"
            className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            Cobrimos Grand Strategy e Simulação com a profundidade que esses jogos merecem.
          </OswaldText>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Danilo Gomes é um blog editorial independente sobre jogos de estratégia e simulação —
            Europa Universalis, Civilization, Cities: Skylines, Frostpunk e os títulos que exigem
            horas de investimento antes de revelar sua grandeza. Aqui, a cobertura é proporcional
            à complexidade do jogo.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-20 space-y-20">
        {/* Valores */}
        <section>
          <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
            Nossos Princípios
          </OswaldText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALORES.map((v) => (
              <div
                key={v.title}
                className="bg-card border border-border p-6 hover:border-primary/40 transition-colors"
              >
                <v.icon className="w-6 h-6 text-primary mb-4" />
                <OswaldText as="h3" className="text-lg font-bold text-foreground mb-2">
                  {v.title}
                </OswaldText>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipe */}
        <section>
          <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
            A Equipe
          </OswaldText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-card border border-border p-6 flex gap-5 hover:border-primary/40 transition-colors"
              >
                <div className="w-16 h-16 shrink-0 overflow-hidden bg-secondary">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <OswaldText as="h3" className="text-lg font-bold text-foreground">
                    {member.name}
                  </OswaldText>
                  <p
                    className="text-xs text-primary font-bold mb-2 tracking-wide"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{member.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {member.focus.split(" · ").map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground tracking-wide"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <OswaldText as="h2" className="text-2xl font-bold text-foreground mb-8 uppercase border-l-4 border-primary pl-3">
            Nossa História
          </OswaldText>
          <div className="relative">
            <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="flex gap-6 pb-8 last:pb-0">
                  <div className="shrink-0 flex flex-col items-center">
                    <OswaldText
                      as="span"
                      className="text-sm font-bold text-primary w-[52px] text-right pr-4 pt-0.5"
                    >
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

        {/* Política editorial */}
        <section className="bg-card border border-border p-8">
          <OswaldText as="h2" className="text-xl font-bold text-foreground mb-4 uppercase">
            Política Editorial & Financiamento
          </OswaldText>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              O Danilo Gomes é financiado exclusivamente por <strong className="text-foreground">publicidade display</strong> e{" "}
              <strong className="text-foreground">links de afiliados</strong> — quando você compra um jogo pelo nosso link na Steam ou GOG,
              recebemos uma pequena comissão sem custo adicional para você. Esse modelo nos mantém operando sem depender de publishers.
            </p>
            <p>
              <strong className="text-foreground">Não existe "review pago".</strong> Quando recebemos cópias de revisão de publishers ou
              distribuidoras, declaramos isso explicitamente no artigo, na forma "Cópia recebida para análise via [distribuidora]".
              A nota final nunca é negociada, antecipada ou condicionada a cobertura positiva.
            </p>
            <p>
              Análises em Early Access são marcadas como tal e revisadas quando o jogo sai da fase de acesso antecipado.
              A nota inicial pode ser alterada — e quando isso ocorre, explicamos o motivo da mudança no início do artigo.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              to="/anuncie"
              className="flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white py-2.5 px-5 text-sm font-bold tracking-wide transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              ANUNCIE CONOSCO <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contato"
              className="flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary py-2.5 px-5 text-sm font-bold tracking-wide transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              ENTRAR EM CONTATO
            </Link>
          </div>
        </section>

        <AdPlaceholder className="h-24" />
      </div>
    </main>
  );
}
