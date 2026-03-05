// ═══════════════════════════════════════════════════════════
// DotCore Analyzer — app.js (v7)
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────
const TRANSLATIONS = {
    pt: {
        nav_dashboard: "Dashboard",
        nav_tech: "Auditoria Técnica",
        nav_usability: "Usabilidade",
        nav_forensics: "Forense & Rede",
        nav_seo: "SEO & Conteúdo",
        nav_tree: "Estrutura (Tree)",
        nav_score: "Como Funciona o Score",
        footer_built: "Desenvolvido por DotCore",
        footer_support: "Suporte",
        input_placeholder: "https://exemplo.pt",
        btn_analyze: "Analisar",
        loading_title: "Auditoria DotCore",
        loading_sub: "A analisar rede, forense, SEO, usabilidade e estrutura...",
        error_title: "Erro na Análise",
        error_retry: "Tentar Novamente",
        score_label: "PONTUAÇÃO GERAL",
        cat_perf: "Performance",
        cat_sec: "Segurança",
        cat_usab: "Usabilidade",
        cat_qual: "Qualidade",
        tech_detected: "Stack Tecnológica Detetada",
        infrastructure: "Infraestrutura",
        ip_address: "Endereço IP",
        geolocation: "Geolocalização",
        quick_summary: "Resumo Rápido",
        page_size: "Peso da Página",
        broken_links_lbl: "Links n/Funcionais",
        words_lbl: "Palavras",
        score_by_cat: "Pontuação por Categoria",
        score_tip: 'Consulte "Como Funciona o Score" na barra lateral para a metodologia completa.',
        tech_title: "Auditoria Técnica",
        tech_sub: "Performance, compressão, recursos e qualidade dos links.",
        ttfb_desc: "Tempo de resposta até ao primeiro byte do servidor. Ideal: <500ms.",
        page_weight: "Peso da Página",
        page_weight_desc: "Tamanho total do HTML descarregado. Ideal: <1500KB.",
        compression: "Compressão HTTP",
        compression_desc: "Gzip ou Brotli ativos no servidor, reduzem até 70% do tamanho transferido.",
        js_scripts: "Scripts JS",
        js_scripts_desc: "Número de scripts JavaScript. Acima de 10 pode afetar o carregamento.",
        css_sheets: "Folhas de Estilo CSS",
        css_sheets_desc: "Número de ficheiros CSS externos. Acima de 6 pode bloquear a renderização.",
        transport_sec: "Segurança de Transporte",
        https_desc: "Encriptação TLS/SSL ativa. Essencial para segurança e SEO.",
        links_group: "Links",
        broken_links_desc: "Links que retornam erros HTTP (4xx/5xx). Verificados até 20 links.",
        tech_detail_title: "Stack Tecnológica Detetada — Detalhe",
        usab_title: "Usabilidade & Acessibilidade",
        usab_sub: "Avaliação aprofundada da estrutura, acessibilidade e experiência do utilizador.",
        base_config: "Configurações Base",
        site_lang: "Idioma do Site",
        site_lang_desc: "Atributo lang na raiz do HTML. Vital para leitores de ecrã e SEO multilingue.",
        viewport_desc: "Essencial para responsividade em dispositivos móveis e tablets.",
        charset_desc: "Codificação de caracteres definida. Recomendado: UTF-8.",
        accessibility: "Acessibilidade",
        images_alt: "Imagens com Alt",
        images_alt_desc: "Percentagem de imagens com atributo alt. Vital para leitores de ecrã e SEO.",
        skiplink_desc: 'Link "saltar para conteúdo" para utilizadores de teclado e tecnologias assistivas.',
        aria_desc: "Elementos interativos sem etiqueta ARIA. Afeta utilizadores com deficiência visual.",
        forms: "Formulários",
        forms_desc: "Formulários com atributo method definido (GET/POST).",
        semantic_tags: "Estrutura Semântica",
        semantic_desc: "Tags semânticas HTML5 melhoram acessibilidade e ajudam os motores de pesquisa.",
        readability: "Problemas de Legibilidade",
        readability_desc: 'Links genéricos como "clique aqui" reduzem a acessibilidade e a qualidade da UX.',
        usab_factors: "Fatores de Pontuação — Usabilidade",
        mm_lang: "Atributo de idioma",
        mm_vp: "Viewport para dispositivo móvel",
        mm_alt: "Alt em imagens <80%",
        mm_sem: "Tags semânticas <3",
        mm_gen: "Links genéricos",
        mm_impact: "Impacto: -15 pts",
        mm_impact2: "Impacto: -15 pts",
        mm_impact3: "Impacto: -20 pts",
        mm_impact4: "Impacto: -15 pts",
        mm_impact5: "Impacto: -10 pts",
        headers_audit: "Auditoria HTTP Headers",
        headers_desc: "Os cabeçalhos de segurança HTTP protegem contra os ataques mais comuns como XSS, clickjacking e MIME sniffing.",
        net_dns: "Rede & DNS",
        sec_score_detail: "Pontuação de Segurança — Detalhe",
        alert_sensitive: "Ficheiros Sensíveis Expostos",
        alert_sensitive_desc: "Estes ficheiros estão acessíveis publicamente e podem expor configurações, segredos ou código-fonte.",
        alert_admin: "Painéis de Administração Acessíveis",
        alert_admin_desc: "Painéis de administração detetados publicamente. Deveriam estar protegidos por autenticação e, idealmente, restritos por IP.",
        alert_cookies: "Cookies Inseguros Detetados",
        alert_cookies_desc: "Cookies sem flags Secure e/ou HttpOnly podem ser intercetados ou acedidos via JavaScript malicioso.",
        no_threats: "Sem ameaças críticas detetadas",
        no_threats_desc: "Nenhum ficheiro sensível exposto, painel de administração acessível ou cookie inseguro foi encontrado.",
        google_preview: "Pré-visualização de Pesquisa (Google)",
        content_stats: "Estatísticas de Conteúdo",
        total_words: "Total de Palavras",
        images_no_alt: "Imagens sem Alt",
        external_links: "Links Externos",
        nofollow_links: "Links nofollow",
        og_desc: "As tags Open Graph controlam a aparência do site quando partilhado em redes sociais como Facebook, LinkedIn e WhatsApp.",
        headings: "Estrutura de Headings",
        headings_desc: "Uma hierarquia correta de headings (H1 a H6) melhora SEO e acessibilidade. Deve existir exatamente 1 tag H1 por página.",
        seo_factors: "Fatores de Pontuação — SEO",
        mm_notitle: "Sem title",
        mm_nodesc: "Sem meta description",
        mm_badh1: "H1 incorreto",
        mm_norobots: "Sem robots.txt",
        mm_nomap: "Sem sitemap.xml",
        mm_words: "Conteúdo <300 palavras",
        mm_noog: "Sem og:title",
        keyword_cloud: "Nuvem de Palavras-Chave",
        keyword_cloud_desc: "As palavras mais frequentes no conteúdo visível da página. Palavras maiores aparecem com maior frequência.",
        tree_title: "Arquitetura do Website",
        tree_sub: "Estrutura de diretórios detetada a partir dos links internos da página.",
        tree_legend: "Como interpretar esta árvore?",
        tree_folder: "Pasta / Secção",
        tree_folder_desc: "Um caminho URL com múltiplos sub-links abaixo",
        tree_page: "Página",
        tree_page_desc: "Um URL final sem sub-páginas detetadas",
        tree_empty: "Árvore vazia",
        tree_empty_desc: "Comum em SPAs (React, Next.js) onde os links são gerados por JS",
        score_method_title: "Como é calculada a Pontuação DotCore?",
        score_method_sub: "A Pontuação Geral é a média aritmética de 5 categorias independentes, cada uma com máximo de 100 pontos.",
        formula_result: "= Pontuação Geral",
        max_pts: "Máximo: 100 pts",
        m_ttfb2000: "TTFB > 2000ms",
        m_ttfb800: "TTFB 800–2000ms",
        m_nocompression: "Sem compressão (gzip/brotli)",
        m_bigpage: "Página > 4000KB",
        m_nohttps: "Sem HTTPS",
        m_sensitive: "Ficheiros sensíveis expostos",
        m_admin: "Painéis de admin acessíveis",
        m_cookies: "Cookies inseguros",
        m_headers: "Headers em falta (por cada)",
        m_notitle: "Sem title",
        m_nodesc: "Sem meta description",
        m_badh1: "H1 incorreto",
        m_norobots: "Sem robots.txt",
        m_nomap: "Sem sitemap.xml",
        m_words: "Conteúdo <300 palavras",
        m_noog: "Sem og:title",
        m_nolang: "Sem atributo lang",
        m_nosem: "Tags semânticas <3",
        m_altlow: "Alt em imagens <80%",
        m_novp: "Sem viewport meta",
        m_genlinks: "Links genéricos",
        m_brokenlinks: "Ligações partidas (por cada)",
        compare_title: "Como comparar com outras ferramentas?",
        compare_desc: "Cada ferramenta usa uma metodologia diferente. A pontuação DotCore não substitui ferramentas especializadas — é uma visão holística e rápida. Eis o que cada uma analisa:",
        tool_psi: "Foco: Performance de renderização real no browser (Core Web Vitals: LCP, CLS, INP). Usa dados reais de utilizadores Chrome. Não analisa segurança nem conformidade.",
        tool_gtm: "Foco: Performance de carregamento (Waterfall, LCP, TBT). Baseado em Lighthouse + WebPageTest. Não analisa SEO, segurança ou acessibilidade.",
        tool_ahrefs: "Foco: SEO técnico e de conteúdo, backlinks, rastreamento de palavras-chave. Utilizam crawlers completos com acesso a bases de dados de backlinks. Não analisam performance ao vivo.",
        tool_moz: 'Foco: Segurança exclusivamente (HTTP headers, cookies, CSP, HSTS, SRI). Score idêntico à nossa categoria "Segurança". Não analisa performance, SEO ou acessibilidade.',
        tool_wave: "Foco: Acessibilidade (WCAG 2.1). Requer renderização real com JavaScript. Analisa contraste de cores, navegação por teclado, semântica ARIA. Muito mais profundo que o DotCore nesta área.",
        tool_dc: "Foco: Visão 360 graus rápida. Analisa performance de rede, segurança HTTP, SEO técnico, acessibilidade base, forense de DNS e infraestrutura — tudo numa só ferramenta, sem necessidade de conta em 5 serviços diferentes.",
        limits_title: "Limitações e Grau de Confiança",
        conf_high: "Alta confiança",
        conf_med: "Confiança média",
        conf_none: "Não analisado",
        lim1: "TTFB medido em tempo real",
        lim2: "HTTP Headers (exatos, do servidor)",
        lim3: "DNS / IP / Geolocalização",
        lim4: "Exposição de ficheiros sensíveis",
        lim5: "Meta tags SEO (title, desc, og:*)",
        lim6: "Cookies (Secure/HttpOnly)",
        lim7: "Deteção de stack tecnológica (baseada em padrões HTML/headers)",
        lim8: "Links quebrados (limitado a 20 links)",
        lim9: "Densidade de palavras-chave (exclui conteúdo gerado por JS)",
        lim10: "Rácio de alt (apenas imagens no HTML estático)",
        lim11: "Core Web Vitals (LCP, CLS, INP) — requer browser real",
        lim12: "Contraste de cores (requer renderização)",
        lim13: "Conteúdo gerado por JavaScript (SPAs)",
        lim14: "Backlinks e autoridade de domínio",
        lim15: "Velocidade de carregamento de imagens/vídeos",
        // dynamic
        stack_not_found: "Stack não identificada",
        no_broken: "Nenhuma ligação partida detetada",
        no_readability: "Sem problemas de legibilidade detetados",
        no_headings: "Nenhum heading encontrado.",
        no_keywords: "Sem palavras-chave detetadas.",
        no_tree: "Nenhuma estrutura de páginas detetada.",
        spa_note: "Pode ocorrer em Single Page Applications (SPAs) onde os links são gerados dinamicamente por JavaScript.",
        found: "Encontrado",
        not_found: "Nao encontrado",
        active: "Ativo",
        inactive: "Inativo",
        configured: "Configurado",
        defined: "Definido",
        not_defined: "Nao definido",
        header_active: "Ativo",
        header_missing: "Em falta",
        h1_ok: "OK - 1 H1 encontrado",
        h1_none: "Nenhum H1 encontrado",
        h1_multi: "H1 (deve ser so 1)",
        // dns labels
        dns_ip: "Endereco IP",
        dns_geo: "Geolocalizacao",
        dns_isp: "ISP / Organizacao",
        dns_asn: "ASN",
        dns_tz: "Fuso Horario",
        dns_ns: "Nameservers (NS)",
        dns_a: "Registos A (IP)",
        dns_mx: "Servidores Mail (MX)",
        dns_dmarc: "DMARC",
        dns_spf: "SPF",
        dns_waf: "WAF detetado",
        dns_not_configured: "Nao configurado",
        dns_none: "Nenhum",
    },
    en: {
        nav_dashboard: "Dashboard",
        nav_tech: "Technical Audit",
        nav_usability: "Usability",
        nav_forensics: "Forensics & Network",
        nav_seo: "SEO & Content",
        nav_tree: "Structure (Tree)",
        nav_score: "How the Score Works",
        footer_built: "Built by DotCore",
        footer_support: "Support",
        input_placeholder: "https://example.com",
        btn_analyze: "Analyse",
        loading_title: "DotCore Deep Audit",
        loading_sub: "Analysing network, forensics, SEO, usability and structure...",
        error_title: "Analysis Error",
        error_retry: "Try Again",
        score_label: "OVERALL SCORE",
        cat_perf: "Performance",
        cat_sec: "Security",
        cat_usab: "Usability",
        cat_qual: "Quality",
        tech_detected: "Tech Stack Detected",
        infrastructure: "Infrastructure",
        ip_address: "IP Address",
        geolocation: "Geolocation",
        quick_summary: "Quick Summary",
        page_size: "Page Size",
        broken_links_lbl: "Broken Links",
        words_lbl: "Words",
        score_by_cat: "Score Breakdown by Category",
        score_tip: 'See "How the Score Works" in the sidebar for full methodology.',
        tech_title: "Technical Audit",
        tech_sub: "Performance, compression, resources and link quality.",
        ttfb_desc: "Response time until first byte from server. Target: <500ms.",
        page_weight: "Page Weight",
        page_weight_desc: "Total HTML size downloaded. Target: <1500KB.",
        compression: "HTTP Compression",
        compression_desc: "Gzip or Brotli enabled on server. Reduces up to 70% of transferred size.",
        js_scripts: "JS Scripts",
        js_scripts_desc: "Number of JavaScript scripts. Above 10 may impact load time.",
        css_sheets: "CSS Stylesheets",
        css_sheets_desc: "Number of external CSS files. Above 6 may block rendering.",
        transport_sec: "Transport Security",
        https_desc: "Active TLS/SSL encryption. Essential for security and SEO.",
        links_group: "Links",
        broken_links_desc: "Links returning HTTP errors (4xx/5xx). Up to 20 links checked.",
        tech_detail_title: "Detected Tech Stack — Detail",
        usab_title: "Usability & Accessibility",
        usab_sub: "In-depth evaluation of structure, accessibility and user experience.",
        base_config: "Base Configuration",
        site_lang: "Site Language",
        site_lang_desc: "lang attribute on the HTML root. Vital for screen readers and multilingual SEO.",
        viewport_desc: "Essential for responsiveness on mobile and tablet devices.",
        charset_desc: "Character encoding declared. Recommended: UTF-8.",
        accessibility: "Accessibility",
        images_alt: "Images with Alt",
        images_alt_desc: "Percentage of images with alt attribute. Vital for screen readers and image SEO.",
        skiplink_desc: '"Skip to content" link for keyboard and assistive technology users.',
        aria_desc: "Interactive elements without ARIA labels. Affects visually impaired users.",
        forms: "Forms",
        forms_desc: "Forms with defined method attribute (GET/POST).",
        semantic_tags: "Semantic Structure",
        semantic_desc: "HTML5 semantic tags improve accessibility and help search engines understand content.",
        readability: "Readability Issues",
        readability_desc: 'Generic links like "click here" reduce accessibility and UX quality.',
        usab_factors: "Scoring Factors — Usability",
        mm_lang: "Language attribute",
        mm_vp: "Viewport for mobile",
        mm_alt: "Image alt <80%",
        mm_sem: "Semantic tags <3",
        mm_gen: "Generic links",
        mm_impact: "Impact: -15 pts",
        mm_impact2: "Impact: -15 pts",
        mm_impact3: "Impact: -20 pts",
        mm_impact4: "Impact: -15 pts",
        mm_impact5: "Impact: -10 pts",
        headers_audit: "HTTP Headers Audit",
        headers_desc: "HTTP security headers protect against the most common attacks like XSS, clickjacking and MIME sniffing.",
        net_dns: "Network & DNS",
        sec_score_detail: "Security Score — Details",
        alert_sensitive: "Sensitive Files Exposed",
        alert_sensitive_desc: "These files are publicly accessible and may expose configuration, secrets or source code.",
        alert_admin: "Admin Panels Accessible",
        alert_admin_desc: "Admin panels detected publicly. Should be protected by authentication and ideally restricted by IP.",
        alert_cookies: "Insecure Cookies Detected",
        alert_cookies_desc: "Cookies without Secure and/or HttpOnly flags may be intercepted or accessed via malicious JavaScript.",
        no_threats: "No critical threats detected",
        no_threats_desc: "No sensitive files exposed, admin panels accessible or insecure cookies found.",
        google_preview: "Search Preview (Google)",
        content_stats: "Content Statistics",
        total_words: "Total Words",
        images_no_alt: "Images without Alt",
        external_links: "External Links",
        nofollow_links: "Nofollow Links",
        og_desc: "Open Graph tags control how the site appears when shared on social networks like Facebook, LinkedIn and WhatsApp.",
        headings: "Heading Structure",
        headings_desc: "A correct heading hierarchy (H1 to H6) improves SEO and accessibility. There must be exactly 1 H1 per page.",
        seo_factors: "SEO Score Factors",
        mm_notitle: "No title",
        mm_nodesc: "No meta description",
        mm_badh1: "H1 incorrect",
        mm_norobots: "No robots.txt",
        mm_nomap: "No sitemap.xml",
        mm_words: "Content <300 words",
        mm_noog: "No og:title",
        keyword_cloud: "Keyword Cloud",
        keyword_cloud_desc: "Most frequent words in the visible page content. Larger words appear more often.",
        tree_title: "Website Architecture",
        tree_sub: "Directory structure detected from the page's internal links.",
        tree_legend: "How to read this tree?",
        tree_folder: "Folder / Section",
        tree_folder_desc: "A URL path with multiple sub-links below it",
        tree_page: "Page",
        tree_page_desc: "A final URL with no detected sub-pages",
        tree_empty: "Empty tree",
        tree_empty_desc: "Common in SPAs (React, Next.js) where links are generated by JS",
        score_method_title: "How is the DotCore Score calculated?",
        score_method_sub: "The Overall Score is the arithmetic mean of 5 independent categories, each with a maximum of 100 points.",
        formula_result: "= Overall Score",
        max_pts: "Max: 100 pts",
        m_ttfb2000: "TTFB > 2000ms",
        m_ttfb800: "TTFB 800–2000ms",
        m_nocompression: "No compression (gzip/brotli)",
        m_bigpage: "Page > 4000KB",
        m_nohttps: "No HTTPS",
        m_sensitive: "Sensitive files exposed",
        m_admin: "Admin panels accessible",
        m_cookies: "Insecure cookies",
        m_headers: "Missing headers (each)",
        m_notitle: "No title",
        m_nodesc: "No meta description",
        m_badh1: "H1 incorrect",
        m_norobots: "No robots.txt",
        m_nomap: "No sitemap.xml",
        m_words: "Content <300 words",
        m_noog: "No og:title",
        m_nolang: "No lang attribute",
        m_nosem: "Semantic tags <3",
        m_altlow: "Image alt <80%",
        m_novp: "No viewport meta",
        m_genlinks: "Generic links",
        m_brokenlinks: "Broken links (each)",
        compare_title: "How to compare with other tools?",
        compare_desc: "Each tool uses a different methodology. The DotCore score does not replace specialised tools — it is a holistic, quick view. Here is what each one analyses:",
        tool_psi: "Focus: Real browser rendering performance (Core Web Vitals: LCP, CLS, INP). Uses real Chrome user data. Does not analyse security or accessibility.",
        tool_gtm: "Focus: Load performance (Waterfall, LCP, TBT). Based on Lighthouse + WebPageTest. Does not analyse SEO, security or accessibility.",
        tool_ahrefs: "Focus: Technical and content SEO, backlinks, keyword tracking. Use full crawlers with backlink databases. Do not analyse live performance.",
        tool_moz: 'Focus: Security only (HTTP headers, cookies, CSP, HSTS, SRI). Identical to our "Security" category. Does not analyse performance, SEO or accessibility.',
        tool_wave: "Focus: Accessibility (WCAG 2.1). Requires real JS rendering. Analyses colour contrast, keyboard navigation, ARIA semantics. Much deeper than DotCore in this area.",
        tool_dc: "Focus: 360-degree rapid view. Analyses network performance, HTTP security, technical SEO, base accessibility, DNS forensics and infrastructure — all in one tool, with no account needed across 5 services.",
        limits_title: "Limitations & Confidence Level",
        conf_high: "High confidence",
        conf_med: "Medium confidence",
        conf_none: "Not analysed",
        lim1: "TTFB measured in real time",
        lim2: "HTTP Headers (exact, from server)",
        lim3: "DNS / IP / Geolocation",
        lim4: "Sensitive file exposure",
        lim5: "SEO meta tags (title, desc, og:*)",
        lim6: "Cookies (Secure/HttpOnly)",
        lim7: "Tech stack detection (based on HTML/header patterns)",
        lim8: "Broken links (limited to 20 links)",
        lim9: "Keyword density (excludes JS-generated content)",
        lim10: "Alt ratio (static HTML images only)",
        lim11: "Core Web Vitals (LCP, CLS, INP) — requires real browser",
        lim12: "Colour contrast (requires rendering)",
        lim13: "JS-generated content (SPAs)",
        lim14: "Backlinks and domain authority",
        lim15: "Image/video load speed",
        // dynamic
        stack_not_found: "Stack not identified",
        no_broken: "No broken links detected",
        no_readability: "No readability issues detected",
        no_headings: "No headings found.",
        no_keywords: "No keywords detected.",
        no_tree: "No page structure detected.",
        spa_note: "This may occur in Single Page Applications (SPAs) where links are dynamically generated by JavaScript.",
        found: "Found",
        not_found: "Not found",
        active: "Active",
        inactive: "Inactive",
        configured: "Configured",
        defined: "Defined",
        not_defined: "Not defined",
        header_active: "Active",
        header_missing: "Missing",
        h1_ok: "OK - 1 H1 found",
        h1_none: "No H1 found",
        h1_multi: "H1 (must be only 1)",
        dns_ip: "IP Address",
        dns_geo: "Geolocation",
        dns_isp: "ISP / Organisation",
        dns_asn: "ASN",
        dns_tz: "Timezone",
        dns_ns: "Nameservers (NS)",
        dns_a: "A Records (IP)",
        dns_mx: "Mail Servers (MX)",
        dns_dmarc: "DMARC",
        dns_spf: "SPF",
        dns_waf: "WAF Detected",
        dns_not_configured: "Not configured",
        dns_none: "None",
    }
};

// ─────────────────────────────────────────────────
// LANGUAGE STATE
// ─────────────────────────────────────────────────
let LANG = "pt";

function t(key) {
    return TRANSLATIONS[LANG][key] || TRANSLATIONS.en[key] || key;
}

function setLang(lang) {
    LANG = lang;
    document.querySelectorAll(".lang-btn[id='lang-pt'], #lang-pt").forEach(b => b.classList.toggle("active", lang === "pt"));
    document.querySelectorAll(".lang-btn[id='lang-en'], #lang-en").forEach(b => b.classList.toggle("active", lang === "en"));
    applyTranslations();
    if (_lastData) renderDashboard(_lastData);
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initForms();
    initTooltips();
    applyTranslations();
});

// ─────────────────────────────────────────────────
// TOOLTIPS
// ─────────────────────────────────────────────────
const TOOLTIP_KEYS = {
    ttfb: "ttfb_desc",
    pageSize: "page_weight_desc",
    broken: "broken_links_desc",
    alt: "images_alt_desc",
    lang: "site_lang_desc",
    semantic: "semantic_desc",
    labels: "aria_desc",
};

function initTooltips() {
    const tip = document.createElement("div");
    tip.id = "dynamic-tooltip";
    tip.className = "tooltip hidden";
    document.body.appendChild(tip);

    document.addEventListener("mouseover", e => {
        const target = e.target.closest("[data-tooltip]");
        if (!target) return;
        const key = TOOLTIP_KEYS[target.dataset.tooltip] || target.dataset.tooltip;
        tip.textContent = t(key);
        tip.classList.remove("hidden");
        const rect = target.getBoundingClientRect();
        tip.style.left = rect.left + "px";
        tip.style.top = (rect.top - 40 + window.scrollY) + "px";
    });

    document.addEventListener("mouseout", e => {
        if (e.target.closest("[data-tooltip]")) tip.classList.add("hidden");
    });
}

// ─────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────
function initTabs() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const tab = item.dataset.tab;
            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            item.classList.add("active");
            const pane = document.getElementById(`tab-${tab}`);
            if (pane) pane.classList.add("active");
        });
    });
}

// ─────────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────────
function initForms() {
    document.getElementById("analyze-form").addEventListener("submit", async e => {
        e.preventDefault();
        const url = document.getElementById("url-input").value.trim();
        if (url) await startAnalysis(url);
    });
}

let _lastData = null;

async function startAnalysis(url) {
    showState("loading");
    try {
        let data;
        if (window.eel) {
            data = await eel.analyze_website_sync(url)();
            if (data && data.error) throw new Error(data.error);
        } else {
            const r = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!r.ok) {
                const err = await r.json();
                throw new Error(err.detail || "Server error.");
            }
            data = await r.json();
        }
        _lastData = data;
        renderDashboard(data);
        showState("results");
        document.getElementById("main-nav-links").classList.remove("hidden");
        document.querySelector('[data-tab="dashboard"]').click();
    } catch (err) {
        console.error(err);
        showState("error", err.message);
    }
}

function showState(state, msg = "") {
    ["loading-state", "results-container", "error-state"].forEach(id =>
        document.getElementById(id).classList.add("hidden")
    );
    if (state === "loading") document.getElementById("loading-state").classList.remove("hidden");
    else if (state === "results") document.getElementById("results-container").classList.remove("hidden");
    else if (state === "error") {
        document.getElementById("error-state").classList.remove("hidden");
        document.getElementById("error-message").textContent = msg;
    }
}

// ═══════════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════════
function renderDashboard(data) {
    const { metrics, scores, extracted_info: ei, url, score_geral } = data;

    setText("result-url", url);
    setText("site-title-display", ei.title || "—");

    animateScore("huge-score", score_geral);
    const circle = document.getElementById("score-circle-path");
    if (circle) {
        circle.style.strokeDasharray = `${score_geral}, 100`;
        applyScoreColor(circle, score_geral);
    }

    setBar("bar-perf", scores.performance);
    setBar("bar-sec", scores.security);
    setBar("bar-seo", scores.seo);
    setBar("bar-qual", scores.quality);
    setText("q-val-perf", scores.performance + " pts");
    setText("q-val-sec", scores.security + " pts");
    setText("q-val-seo", scores.seo + " pts");
    setText("q-val-qual", scores.quality + " pts");

    // Logo — try direct favicon, fallback to Google Favicons API
    const logoImg = document.getElementById("site-logo");
    const logoFallback = document.getElementById("site-logo-fallback");
    if (ei.favicon && logoImg) {
        const parsedUrl = new URL(url);
        const googleFavicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
        logoImg.src = ei.favicon;
        logoImg.onload = () => { logoImg.classList.remove("hidden"); logoFallback?.classList.add("hidden"); };
        logoImg.onerror = () => {
            // Fallback to Google Favicons API
            logoImg.src = googleFavicon;
            logoImg.onload = () => { logoImg.classList.remove("hidden"); logoFallback?.classList.add("hidden"); };
            logoImg.onerror = () => { logoImg.classList.add("hidden"); logoFallback?.classList.remove("hidden"); };
        };
    } else {
        logoImg?.classList.add("hidden");
        logoFallback?.classList.remove("hidden");
    }

    renderTechStack(ei.tech_stack || []);
    setText("dash-ip", ei.network?.ip || "N/A");
    setText("dash-geo", ei.network?.geo || "N/A");
    setText("dash-waf", metrics.waf || t("dns_none"));
    setText("dash-isp", ei.network?.isp || "N/A");
    setText("dash-https", metrics.is_https ? t("active") : "—");
    setText("dash-ttfb", `${metrics.ttfb_ms}ms`);
    setText("dash-size", `${metrics.page_size_kb}KB`);
    setText("dash-broken", `${metrics.broken_count || 0}`);
    setText("dash-words", ei.seo?.word_count ?? "0");
    setText("dash-robots", metrics.has_robots ? t("found") : t("not_found"));
    setText("dash-sitemap", metrics.has_sitemap ? t("found") : t("not_found"));

    renderScoreBreakdown("score-breakdown-chart", scores);

    // Audit Tecnica
    setAuditRow("ttfb", `${metrics.ttfb_ms}ms`, metrics.ttfb_ms < 500 ? "ok" : metrics.ttfb_ms < 1500 ? "warn" : "error");
    setAuditRow("size", `${metrics.page_size_kb}KB`, metrics.page_size_kb < 1500 ? "ok" : metrics.page_size_kb < 4000 ? "warn" : "error");
    setAuditRow("compressed", metrics.is_compressed ? "gzip / brotli" : t("inactive"), metrics.is_compressed ? "ok" : "warn");
    setAuditRow("scripts", `${metrics.scripts_count}`, metrics.scripts_count < 10 ? "ok" : "warn");
    setAuditRow("styles", `${metrics.styles_count}`, metrics.styles_count < 6 ? "ok" : "warn");
    setAuditRow("https", metrics.is_https ? "HTTPS" : "HTTP", metrics.is_https ? "ok" : "error");

    renderBrokenLinks(metrics.broken_links || []);
    renderTechStackDetail(ei.tech_stack || []);
    renderUsability(ei.usability || {});
    renderForensics(ei, metrics, scores);
    renderSEO(ei, metrics, url);
    renderTree(ei.site_tree || []);

    // Re-apply translations for dynamic text
    applyTranslations();
}

// ─────────────────────────────────────────────────
// RENDER HELPERS
// ─────────────────────────────────────────────────

function renderScoreBreakdown(containerId, scores) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cats = [
        { label: t("cat_perf"), cls: "perf", val: scores.performance },
        { label: t("cat_sec"), cls: "sec", val: scores.security },
        { label: "SEO", cls: "seo", val: scores.seo },
        { label: t("cat_usab"), cls: "usab", val: scores.usability ?? 0 },
        { label: t("cat_qual"), cls: "qual", val: scores.quality },
    ];
    container.innerHTML = cats.map(c => `
        <div class="sbd-row">
            <span class="sbd-label">${c.label}</span>
            <div class="sbd-bar-wrap">
                <div class="sbd-bar ${c.cls}" style="width:${Math.max(0, Math.min(100, c.val))}%"></div>
            </div>
            <span class="sbd-val">${c.val}</span>
        </div>`).join("");
}

const TECH_CATEGORIES = {
    "Cloudflare CDN": "CDN", "Nginx": "Server", "Apache": "Server", "LiteSpeed": "Server",
    "Vercel": "Hosting", "Netlify": "Hosting", "Fly.io": "Hosting", "Heroku": "Hosting",
    "Amazon AWS": "Cloud", "Microsoft Azure": "Cloud", "Google Cloud": "Cloud",
    "PHP": "Backend", "Laravel (PHP)": "Backend", "Symfony (PHP)": "Backend",
    "Django (Python)": "Backend", "FastAPI (Python)": "Backend", "Flask (Python)": "Backend",
    "ASP.NET (C#)": "Backend", "Java (Spring/JSP)": "Backend", "Node.js (Express)": "Backend",
    "Ruby on Rails": "Backend", "Go (Golang)": "Backend",
    "WordPress": "CMS", "Shopify": "CMS", "Wix": "CMS", "Squarespace": "CMS", "Drupal": "CMS", "Joomla": "CMS", "Ghost CMS": "CMS",
    "Next.js": "Frontend", "Nuxt.js": "Frontend", "React": "Frontend", "Vue.js": "Frontend",
    "Angular": "Frontend", "Svelte": "Frontend", "Alpine.js": "Frontend", "Three.js (3D)": "Frontend",
    "GSAP (Animations)": "Frontend", "Framer Motion": "Frontend", "jQuery": "Frontend",
    "Tailwind CSS": "CSS", "Bootstrap": "CSS", "Bulma": "CSS", "Chakra UI": "CSS", "Material UI": "CSS",
    "Google Analytics/GTM": "Analytics", "Facebook Pixel": "Analytics",
    "Hotjar": "Analytics", "Microsoft Clarity": "Analytics", "HubSpot": "CRM", "Elementor": "Builder",
};

function renderTechStack(techs) {
    const list = document.getElementById("tech-tags-list");
    if (!list) return;
    list.innerHTML = "";
    if (techs.length === 0) {
        list.innerHTML = `<span class="tech-tag-premium">${t("stack_not_found")}</span>`;
        return;
    }
    techs.forEach(tech => {
        const s = document.createElement("span");
        s.className = "tech-tag-premium";
        s.textContent = tech;
        list.appendChild(s);
    });
}

function renderTechStackDetail(techs) {
    const grid = document.getElementById("tech-stack-detail");
    if (!grid) return;
    if (techs.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem">${t("stack_not_found")}</p>`;
        return;
    }
    grid.innerHTML = techs.map(tech => {
        const cat = TECH_CATEGORIES[tech] || "—";
        return `<div class="tech-detail-item">
            <div>
                <div style="font-weight:500">${tech}</div>
                <div class="tech-cat">${cat}</div>
            </div>
        </div>`;
    }).join("");
}

function renderBrokenLinks(broken) {
    const container = document.getElementById("broken-links-container");
    if (!container) return;
    const count = broken.length;
    setAuditRow("broken", `${count}`, count === 0 ? "ok" : "error");
    container.innerHTML = "";
    if (count === 0) {
        container.innerHTML = `<div class="result-badge ok">${t("no_broken")}</div>`;
        return;
    }
    broken.forEach(b => {
        const d = document.createElement("div");
        d.className = "broken-link-item";
        d.innerHTML = `<span class="bl-code">${b.code}</span><span class="bl-url">${b.url}</span>`;
        container.appendChild(d);
    });
}

function renderUsability(u) {
    setAuditRow("lang", u.has_lang ? `OK (${u.lang_value})` : `— ${t("not_found")}`, u.has_lang ? "ok" : "error");
    setAuditRow("viewport", u.has_viewport ? t("defined") : t("not_found"), u.has_viewport ? "ok" : "error");
    setAuditRow("charset", u.has_charset ? t("defined") : t("not_found"), u.has_charset ? "ok" : "warn");
    setAuditRow("altRatio", `${u.alt_ratio}%`, u.alt_ratio > 80 ? "ok" : u.alt_ratio > 50 ? "warn" : "error");
    setAuditRow("skiplink", u.has_skip_link ? t("found") : t("not_found"), u.has_skip_link ? "ok" : "warn");
    setAuditRow("aria", `${u.missing_aria_count}`, u.missing_aria_count === 0 ? "ok" : "warn");
    setAuditRow("forms", u.forms_total > 0 ? `${u.forms_with_method}/${u.forms_total}` : "—", u.forms_with_method === u.forms_total ? "ok" : "warn");

    const semContainer = document.getElementById("semantic-tags-list");
    if (semContainer) {
        semContainer.innerHTML = "";
        for (const [tag, present] of Object.entries(u.semantic_tags || {})) {
            const badge = document.createElement("span");
            badge.className = `semantic-badge ${present ? "ok" : "missing"}`;
            badge.textContent = `<${tag}>`;
            semContainer.appendChild(badge);
        }
    }

    const rContainer = document.getElementById("readability-issues-list");
    if (rContainer) {
        if (u.readability_issues && u.readability_issues.length > 0) {
            rContainer.innerHTML = u.readability_issues.map(i => `<div class="issue-item">${i}</div>`).join("");
        } else {
            rContainer.innerHTML = `<div class="result-badge ok">${t("no_readability")}</div>`;
        }
    }
}

function renderForensics(ei, metrics, scores) {
    const headerContainer = document.getElementById("headers-audit-container");
    if (headerContainer) {
        const headers = ei.header_audit || [];
        if (headers.length === 0) {
            headerContainer.innerHTML = "<p style='color:var(--text-muted)'>—</p>";
        } else {
            headerContainer.innerHTML = headers.map(h => `
                <div class="header-audit-item ${h.status === "Present" ? "ok" : "missing"}">
                    <div class="ha-main">
                        <span class="ha-name">${h.header}</span>
                        <span class="ha-status">${h.status === "Present" ? t("header_active") : t("header_missing")}</span>
                    </div>
                    ${h.desc ? `<div class="ha-desc">${h.desc}</div>` : ""}
                    ${h.value && h.status === "Present" ? `<div class="ha-value">${h.value.substring(0, 80)}${h.value.length > 80 ? "..." : ""}</div>` : ""}
                </div>`).join("");
        }
    }

    const dns = ei.dns || {};
    const dnsContainer = document.getElementById("dns-details");
    if (dnsContainer) {
        const rows = [
            { label: t("dns_ip"), val: ei.network?.ip || "N/A" },
            { label: t("dns_geo"), val: ei.network?.geo || "N/A" },
            { label: t("dns_isp"), val: ei.network?.isp || "N/A" },
            { label: t("dns_asn"), val: ei.network?.asn || "N/A" },
            { label: t("dns_tz"), val: ei.network?.timezone || "N/A" },
            { label: t("dns_ns"), val: (dns.ns || []).join(", ") || "N/A" },
            { label: t("dns_a"), val: (dns.a || []).join(", ") || "N/A" },
            { label: t("dns_mx"), val: (dns.mx || []).join(", ") || t("dns_not_configured") },
            { label: t("dns_dmarc"), val: dns.dmarc || t("inactive") },
            { label: t("dns_spf"), val: dns.spf || t("not_found") },
            { label: t("dns_waf"), val: metrics.waf || t("dns_none") },
        ];
        dnsContainer.innerHTML = rows.map(r => `
            <div class="info-row"><span>${r.label}</span><b>${r.val}</b></div>`).join("");
    }

    renderScoreBreakdown("security-score-details", scores);

    const sensitive = ei.sensitive_files || [];
    const admin = ei.admin_panels || [];
    const cookies = ei.insecure_cookies || [];
    const hasThreats = sensitive.length > 0 || admin.length > 0 || cookies.length > 0;

    toggleAlert("sensitive-files-alert", "val-sensitive-list", sensitive);
    toggleAlert("admin-panels-alert", "val-admin-list", admin);
    toggleAlert("insecure-cookies-alert", "val-cookies-list", cookies);

    const noThreats = document.getElementById("no-threats-badge");
    if (noThreats) noThreats.classList.toggle("hidden", hasThreats);
}

function toggleAlert(panelId, listId, items) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    if (items.length > 0) {
        panel.classList.remove("hidden");
        const el = document.getElementById(listId);
        if (el) el.textContent = items.join(", ");
    } else {
        panel.classList.add("hidden");
    }
}

function renderSEO(ei, metrics, url) {
    const seo = ei.seo || {};

    const pLogo = document.getElementById("preview-logo");
    if (pLogo) {
        pLogo.src = ei.favicon || "";
        pLogo.onload = () => pLogo.classList.remove("hidden");
        pLogo.onerror = () => pLogo.classList.add("hidden");
    }

    setText("preview-url", url);
    setText("preview-title", ei.title || "—");
    setText("preview-desc", ei.description || "—");

    const h1c = seo.h_tags?.h1?.count ?? 0;
    setText("val-wordcount", seo.word_count ?? "0");
    setText("val-h1-status", h1c === 1 ? t("h1_ok") : h1c === 0 ? t("h1_none") : `${h1c} ${t("h1_multi")}`);
    setText("val-robots", metrics.has_robots ? t("found") : t("not_found"));
    setText("val-sitemap", metrics.has_sitemap ? t("found") : t("not_found"));
    setText("val-images-noalt", `${seo.images_no_alt?.length ?? 0} / ${seo.images_total ?? 0}`);
    setText("val-external-links", seo.external_links ?? "0");
    setText("val-nofollow", seo.no_follow_links ?? "0");

    const tw = seo.twitter_card || {};
    setText("val-twitter-card", tw["twitter:card"] || t("not_defined"));

    const og = seo.open_graph || {};
    setText("val-og-title", og["og:title"] || t("not_defined"));
    setText("val-og-desc", og["og:description"] || t("not_defined"));
    setText("val-og-image", og["og:image"] ? t("defined") : t("not_defined"));
    setText("val-twitter-card-og", tw["twitter:card"] || t("not_defined"));
    setText("val-twitter-title", tw["twitter:title"] || t("not_defined"));

    // SEO quick tips
    const tips = [];
    if (!ei.title) tips.push({ cls: "err", msg: t("mm_notitle") });
    else tips.push({ cls: "ok", msg: `Title: "${ei.title.substring(0, 55)}${ei.title.length > 55 ? "…" : ""}"` });
    if (!ei.description) tips.push({ cls: "warn", msg: t("mm_nodesc") });
    else tips.push({ cls: "ok", msg: `Description: ${ei.description.length} chars` });
    if (!og["og:image"]) tips.push({ cls: "warn", msg: t("mm_noog") });
    else tips.push({ cls: "ok", msg: "og:image — " + t("defined") });
    if (!metrics.has_robots) tips.push({ cls: "warn", msg: t("mm_norobots") });
    if (!metrics.has_sitemap) tips.push({ cls: "warn", msg: t("mm_nomap") });

    const tc = document.getElementById("seo-quick-tips");
    if (tc) tc.innerHTML = tips.map(tip => `<div class="seo-tip-item ${tip.cls}">${tip.msg}</div>`).join("");

    // Keyword cloud
    const cloud = document.getElementById("keyword-cloud");
    if (cloud) {
        const kws = seo.keyword_density || [];
        if (kws.length === 0) {
            cloud.innerHTML = `<span style="color:var(--text-muted)">${t("no_keywords")}</span>`;
        } else {
            cloud.innerHTML = "";
            const max = kws[0]?.count || 1;
            kws.slice(0, 20).forEach(kw => {
                const span = document.createElement("span");
                const size = 0.72 + ((kw.count / max) * 0.7);
                span.style.cssText = `font-size:${size}rem;opacity:${0.4 + (kw.count / max) * 0.6};display:inline-block;margin:2px 5px;cursor:default;`;
                span.title = `"${kw.word}" — ${kw.count}x`;
                span.textContent = kw.word;
                cloud.appendChild(span);
            });
        }
    }

    // H tags
    const hContainer = document.getElementById("h-tags-breakdown");
    if (hContainer && seo.h_tags) {
        const rows = Object.entries(seo.h_tags).filter(([, d]) => d.count > 0).map(([tag, data]) => {
            const isH1Bad = tag === "h1" && data.count !== 1;
            return `<div class="info-row">
                <span>${tag.toUpperCase()} (${data.count}x)</span>
                <b ${isH1Bad ? 'style="color:var(--warn)"' : ""}>${data.texts?.length > 0 ? `"${data.texts[0]}"` : "—"}</b>
            </div>`;
        });
        hContainer.innerHTML = rows.length ? rows.join("") : `<p style="color:var(--text-muted);font-size:0.83rem">${t("no_headings")}</p>`;
    }
}

function renderTree(nodes) {
    const root = document.getElementById("tree-root");
    if (!root) return;
    root.innerHTML = "";
    if (!nodes || nodes.length === 0) {
        root.innerHTML = `
            <div style="color:var(--text-muted);padding:1rem">
                <p>${t("no_tree")}</p>
                <p style="margin-top:0.4rem;font-size:0.82rem">${t("spa_note")}</p>
            </div>`;
        return;
    }
    function build(list, parent) {
        list.forEach(node => {
            const div = document.createElement("div");
            div.className = node.type === "folder" ? "tree-folder" : "tree-file";
            const prefix = node.type === "folder" ? "[/] " : "[ ] ";
            div.textContent = prefix + node.name;
            parent.appendChild(div);
            if (node.children?.length) {
                const childWrap = document.createElement("div");
                childWrap.style.marginLeft = "1.1rem";
                build(node.children, childWrap);
                parent.appendChild(childWrap);
            }
        });
    }
    build(nodes, root);
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text ?? "—";
}

function setBar(id, val) {
    const bar = document.getElementById(id);
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, val))}%`;
}

function setAuditRow(id, text, status) {
    const valEl = document.getElementById(`val-${id}`);
    const statusEl = document.getElementById(`status-${id}`);
    if (valEl) valEl.textContent = text;
    if (statusEl) statusEl.className = `audit-status status-${status}`;
}

function animateScore(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const interval = setInterval(() => {
        if (cur >= target) { el.textContent = target; clearInterval(interval); return; }
        cur += Math.ceil((target - cur) * 0.12) || 1;
        el.textContent = cur;
    }, 30);
}

function applyScoreColor(el, score) {
    el.classList.remove("score-green", "score-orange", "score-red");
    if (score >= 80) el.classList.add("score-green");
    else if (score >= 50) el.classList.add("score-orange");
    else el.classList.add("score-red");
}
