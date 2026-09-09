#!/usr/bin/env bash
#
# Cria/ajusta os modelos do Prismic que o código já espera mas que ainda não
# existem no repositório `56a5a6cc`:
#
#   1. site_settings  — hoje só tem `slices` + meta. Adiciona nome do site,
#                       navegação, rodapé, redes, newsletter, trending e ads.
#   2. article        — inverte os default_value dos booleanos (nascem `false`).
#
# Pré-requisito: autenticar o CLI (abre o navegador uma vez):
#
#   npx prismic login
#
# Depois rode este script a partir da raiz do projeto:
#
#   bash scripts/prismic-model-setup.sh
#
# Referência do modelo: .claude/site-settings.md
# O CLI regenera prismicio-types.d.ts a cada mudança; ao final rode um build
# para conferir os tipos.

set -euo pipefail

run() { echo "+ npx prismic $*"; npx prismic "$@"; }

echo "==> Verificando login..."
npx prismic whoami

# ─────────────────────────────────────────────────────────────────────────────
# 1. site_settings
# ─────────────────────────────────────────────────────────────────────────────
T=site_settings

run field add text site_name --to-type $T --label "Nome do Site"
run field add text tagline --to-type $T --label "Slogan/Tagline"
run field add image logo --to-type $T --label "Logo"
run field add image favicon --to-type $T --label "Favicon"
run field add text seo_default_title --to-type $T --label "Título SEO Padrão"
run field add text seo_default_description --to-type $T --label "Descrição SEO Padrão"
run field add image seo_default_image --to-type $T --label "Imagem SEO Padrão (OG)"

run field add group primary_nav --to-type $T --label "Navegação Principal"
run field add text primary_nav.label --to-type $T --label "Rótulo"
run field add link primary_nav.link --to-type $T --label "Link"

run field add group footer_nav --to-type $T --label "Navegação do Rodapé"
run field add text footer_nav.label --to-type $T --label "Rótulo"
run field add link footer_nav.link --to-type $T --label "Link"
run field add select footer_nav.column --to-type $T --label "Coluna" \
  --option "Institucional" --option "Conteúdo" --option "Jogos" --option "Legal"

run field add group social_links --to-type $T --label "Redes Sociais do Site"
run field add select social_links.platform --to-type $T --label "Rede" \
  --option "X (Twitter)" --option "Instagram" --option "YouTube" \
  --option "Twitch" --option "Discord" --option "RSS"
run field add link social_links.url --to-type $T --label "URL"

run field add text newsletter_heading --to-type $T --label "Título da Newsletter"
run field add text newsletter_subtext --to-type $T --label "Subtítulo da Newsletter"
run field add text newsletter_button_label --to-type $T --label "Texto do Botão"

run field add group trending_topics --to-type $T --label "Tópicos em Alta"
run field add text trending_topics.title --to-type $T --label "Título"
run field add link trending_topics.link --to-type $T --label "Link"
run field add text trending_topics.views_label --to-type $T --label "Visualizações (texto)"

run field add group ad_slots --to-type $T --label "Espaços Publicitários"
run field add text ad_slots.slot_name --to-type $T --label "Nome do Espaço"
run field add text ad_slots.ad_unit_id --to-type $T --label "ID da Unidade de Anúncio"
run field add select ad_slots.network --to-type $T --label "Rede" \
  --option "Google AdSense" --option "Google Ad Manager"

run field add text ga_measurement_id --to-type $T --label "GA Measurement ID"
run field add text gtm_container_id --to-type $T --label "GTM Container ID"
run field add text contact_email --to-type $T --label "E-mail de Contato"

run field add content-relationship advertise_page_link --to-type $T \
  --label "Link \"Anuncie Conosco\"" --custom-type page --field title

# ─────────────────────────────────────────────────────────────────────────────
# 2. article — booleanos devem nascer `false`, não `true`
# ─────────────────────────────────────────────────────────────────────────────
run field edit breaking     --from-type article --default-value false
run field edit is_preview    --from-type article --default-value false
run field edit featured      --from-type article --default-value false
run field edit early_access  --from-type article --default-value false

# ─────────────────────────────────────────────────────────────────────────────
# Enviar para o Prismic.
#
# `npx prismic field ...` só edita os arquivos LOCAIS em customtypes/ e regenera
# prismicio-types.d.ts. É o `push` que sincroniza com o repositório — e ele SE
# RECUSA a rodar enquanto esses arquivos tiverem mudanças não commitadas no git.
# ─────────────────────────────────────────────────────────────────────────────
run gen

if ! git diff --quiet -- customtypes/ prismicio-types.d.ts; then
  echo
  echo "==> Modelos atualizados LOCALMENTE, mas o 'push' está bloqueado por"
  echo "    mudanças não commitadas. Rode:"
  echo
  echo "      git add customtypes/ prismicio-types.d.ts"
  echo "      git commit -m 'Prismic: modela site_settings e ajusta article'"
  echo "      npx prismic push"
  echo "      npx prismic status   # deve dizer 'in sync'"
  echo
  exit 1
fi

run push
run status

echo
echo "==> Pronto. Agora:"
echo "    - Crie e publique o documento único 'Configurações do Site'"
echo "      no Page Builder (ou peça ao Claude para popular via MCP)."
echo "    - Rode 'npm run build' para conferir."
