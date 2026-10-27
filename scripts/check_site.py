#!/usr/bin/env python3
"""Lightweight static checks for the GitHub Pages site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import posixpath
import sys

ROOT = Path(__file__).resolve().parents[1]
SITE_ORIGIN = "https://startupintelligence.github.io"
SITE_PREFIX = "/startup-intelligence/"

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.description = False
        self.viewport = False
        self.links = []
        self.images = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.in_title = True
        if tag == "meta" and a.get("name", "").lower() == "description" and a.get("content", "").strip(): self.description = True
        if tag == "meta" and a.get("name", "").lower() == "viewport": self.viewport = True
        if tag == "a":
            href = a.get("href")
            if href is None or not href.strip(): self.errors.append("anchor has missing/empty href")
            else: self.links.append(href.strip())
        if tag == "img":
            if "alt" not in a: self.errors.append("image is missing alt text")
            src = a.get("src")
            if src: self.links.append(src.strip())
        if tag in ("script", "link"):
            attr = "src" if tag == "script" else "href"
            value = a.get(attr)
            if value and (tag == "script" or a.get("rel", "").lower() in ("stylesheet", "icon", "manifest", "apple-touch-icon")):
                self.links.append(value.strip())
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data

def target_for(page_path, href):
    if href.startswith(("mailto:", "tel:", "javascript:", "data:")): return None
    page_url = SITE_ORIGIN + SITE_PREFIX + page_path
    resolved = urlparse(urljoin(page_url, href))
    if resolved.netloc and resolved.netloc != "startupintelligence.github.io": return None
    path = unquote(resolved.path)
    if path.startswith(SITE_PREFIX): path = path[len(SITE_PREFIX):]
    elif path == "/startup-intelligence": path = ""
    elif path.startswith("/") and path != "/": return None
    else: path = path.lstrip("/")
    path = posixpath.normpath(path or ".")
    if path in (".", "") or resolved.path.endswith("/"): path = posixpath.join(path, "index.html") if path not in (".", "") else "index.html"
    elif not posixpath.splitext(path)[1]: path = posixpath.join(path, "index.html")
    return path

def main():
    html_files = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    available = {p.relative_to(ROOT).as_posix() for p in html_files}
    available.update(p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*") if p.is_file())
    failures = []
    for file in html_files:
        rel = file.relative_to(ROOT).as_posix()
        source = file.read_text(encoding="utf-8", errors="replace")
        page = Page()
        try: page.feed(source)
        except Exception as exc: failures.append(f"{rel}: HTML parser error: {exc}"); continue
        if not page.title.strip(): failures.append(f"{rel}: missing title")
        if not page.description: failures.append(f"{rel}: missing meta description")
        if not page.viewport: failures.append(f"{rel}: missing viewport meta")
        failures.extend(f"{rel}: {err}" for err in page.errors)
        for href in page.links:
            target = target_for(rel, href)
            if target is not None and target not in available:
                failures.append(f"{rel}: local target not found: {href} -> {target}")
    if failures:
        print("Site checks failed:")
        print("\n".join(f"- {f}" for f in failures))
        return 1
    print(f"Site checks passed for {len(html_files)} HTML files; local links and referenced assets resolve.")
    return 0

if __name__ == "__main__": sys.exit(main())
