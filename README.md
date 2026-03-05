# DotCore Analyzer - v1.0

Standalone desktop tool for website analysis — performance, SEO, security, usability and network forensics.

<p align="center">
  <img src="static/img/DotCore1600.png" alt="DotCore Logo" width="300">
</p>

## Features

- **Performance**: TTFB, page size, compression, asset counting.
- **SEO**: Robots.txt, sitemaps, canonical tags, heading hierarchy, keyword density.
- **Security**: WAF/CDN detection, HSTS, CSP, sensitive file exposure, admin panel detection.
- **Network Forensics**: IP tracking, geolocation, ISP/ASN lookup, DNS records (MX, DMARC, NS).
- **Usability**: Alt text ratio, semantic HTML, accessibility audit.
- **Tech Stack Detection**: WordPress, React, Next.js, Cloudflare, and more.
- **Multi-language**: English and Portuguese (PT-PT).
- **Standalone**: Runs as a desktop app via Eel + Chromium.

## Download

Download the ready-to-use executable from [Releases](https://github.com/Rocha4k/DotCoreAnalyzer/releases).

> For OCR features, install [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) separately.

## Run from source

```bash
pip install -r requirements.txt
python desktop_app.py
```

Requires **Python 3.9+**.

---
Built by **DotCore** | v1.0
