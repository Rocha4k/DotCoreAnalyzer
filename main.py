import asyncio
import time
import re
import os
import sys
import socket
from urllib.parse import urlparse, urljoin
from collections import Counter
import io

import httpx
from bs4 import BeautifulSoup
import pytesseract
from PIL import Image
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import dns.resolver
import uvicorn

if getattr(sys, 'frozen', False):
    base_path = sys._MEIPASS
else:
    base_path = os.path.dirname(os.path.abspath(__file__))

static_path = os.path.join(base_path, "static")

app = FastAPI(title="DotCore Analyzer API")

@app.middleware("http")
async def add_custom_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Powered-By"] = "DotCore Analyzer"
    return response

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class AnalyzeRequest(BaseModel):
    url: str

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
    if "aws" in hs or "amazonaws" in hs: found.append("Amazon AWS")
    if "azure" in hs: found.append("Microsoft Azure")
    if "google" in hs and ("googleapis" in hs or "ghs.google" in hl): found.append("Google Cloud")

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
    if "go-http-client" in hs: found.append("Go (Golang)")

    # CMS
    if "shopify" in hl: found.append("Shopify")
    if "wix.com" in hl or "wix-code" in hl: found.append("Wix")
    if "squarespace" in hl: found.append("Squarespace")
    if "drupal" in hl: found.append("Drupal")
    if "joomla" in hl: found.append("Joomla")
    if "ghost" in hl: found.append("Ghost CMS")

    # JS Frameworks
    if "_next/static" in hl or "__next" in hl: found.append("Next.js")
    elif "nuxt" in hl: found.append("Nuxt.js")
    if "data-reactroot" in hl or "react-dom" in hl or "__react" in hl: found.append("React")
    if "vue" in hl and ("v-app" in hl or "vue-router" in hl or "__vue" in hl): found.append("Vue.js")
    if "ng-version" in hl or "angular" in hl: found.append("Angular")
    if "jquery" in hl: found.append("jQuery")
    if "svelte" in hl: found.append("Svelte")
    if "alpine" in hl: found.append("Alpine.js")
    if "three.js" in hl or "three.min.js" in hl: found.append("Three.js (3D)")
    if "gsap" in hl or "greensock" in hl: found.append("GSAP (Animations)")
    if "framer-motion" in hl: found.append("Framer Motion")

    # CSS
    if "tailwind" in hl: found.append("Tailwind CSS")
    if "bootstrap" in hl: found.append("Bootstrap")
    if "bulma" in hl: found.append("Bulma")
    if "chakra" in hl: found.append("Chakra UI")
    if "material-ui" in hl or "MuiBox" in html: found.append("Material UI")
    if "elementor" in hl: found.append("Elementor")

    # Analytics
    if "google-analytics" in hl or "gtag" in hl or "gtm.js" in hl: found.append("Google Analytics/GTM")
    if "fbq(" in hl or "facebook.net/en_US/fbevents" in hl: found.append("Facebook Pixel")
    if "hotjar" in hl: found.append("Hotjar")
    if "clarity" in hl: found.append("Microsoft Clarity")
    if "hubspot" in hl: found.append("HubSpot")

    return sorted(list(set(found)))

def detect_waf(headers: dict, html: str) -> str:
    hs = str(headers).lower()
    if "cloudflare" in hs: return "Cloudflare"
    if "sucuri" in hs: return "Sucuri"
    if "incapsula" in hs: return "Imperva Incapsula"
    if "x-varnish" in headers: return "Varnish"
    if "x-cache" in headers: return "CDN Cache"
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
        if not href or href.startswith("javascript") or href.startswith("#") or href.startswith("mailto") or href.startswith("tel"):
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
    for header, desc in checks:
        present = header.lower() in {k.lower() for k in headers.keys()}
        results.append({
            "header": header,
            "status": "Present" if present else "Missing",
            "desc": desc,
            "value": headers.get(header.lower(), "")
        })
    return results

def analyze_seo_full(soup_original) -> dict:
    soup = BeautifulSoup(str(soup_original), "html.parser")
    for tag in soup(["script", "style", "noscript", "head"]):
        tag.decompose()

    raw_text = soup.get_text(separator=" ", strip=True)
    words = raw_text.split()
    word_count = len(words)

    # Keyword density – filter stop words
    stop_words = {"para", "com", "que", "uma", "dos", "das", "como", "mais", "this", "that", "from",
                  "the", "and", "not", "are", "was", "have", "been", "will", "with", "your", "can",
                  "our", "por", "mas", "este", "esta", "essa", "seus", "nas", "nos", "pelo", "pela"}
    clean_words = [w.lower() for w in words if len(w) > 3 and w.lower() not in stop_words and w.isalpha()]
    keyword_counts = Counter(clean_words).most_common(20)
    keyword_density = [{"word": w, "count": c} for w, c in keyword_counts]

    # H tags
    h_tags = {}
    for i in range(1, 7):
        tags = soup.find_all(f"h{i}")
        h_tags[f"h{i}"] = {"count": len(tags), "texts": [t.get_text(strip=True)[:80] for t in tags[:3]]}

    # Images
    images = soup.find_all("img")
    images_no_alt = [img.get("src", "?")[:60] for img in images if not img.get("alt")]

    # Links
    all_links = soup.find_all("a", href=True)
    no_follow = [a.get("href", "") for a in all_links if "nofollow" in (a.get("rel") or [])]
    external_links = [a.get("href", "") for a in all_links if a.get("href", "").startswith("http")]

    # Open Graph
    og = {
        "og:title": (soup.find("meta", property="og:title") or {}).get("content", ""),
        "og:description": (soup.find("meta", property="og:description") or {}).get("content", ""),
        "og:image": (soup.find("meta", property="og:image") or {}).get("content", ""),
    }

    # Twitter Card
    twitter = {
        "twitter:card": (soup.find("meta", attrs={"name": "twitter:card"}) or {}).get("content", ""),
        "twitter:title": (soup.find("meta", attrs={"name": "twitter:title"}) or {}).get("content", ""),
    }

    return {
        "word_count": word_count,
        "keyword_density": keyword_density,
        "h_tags": h_tags,
        "images_no_alt": images_no_alt,
        "images_total": len(images),
        "no_follow_links": len(no_follow),
        "external_links": len(external_links),
        "open_graph": og,
        "twitter_card": twitter,
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
    has_charset = bool(soup.find("meta", charset=True) or soup.find("meta", attrs={"http-equiv": "Content-Type"}))

    color_contrast_note = "Not analysable without rendering"

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

async def analyze_network(client, domain: str, ip: str) -> dict:
    try:
        geo_resp = await client.get(f"https://ipapi.co/{ip}/json/", timeout=5.0)
        if geo_resp.status_code == 200:
            g = geo_resp.json()
            return {
                "ip": ip,
                "city": g.get("city", "N/A"),
                "region": g.get("region", "N/A"),
                "country": g.get("country_name", "N/A"),
                "isp": g.get("org", "N/A"),
                "asn": g.get("asn", "N/A"),
                "timezone": g.get("timezone", "N/A"),
                "geo": f"{g.get('city', 'N/A')}, {g.get('country_name', 'N/A')}",
            }
    except:
        pass
    return {"ip": ip, "city": "N/A", "country": "N/A", "isp": "N/A", "asn": "N/A", "timezone": "N/A", "geo": "N/A"}

async def analyze_dns(domain: str, loop) -> dict:
    res = dns.resolver.Resolver()
    res.timeout = 2.0
    res.lifetime = 2.0

    records = {"mx": [], "ns": [], "dmarc": "Inactive", "spf": "Not found", "txt": [], "a": []}

    for rtype, key in [("A", "a"), ("NS", "ns"), ("MX", "mx"), ("TXT", "txt")]:
        try:
            answers = await loop.run_in_executor(None, lambda rt=rtype: res.resolve(domain, rt))
            if rtype == "A":
                records["a"] = [str(a) for a in answers]
            elif rtype == "NS":
                records["ns"] = [str(n.target).rstrip(".") for n in answers]
            elif rtype == "MX":
                records["mx"] = [str(m.exchange).rstrip(".") for m in answers]
            elif rtype == "TXT":
                txts = [str(b) for b in answers]
                records["txt"] = txts[:5]
                for t in txts:
                    if "v=spf1" in t.lower():
                        records["spf"] = "Configured ✓"
        except:
            pass

    try:
        dmarc_ans = await loop.run_in_executor(None, lambda: res.resolve(f"_dmarc.{domain}", "TXT"))
        for r in dmarc_ans:
            if "v=DMARC1" in str(r):
                records["dmarc"] = "Active ✓"
    except:
        pass

    return records

async def check_sensitive_files(client, base_url: str) -> list:
    paths = ["/.env", "/.git/config", "/package.json", "/composer.json", "/.htaccess",
             "/config.php", "/web.config", "/.gitignore", "/phpinfo.php"]
    exposed = []
    for path in paths:
        try:
            r = await client.get(f"{base_url}{path}", timeout=2.0)
            if r.status_code == 200 and len(r.text) > 10:
                exposed.append(path)
        except:
            pass
    return exposed

async def check_admin_panels(client, base_url: str) -> list:
    paths = ["/wp-admin/", "/wp-login.php", "/admin/", "/administrator/", "/login/",
             "/cpanel", "/phpmyadmin/", "/backend/", "/portal/"]
    exposed = []
    for path in paths:
        try:
            r = await client.get(f"{base_url}{path}", timeout=3.0, follow_redirects=True)
            if r.status_code == 200 and any(kw in r.text.lower() for kw in ["login", "password", "admin", "senha"]):
                exposed.append(path)
        except:
            pass
    return exposed

async def check_broken_links(client, soup, base_url: str) -> list:
    seen = set()
    broken = []
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript")):
            continue
        full = urljoin(base_url, href)
        if full in seen or len(seen) >= 20:
            continue
        seen.add(full)
        try:
            r = await client.head(full, timeout=3.0, follow_redirects=True)
            if r.status_code >= 400:
                r2 = await client.get(full, timeout=3.0, follow_redirects=True)
                if r2.status_code >= 400:
                    broken.append({"url": full, "code": r2.status_code})
        except:
            pass
    return broken

# ─────────────────────────────────────────────────
# MAIN ANALYSIS
# ─────────────────────────────────────────────────

async def analyze_website(url: str):
    if not url.startswith("http"):
        url = "https://" + url

    start_time = time.time()

    try:
        ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        async with httpx.AsyncClient(
            timeout=20.0, follow_redirects=True, verify=False,
            headers={"User-Agent": ua}
        ) as client:
            response = await client.get(url)
            ttfb = round((time.time() - start_time) * 1000)

            html = response.text
            soup = BeautifulSoup(html, "html.parser")
            headers = dict(response.headers)
            headers_lower = {k.lower(): v for k, v in headers.items()}
            
            parsed = urlparse(url)
            base_url = f"{parsed.scheme}://{parsed.netloc}"
            domain = parsed.netloc

            # ── Basic SEO ──
            title_tag = soup.find("title")
            title = title_tag.get_text(strip=True) if title_tag else ""
            desc_meta = soup.find("meta", attrs={"name": "description"})
            description = desc_meta.get("content", "").strip() if desc_meta else ""
            
            # ── Favicon ──
            favicon = get_favicon(soup, base_url)

            # ── Tech ──
            tech_stack = detect_tech_stack(headers_lower, html)
            waf = detect_waf(headers_lower, html)

            # ── Security Headers ──
            header_audit = analyze_headers_security(headers_lower)

            # ── SEO Full ──
            seo = analyze_seo_full(soup)

            # ── Usability Full ──
            usability = analyze_usability(soup, html)

            # ── Site Tree ──
            site_tree = extract_site_tree(soup, base_url)

            # ── Network & DNS ──
            loop = asyncio.get_event_loop()
            try:
                ip = await loop.run_in_executor(None, lambda: socket.gethostbyname(domain))
            except:
                ip = "N/A"

            network = await analyze_network(client, domain, ip) if ip != "N/A" else {"ip": "N/A", "geo": "N/A", "isp": "N/A", "asn": "N/A"}
            dns_info = await analyze_dns(domain, loop)

            # ── Broken Links ──
            broken_links = await check_broken_links(client, soup, base_url)

            # ── Security Checks ──
            sensitive_files = await check_sensitive_files(client, base_url)
            admin_panels = await check_admin_panels(client, base_url)

            # ── Robots / Sitemap ──
            robots = (await safe_get(client, f"{base_url}/robots.txt"))
            has_robots = bool(robots and robots.status_code == 200 and len(robots.text) > 5)
            sitemap = (await safe_get(client, f"{base_url}/sitemap.xml"))
            has_sitemap = bool(sitemap and sitemap.status_code == 200)

            # ── Cookies ──
            insecure_cookies = []
            for c in response.headers.get_list("set-cookie"):
                if "secure" not in c.lower() or "httponly" not in c.lower():
                    insecure_cookies.append(c.split("=")[0].strip())

            # ── Metrics ──
            is_https = url.startswith("https")
            is_compressed = "gzip" in headers_lower.get("content-encoding", "") or "br" in headers_lower.get("content-encoding", "")
            page_size_kb = round(len(html) / 1024, 1)
            images = soup.find_all("img")
            alt_ratio = usability["alt_ratio"]
            h1_count = seo["h_tags"]["h1"]["count"]
            scripts_count = len(soup.find_all("script"))
            styles_count = len(soup.find_all("link", rel="stylesheet"))

            # ── Scores ──
            perf = 100
            if ttfb > 2000: perf -= 40
            elif ttfb > 800: perf -= 20
            if not is_compressed: perf -= 20
            if page_size_kb > 4000: perf -= 20

            seo_s = 100
            if not title: seo_s -= 20
            if not description: seo_s -= 15
            if h1_count != 1: seo_s -= 15
            if not has_robots: seo_s -= 10
            if not has_sitemap: seo_s -= 10
            if seo["word_count"] < 300: seo_s -= 10
            if not seo["open_graph"]["og:title"]: seo_s -= 10

            sec = 100
            if not is_https: sec -= 50
            if sensitive_files: sec -= 30
            if admin_panels: sec -= 20
            if insecure_cookies: sec -= 15
            missing_headers = [h for h in header_audit if h["status"] == "Missing"]
            sec -= min(30, len(missing_headers) * 5)

            usab = 100
            if not usability["has_lang"]: usab -= 15
            if usability["semantic_score"] < 3: usab -= 15
            if usability["alt_ratio"] < 80: usab -= 20
            if not usability["has_viewport"]: usab -= 15
            if usability["readability_issues"]: usab -= 10

            qual = 100
            if broken_links: qual -= min(40, len(broken_links) * 8)
            if usability["readability_issues"]: qual -= 10

            overall = int((max(0, perf) + max(0, seo_s) + max(0, sec) + max(0, usab) + max(0, qual)) / 5)

            return {
                "url": url,
                "score_geral": overall,
                "scores": {
                    "performance": max(0, perf),
                    "seo": max(0, seo_s),
                    "security": max(0, sec),
                    "usability": max(0, usab),
                    "quality": max(0, qual),
                },

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
        raise HTTPException(status_code=400, detail=f"Analysis error: {str(e)}")


@app.post("/api/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    return await analyze_website(request.url)

app.mount("/", StaticFiles(directory=static_path), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
