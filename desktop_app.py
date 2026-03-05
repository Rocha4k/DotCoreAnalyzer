import eel
import asyncio
import time
import re
import os
import sys
import socket
import threading
from urllib.parse import urlparse, urljoin
from collections import Counter
import io

import httpx
from bs4 import BeautifulSoup
import pytesseract
from PIL import Image
import dns.resolver

if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(os.path.abspath(__file__))

static_path = os.path.join(base_path, "static")
eel.init(static_path)

# ─────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────

async def safe_get(client, url, timeout=4.0):
    try:
        r = await client.get(url, timeout=timeout, follow_redirects=True)
        return r
    except:
        return None

def detect_tech_stack(headers: dict, html: str) -> list:
    hs = str(headers).lower()
    hl = html.lower()
    found = []
    # Servers
    if "cloudflare" in hs: found.append("Cloudflare CDN")
    if "nginx" in hs: found.append("Nginx")
    if "apache" in hs: found.append("Apache")
    if "litespeed" in hs: found.append("LiteSpeed")
    if "vercel" in hs: found.append("Vercel")
    if "netlify" in hs: found.append("Netlify")
    if "fly.io" in hs: found.append("Fly.io")
    if "heroku" in hs: found.append("Heroku")
    if "amazonaws" in hs: found.append("Amazon AWS")
    if "azure" in hs: found.append("Microsoft Azure")
    # Backend
    if ".php" in hl or "phpsessid" in hs: found.append("PHP")
    if "laravel" in hl or "laravel_session" in hs: found.append("Laravel (PHP)")
    if "symfony" in hl: found.append("Symfony (PHP)")
    if "wp-content" in hl or "wp-includes" in hl: found.append("WordPress")
    if "django" in hl or ("csrftoken" in hs and "python" not in hs): found.append("Django (Python)")
    if "fastapi" in hl: found.append("FastAPI (Python)")
    if "flask" in hl: found.append("Flask (Python)")
    if "__viewstate" in hl or "x-aspnet-version" in hs or "asp.net" in hs: found.append("ASP.NET (C#)")
    if "jsessionid" in hs: found.append("Java (Spring/JSP)")
    if "x-powered-by" in hs and "express" in hs: found.append("Node.js (Express)")
    if "ruby" in hs or "rails" in hl: found.append("Ruby on Rails")
    # CMS
    if "shopify" in hl: found.append("Shopify")
    if "wix.com" in hl or "wix-code" in hl: found.append("Wix")
    if "squarespace" in hl: found.append("Squarespace")
    if "drupal" in hl: found.append("Drupal")
    if "joomla" in hl: found.append("Joomla")
    # JS Frameworks
    if "_next/static" in hl or "__next" in hl: found.append("Next.js")
    elif "nuxt" in hl: found.append("Nuxt.js")
    if "data-reactroot" in hl or "react-dom" in hl or "__react" in hl: found.append("React")
    if "vue" in hl and ("v-app" in hl or "vue-router" in hl or "__vue" in hl): found.append("Vue.js")
    if "ng-version" in hl or "angular" in hl: found.append("Angular")
    if "jquery" in hl: found.append("jQuery")
    if "svelte" in hl: found.append("Svelte")
    if "alpine" in hl: found.append("Alpine.js")
    if "gsap" in hl or "greensock" in hl: found.append("GSAP (Animations)")
    if "framer-motion" in hl: found.append("Framer Motion")
    # CSS
    if "tailwind" in hl: found.append("Tailwind CSS")
    if "bootstrap" in hl: found.append("Bootstrap")
    if "bulma" in hl: found.append("Bulma")
    if "elementor" in hl: found.append("Elementor")
    # Analytics
    if "google-analytics" in hl or "gtag" in hl or "gtm.js" in hl: found.append("Google Analytics/GTM")
    if "fbq(" in hl or "facebook.net/en_US/fbevents" in hl: found.append("Facebook Pixel")
    if "hotjar" in hl: found.append("Hotjar")
    if "clarity" in hl: found.append("Microsoft Clarity")
    if "hubspot" in hl: found.append("HubSpot")
    return sorted(list(set(found)))

def detect_waf(headers: dict) -> str:
    hs = str(headers).lower()
    if "cloudflare" in hs: return "Cloudflare"
    if "sucuri" in hs: return "Sucuri"
    if "incapsula" in hs: return "Imperva Incapsula"
    if "x-varnish" in hs: return "Varnish"
    if "x-cache" in hs: return "CDN Cache"
    return "None detected"

def get_favicon(soup, base_url: str) -> str:
    for rel in ["shortcut icon", "icon", "apple-touch-icon"]:
        tag = soup.find("link", rel=lambda x: x and rel in " ".join(x).lower())
        if tag and tag.get("href"):
            return urljoin(base_url, tag["href"])
    return f"{base_url}/favicon.ico"

def extract_site_tree(soup, base_url: str) -> list:
    path_map = {}
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("javascript", "#", "mailto", "tel")):
            continue
        full = urljoin(base_url, href)
        if base_url not in full:
            continue
        path = urlparse(full).path.strip("/")
        if not path:
            continue
        parts = [p for p in path.split("/") if p]
        curr = path_map
        for p in parts:
            curr = curr.setdefault(p, {})

    def to_tree(d, depth=0):
        if depth > 4:
            return []
        result = []
        for name, children in sorted(d.items()):
            node = {"name": name, "type": "folder" if children else "page"}
            if children:
                node["children"] = to_tree(children, depth + 1)
            result.append(node)
        return result

    return to_tree(path_map)

def analyze_headers_security(headers: dict) -> list:
    checks = [
        ("Content-Security-Policy", "Protects against XSS and content injection attacks."),
        ("Strict-Transport-Security", "Forces HTTPS connections."),
        ("X-Frame-Options", "Prevents clickjacking."),
        ("X-Content-Type-Options", "Prevents MIME sniffing."),
        ("Referrer-Policy", "Controls referrer information sent."),
        ("Permissions-Policy", "Limits access to browser APIs."),
        ("X-XSS-Protection", "Legacy XSS protection."),
    ]
    results = []
    headers_lower = {k.lower() for k in headers.keys()}
    for header, desc in checks:
        present = header.lower() in headers_lower
        results.append({
            "header": header,
            "status": "Present" if present else "Missing",
            "desc": desc,
            "value": headers.get(header, headers.get(header.lower(), ""))
        })
    return results

def analyze_seo_full(soup_original) -> dict:
    soup = BeautifulSoup(str(soup_original), "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    raw_text = soup.get_text(separator=" ", strip=True)
    words = raw_text.split()
    word_count = len(words)

    stop_words = {"para", "com", "que", "uma", "dos", "das", "como", "mais", "this", "that", "from",
                  "the", "and", "not", "are", "was", "have", "been", "will", "with", "your", "can",
                  "our", "por", "mas", "este", "esta", "essa", "seus", "nas", "nos", "pelo", "pela"}
    clean_words = [w.lower() for w in words if len(w) > 3 and w.lower() not in stop_words and w.isalpha()]
    keyword_counts = Counter(clean_words).most_common(20)
    keyword_density = [{"word": w, "count": c} for w, c in keyword_counts]

    h_tags = {}
    for i in range(1, 7):
        tags = soup.find_all(f"h{i}")
        h_tags[f"h{i}"] = {"count": len(tags), "texts": [t.get_text(strip=True)[:80] for t in tags[:3]]}

    images = soup.find_all("img")
    images_no_alt = [img.get("src", "?")[:60] for img in images if not img.get("alt")]
    all_links = soup.find_all("a", href=True)
    external_links = len([a for a in all_links if a.get("href", "").startswith("http")])

    og = {
        "og:title": (soup.find("meta", property="og:title") or {}).get("content", ""),
        "og:description": (soup.find("meta", property="og:description") or {}).get("content", ""),
        "og:image": (soup.find("meta", property="og:image") or {}).get("content", ""),
    }

    return {
        "word_count": word_count,
        "keyword_density": keyword_density,
        "h_tags": h_tags,
        "images_no_alt": images_no_alt,
        "images_total": len(images),
        "external_links": external_links,
        "open_graph": og,
    }

def analyze_usability(soup, html: str) -> dict:
    html_tag = soup.find("html")
    has_lang = bool(html_tag and html_tag.get("lang"))
    lang_value = html_tag.get("lang", "not defined") if html_tag else "not defined"

    semantic_tags = {
        "nav": bool(soup.find("nav")),
        "main": bool(soup.find("main")),
        "footer": bool(soup.find("footer")),
        "header": bool(soup.find("header")),
        "aside": bool(soup.find("aside")),
        "article": bool(soup.find("article")),
        "section": bool(soup.find("section")),
    }
    semantic_score = sum(semantic_tags.values())

    inputs = soup.find_all("input", type=lambda t: t and t.lower() not in ["hidden", "submit", "button"])
    labels = soup.find_all("label")
    inputs_with_labels = 0
    for inp in inputs:
        inp_id = inp.get("id")
        if inp_id and soup.find("label", {"for": inp_id}):
            inputs_with_labels += 1
        elif inp.get("aria-label") or inp.get("aria-labelledby"):
            inputs_with_labels += 1

    images = soup.find_all("img")
    images_no_alt = [i for i in images if not i.get("alt")]
    alt_ratio = round((1 - len(images_no_alt) / len(images)) * 100) if images else 100

    has_skip_link = any("skip" in (a.get("href", "") + a.get_text()).lower() for a in soup.find_all("a"))
    has_viewport = bool(soup.find("meta", attrs={"name": "viewport"}))
    has_charset = bool(soup.find("meta", charset=True))

    interactives = soup.find_all(["button", "a", "input", "select", "textarea"])
    missing_aria = [el.name for el in interactives if not el.get("aria-label") and not el.get("aria-labelledby") and not el.get("title") and not el.get_text(strip=True)]

    forms = soup.find_all("form")
    forms_with_method = [f for f in forms if f.get("method")]

    text = soup.get_text().lower()
    readability_issues = []
    for phrase in ["clique aqui", "click here", "leia mais", "saiba mais"]:
        if phrase in text:
            readability_issues.append(f"Generic link usage: '{phrase}'")
    if "lorem ipsum" in text:
        readability_issues.append("Lorem Ipsum placeholder text detected")

    return {
        "has_lang": has_lang,
        "lang_value": lang_value,
        "semantic_tags": semantic_tags,
        "semantic_score": semantic_score,
        "inputs_total": len(inputs),
        "inputs_with_labels": inputs_with_labels,
        "alt_ratio": alt_ratio,
        "images_no_alt_count": len(images_no_alt),
        "has_skip_link": has_skip_link,
        "has_viewport": has_viewport,
        "has_charset": has_charset,
        "missing_aria_count": len(missing_aria),
        "forms_total": len(forms),
        "forms_with_method": len(forms_with_method),
        "readability_issues": readability_issues,
    }

async def check_sensitive_files(client, base_url: str) -> list:
    paths = ["/.env", "/.git/config", "/package.json", "/composer.json", "/.htaccess", "/config.php", "/web.config", "/.gitignore", "/phpinfo.php"]
    exposed = []
    for path in paths:
        try:
            r = await client.get(f"{base_url}{path}", timeout=2.0)
            if r.status_code == 200 and len(r.text) > 10:
                exposed.append(path)
        except: pass
    return exposed

async def check_admin_panels(client, base_url: str) -> list:
    paths = ["/wp-admin/", "/wp-login.php", "/admin/", "/administrator/", "/login/", "/cpanel", "/phpmyadmin/", "/backend/"]
    exposed = []
    for path in paths:
        try:
            r = await client.get(f"{base_url}{path}", timeout=3.0, follow_redirects=True)
            if r.status_code == 200 and any(kw in r.text.lower() for kw in ["login", "password", "admin", "senha"]):
                exposed.append(path)
        except: pass
    return exposed

async def check_broken_links(client, soup, base_url: str) -> list:
    seen = set()
    broken = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript")): continue
        full = urljoin(base_url, href)
        if full in seen or len(seen) >= 20: continue
        seen.add(full)
        try:
            r = await client.head(full, timeout=3.0, follow_redirects=True)
            if r.status_code >= 400:
                r2 = await client.get(full, timeout=3.0, follow_redirects=True)
                if r2.status_code >= 400:
                    broken.append({"url": full, "code": r2.status_code})
        except: pass
    return broken




# ─────────────────────────────────────────────────
# MAIN ANALYSIS
# ─────────────────────────────────────────────────

@eel.expose
def analyze_website_sync(url):
    return asyncio.run(analyze_website(url))

async def analyze_website(url: str):
    if not url.startswith("http"):
        url = "https://" + url
    start_time = time.time()
    try:
        ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True, verify=False, headers={"User-Agent": ua}) as client:
            response = await client.get(url)
            ttfb = round((time.time() - start_time) * 1000)

            html = response.text
            soup = BeautifulSoup(html, "html.parser")
            headers = dict(response.headers)
            headers_lower = {k.lower(): v for k, v in headers.items()}

            parsed = urlparse(url)
            base_url = f"{parsed.scheme}://{parsed.netloc}"
            domain = parsed.netloc

            title_tag = soup.find("title")
            title = title_tag.get_text(strip=True) if title_tag else ""
            desc_meta = soup.find("meta", attrs={"name": "description"})
            description = desc_meta.get("content", "").strip() if desc_meta else ""

            favicon = get_favicon(soup, base_url)
            tech_stack = detect_tech_stack(headers_lower, html)
            waf = detect_waf(headers_lower)
            header_audit = analyze_headers_security(headers)
            seo = analyze_seo_full(soup)
            usability = analyze_usability(soup, html)
            site_tree = extract_site_tree(soup, base_url)
            
            broken_links = await check_broken_links(client, soup, base_url)
            sensitive_files = await check_sensitive_files(client, base_url)
            admin_panels = await check_admin_panels(client, base_url)

            robots = await safe_get(client, f"{base_url}/robots.txt")
            has_robots = bool(robots and robots.status_code == 200 and len(robots.text) > 5)
            sitemap = await safe_get(client, f"{base_url}/sitemap.xml")
            has_sitemap = bool(sitemap and sitemap.status_code == 200)

            insecure_cookies = []
            for c in response.headers.get_list("set-cookie"):
                if "secure" not in c.lower() or "httponly" not in c.lower():
                    insecure_cookies.append(c.split("=")[0].strip())

            is_https = url.startswith("https")
            is_compressed = "gzip" in headers_lower.get("content-encoding", "") or "br" in headers_lower.get("content-encoding", "")
            page_size_kb = round(len(html) / 1024, 1)
            h1_count = seo["h_tags"]["h1"]["count"]
            scripts_count = len(soup.find_all("script"))
            styles_count = len(soup.find_all("link", rel="stylesheet"))

            # Network & DNS
            network = {"ip": "N/A", "geo": "N/A", "isp": "N/A", "asn": "N/A", "timezone": "N/A"}
            dns_info = {"mx": [], "ns": [], "dmarc": "Inactive", "spf": "Not found", "txt": [], "a": []}
            try:
                ip = socket.gethostbyname(domain)
                network["ip"] = ip
                try:
                    geo_r = await client.get(f"https://ipapi.co/{ip}/json/", timeout=4.0, headers={"User-Agent": ua})
                    if geo_r.status_code == 200:
                        g = geo_r.json()
                        if "error" not in g:
                            network["geo"] = f"{g.get('city', 'N/A')}, {g.get('country_name', 'N/A')}"
                            network["isp"] = g.get("org", "N/A")
                            network["asn"] = g.get("asn", "N/A")
                            network["timezone"] = g.get("timezone", "N/A")
                except:
                    pass
                # Fallback if geo still N/A
                if network["geo"] == "N/A":
                    try:
                        geo_r2 = await client.get(f"http://ip-api.com/json/{ip}?fields=city,country,isp,as,timezone", timeout=4.0)
                        if geo_r2.status_code == 200:
                            g2 = geo_r2.json()
                            if g2.get("city"):
                                network["geo"] = f"{g2.get('city', 'N/A')}, {g2.get('country', 'N/A')}"
                                network["isp"] = g2.get("isp", "N/A")
                                network["asn"] = g2.get("as", "N/A")
                                network["timezone"] = g2.get("timezone", "N/A")
                    except:
                        pass

                res = dns.resolver.Resolver()
                res.timeout = 2.0; res.lifetime = 2.0
                try:
                    ans = res.resolve(domain, "A")
                    dns_info["a"] = [str(a) for a in ans]
                except: pass
                try:
                    ans = res.resolve(domain, "NS")
                    dns_info["ns"] = [str(n.target).rstrip(".") for n in ans]
                except: pass
                try:
                    ans = res.resolve(domain, "MX")
                    dns_info["mx"] = [str(m.exchange).rstrip(".") for m in ans]
                except: pass
                try:
                    ans = res.resolve(domain, "TXT")
                    txts = [str(b) for b in ans]
                    dns_info["txt"] = txts[:5]
                    for t in txts:
                        if "v=spf1" in t.lower(): dns_info["spf"] = "Configured ✓"
                except: pass
                try:
                    ans = res.resolve(f"_dmarc.{domain}", "TXT")
                    dns_info["dmarc"] = "Active ✓" if any("DMARC1" in str(r) for r in ans) else "Inactive"
                except: pass
            except: pass

            # Scores
            alt_ratio = usability["alt_ratio"]
            p_score = 100 - (30 if ttfb > 2000 else 15 if ttfb > 800 else 0) - (20 if not is_compressed else 0) - (15 if page_size_kb > 4000 else 0)
            s_score = 100 - (20 if not title else 0) - (15 if not description else 0) - (15 if h1_count != 1 else 0) - (10 if not has_robots else 0) - (10 if not has_sitemap else 0) - (10 if not seo["open_graph"]["og:title"] else 0)
            sec_score = 100 - (50 if not is_https else 0) - (30 if sensitive_files else 0) - (20 if admin_panels else 0) - (15 if insecure_cookies else 0) - min(30, len([h for h in header_audit if h["status"] == "Missing"]) * 5)
            u_score = 100 - (15 if not usability["has_lang"] else 0) - (15 if usability["semantic_score"] < 3 else 0) - (20 if alt_ratio < 80 else 0) - (15 if not usability["has_viewport"] else 0)
            q_score = 100 - (min(40, len(broken_links) * 8)) - (10 if usability["readability_issues"] else 0)
            overall = int((max(0, p_score) + max(0, s_score) + max(0, sec_score) + max(0, u_score) + max(0, q_score)) / 5)

            return {
                "url": url,
                "score_geral": overall,
                "scores": {"performance": max(0, p_score), "seo": max(0, s_score), "security": max(0, sec_score), "usability": max(0, u_score), "quality": max(0, q_score)},
                "extracted_info": {
                    "title": title,
                    "description": description,
                    "favicon": favicon,
                    "tech_stack": tech_stack,
                    "sensitive_files": sensitive_files,
                    "admin_panels": admin_panels,
                    "network": network,
                    "dns": dns_info,
                    "site_tree": site_tree,
                    "header_audit": header_audit,
                    "seo": seo,
                    "usability": usability,
                    "insecure_cookies": insecure_cookies,
                },
                "metrics": {
                    "ttfb_ms": ttfb,
                    "page_size_kb": page_size_kb,
                    "is_https": is_https,
                    "is_compressed": is_compressed,
                    "h1_count": h1_count,
                    "alt_ratio": alt_ratio,
                    "waf": waf,
                    "scripts_count": scripts_count,
                    "styles_count": styles_count,
                    "has_robots": has_robots,
                    "has_sitemap": has_sitemap,
                    "broken_links": broken_links,
                    "broken_count": len(broken_links),
                },
            }

    except Exception as e:
        import traceback; traceback.print_exc()
        return {"error": str(e)}


if __name__ == "__main__":
    eel.start(
        "index.html",
        size=(1280, 860),
        port=8080,
        disable_cache=True,
    )
