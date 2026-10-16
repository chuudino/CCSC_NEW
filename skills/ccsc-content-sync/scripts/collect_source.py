#!/usr/bin/env python3
"""Collect public CCSC evidence. Never edit site data, publish, or advance a baseline."""

import argparse
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = 'https://ccsc.org.tw/'
HOSTS = {'ccsc.org.tw', 'www.ccsc.org.tw'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
SKIP = {'script', 'style', 'noscript', 'nav', 'footer'}
BLOCKS = {'p', 'div', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'li', 'tr', 'blockquote', 'br'}
SECTIONS = {
    'about:identity': '小會是什麼？', 'about:principles': '宗旨精神',
    'about:history': '歷史沿革', 'about:timeline': '大事年表',
    'calendar': '行事曆', 'notices': '活動訊息', 'culture': '文化福傳',
    'prayer': '默觀月訊', 'periodicals:fountain': '心泉', 'periodicals:seed': '芥子',
    **{f'group:{name}': name for name in ['總會', '台北分會', '台中分會', '高雄分會', '北美分會']},
}


def official_url(value, base=ROOT):
    if not value or value.startswith(('#', 'mailto:', 'tel:')):
        return None
    try:
        parsed = urllib.parse.urlsplit(urllib.parse.urljoin(base, value))
        allowed = parsed.scheme in {'http', 'https'} and parsed.hostname in HOSTS and not (parsed.username or parsed.password or parsed.port)
    except ValueError:
        return None
    if not allowed:
        return None
    path = urllib.parse.quote(urllib.parse.unquote(parsed.path or '/'), safe='/@:+')
    query = urllib.parse.urlencode(sorted(urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)))
    return urllib.parse.urlunsplit(('https', 'ccsc.org.tw', path, query, ''))


class OfficialRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        allowed = official_url(new_url, request.full_url)
        if not allowed:
            raise ValueError('Redirect leaves the selected public source')
        return super().redirect_request(request, fp, code, message, headers, allowed)


class Node:
    def __init__(self, tag, attrs=None):
        self.tag, self.attrs, self.children = tag, dict(attrs or []), []

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def has_class(self, name):
        return name in self.attrs.get('class', '').split()


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node('document')
        self.stack = [self.root]
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, value):
        self.stack[-1].children.append(value)


def text(node):
    def raw(item):
        if isinstance(item, str):
            return item
        if item.tag in SKIP:
            return ''
        value = ''.join(raw(child) for child in item.children)
        return value + (' | ' if item.tag in {'td', 'th'} else '\n' if item.tag in BLOCKS else '')
    return '\n'.join(line for line in (' '.join(row.split()) for row in raw(node).splitlines()) if line)


def first(node, predicate):
    return next((item for item in node.walk() if predicate(item)), None)


def links(node, base):
    result = []
    seen = set()
    for item in node.walk():
        if item.tag == 'a' and (url := official_url(item.attrs.get('href'), base)):
            if (url, text(item)) not in seen:
                result.append({'url': url, 'title': text(item), 'rel': item.attrs.get('rel', ''), 'class': item.attrs.get('class', '')})
                seen.add((url, text(item)))
    return result


def observed_content_links(node, base):
    result = []
    for item in node.walk():
        if item.tag == 'a' and item.attrs.get('href'):
            url = urllib.parse.urljoin(base, item.attrs['href'])
            if url.startswith(('https://', 'http://', 'mailto:', 'tel:')):
                result.append({'url': url, 'title': text(item)})
    return result


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()


def tables(node):
    result, context = [], []
    for item in node.walk():
        if item.tag in {'h1', 'h2', 'h3'}:
            context = (context + [text(item)])[-3:]
        if item.tag == 'table':
            rows = []
            for row in item.walk():
                if row.tag == 'tr':
                    rows.append([{'text': text(cell), 'rowspan': cell.attrs.get('rowspan', '1'), 'colspan': cell.attrs.get('colspan', '1')}
                                 for cell in row.children if isinstance(cell, Node) and cell.tag in {'td', 'th'}])
            result.append({'heading_context': list(context), 'rows': rows})
    return result


def parse_page(html, requested_url):
    root = Document(html).root
    main = first(root, lambda n: n.tag == 'main')
    if main is None:
        raise ValueError('Expected public main content was not found; inspect the source instead of importing an empty page')
    canonical = first(root, lambda n: n.tag == 'link' and n.attrs.get('rel') == 'canonical')
    page_url = official_url(canonical.attrs.get('href'), requested_url) if canonical else requested_url
    page_url = page_url or requested_url
    entries = []
    for article in (node for node in main.walk() if node.tag == 'article'):
        title_node = first(article, lambda n: n.has_class('entry-title'))
        content = first(article, lambda n: n.has_class('entry-content'))
        if title_node is None or content is None:
            continue
        title_links = links(title_node, page_url)
        detail = article.has_class('ast-article-single') or title_node.tag == 'h1'
        source_url = page_url if detail else title_links[0]['url'] if title_links else page_url
        classes = article.attrs.get('class', '').split()
        post_type = next((name[5:] for name in classes if name.startswith('type-')), 'entry')
        post_id = re.fullmatch(r'post-(\d+)', article.attrs.get('id', ''))
        source_key = f'{post_type}:{post_id[1]}' if post_id else source_url
        published_node = first(article, lambda n: n.has_class('published') or n.has_class('posted-on'))
        published_match = re.search(r'\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b', text(published_node)) if published_node else None
        byline = first(article, lambda n: n.has_class('author-name'))
        data = {
            'source_key': source_key, 'source_url': source_url, 'post_type': post_type,
            'title': text(title_node), 'is_detail': detail,
            'published_date': published_match[0] if published_match else None,
            'uploader': text(byline) if byline else None,
            'taxonomy_classes': [name for name in classes if name.startswith(('group-', 'category-', 'periodical_type-'))],
            'text': text(content), 'tables': tables(content),
            'headings': [text(n) for n in content.walk() if n.tag in {'h1', 'h2', 'h3'}],
            'content_links': observed_content_links(content, source_url),
            'media': [{'url': urllib.parse.urljoin(source_url, n.attrs.get('src', '')), 'alt': n.attrs.get('alt', '')}
                      for n in content.walk() if n.tag in {'img', 'video', 'iframe'} and n.attrs.get('src')],
            'has_detail_link': detail or bool(title_links),
        }
        data['fingerprint'] = fingerprint(data)
        entries.append(data)
    page_links = links(root, page_url)
    pagination = [link['url'] for link in links(main, page_url) if 'next' in link['class'].split() or 'next' in link['rel'].split()]
    contacts = [{'href': n.attrs['href'], 'label': text(n)} for n in root.walk()
                if n.tag == 'a' and n.attrs.get('href', '').startswith(('tel:', 'mailto:'))]
    footer_text = '\n'.join(text(child) for footer in root.walk() if footer.tag == 'footer'
                            for child in footer.children if isinstance(child, Node))
    return {'url': page_url, 'text': text(main), 'records': entries, 'links': page_links,
            'contacts': contacts, 'footer_text': footer_text,
            'next_pages': list(dict.fromkeys(pagination)), 'fingerprint': fingerprint(text(main))}


def fetch_page(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'CCSC-content-sync/1.0', 'Accept': 'text/html,application/xhtml+xml'})
    opener = urllib.request.build_opener(OfficialRedirect())
    with opener.open(request, timeout=20) as response:
        raw = response.read(3_000_001)
        if len(raw) > 3_000_000:
            raise ValueError('Page exceeds the 3 MB evidence limit; read the affected page separately')
        return parse_page(raw.decode(response.headers.get_content_charset() or 'utf-8'), official_url(response.url))


def read_json(path, fallback):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else fallback


def source_diff(previous, current):
    return {
        'new': sorted(current.keys() - previous.keys()),
        'changed': sorted(key for key in current.keys() & previous.keys() if current[key]['fingerprint'] != previous[key].get('fingerprint')),
        'not_observed_this_run': sorted(previous.keys() - current.keys()),
    }


def collect(fetch, explicit_urls, source_map, previous, max_pages=160, recent=10):
    pages, records, failures, missing, unread = {}, {}, [], [], []
    attempted = set()

    def visit(url, section):
        if url in pages:
            page = pages[url]
        else:
            if url in attempted:
                return None
            attempted.add(url)
            if len(attempted) > max_pages:
                failures.append({'url': url, 'reason': 'Page budget reached; increase --max-pages or continue with these URLs'})
                return None
            try:
                page = fetch(url)
                pages[url] = page
            except (OSError, ValueError, UnicodeError) as error:
                failures.append({'url': url, 'reason': f'{type(error).__name__}: {error}'})
                return None
        for entry in page['records']:
            key = entry['source_key']
            old = records.get(key)
            observed = set(old.get('observed_in', [])) if old else set()
            observed.add(section)
            if old is None or entry['is_detail'] or not old['is_detail']:
                records[key] = dict(entry)
            records[key]['observed_in'] = sorted(observed)
        for next_url in page['next_pages']:
            if next_url not in unread:
                unread.append(next_url)
        return page

    if explicit_urls:
        seeds = [(official_url(url), 'explicit') for url in explicit_urls]
        if any(url is None for url, _ in seeds):
            raise ValueError('Explicit URLs must be public pages on ccsc.org.tw')
    else:
        home = visit(ROOT, 'homepage')
        seeds = []
        for key, label in SECTIONS.items():
            link = next((link for link in home['links'] if link['title'] == label), None) if home else None
            if link:
                seeds.append((link['url'], key))
            else:
                missing.append({'section': key, 'expected_label': label})
    detail_queue = []
    for url, section in dict.fromkeys(seeds):
        page = visit(url, section)
        if page:
            for entry in page['records'][:recent]:
                if not entry['is_detail'] and entry['has_detail_link']:
                    detail_queue.append((entry['source_url'], section))
    for item in source_map.get('records', {}).values():
        url = official_url(item.get('source_url'))
        if url:
            visit(url, 'existing-project-record')
        else:
            failures.append({'url': item.get('source_url'), 'reason': 'Source-map URL is outside the selected official source'})
    for url, section in dict.fromkeys(detail_queue):
        visit(url, section)
    return {
        'schema_version': 1, 'source_root': ROOT,
        'fetched_at': datetime.now(timezone.utc).isoformat(),
        'fetch_complete': not failures and not missing,
        'scope': {'mode': 'explicit-pages' if explicit_urls else 'current-section-pages-and-existing-project-records',
                  'recent_details_per_section': recent, 'historical_archive_complete': False,
                  'pages_read': len(pages), 'unread_pagination': [url for url in unread if url not in pages]},
        'pages': pages, 'records': records, 'failures': failures, 'missing_sections': missing,
        'source_changes': source_diff(previous.get('records', {}), records),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--url', action='append', default=[], help='Read only these observed official URLs')
    parser.add_argument('--source-map', type=Path, default=Path('content/official-source-map.json'))
    parser.add_argument('--baseline', type=Path, default=Path('.maintenance/content-sync/last-published.json'))
    parser.add_argument('--max-pages', type=int, default=160)
    parser.add_argument('--recent-per-section', type=int, default=10)
    args = parser.parse_args()
    if not 1 <= args.max_pages <= 500 or not 1 <= args.recent_per_section <= 100:
        parser.error('Use --max-pages 1..500 and --recent-per-section 1..100')
    if args.output.resolve() in {args.baseline.resolve(), args.source_map.resolve()}:
        parser.error('Evidence output must not overwrite the source map or successful publication baseline')
    result = collect(fetch_page, args.url, read_json(args.source_map, {}), read_json(args.baseline, {}), args.max_pages, args.recent_per_section)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(args.output.suffix + '.tmp')
    temporary.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temporary.replace(args.output)
    print(json.dumps({'output': str(args.output.resolve()), 'fetch_complete': result['fetch_complete'],
                      'pages_read': len(result['pages']), 'records': len(result['records']),
                      'failures': result['failures'], 'missing_sections': result['missing_sections'],
                      'source_changes': {key: len(value) for key, value in result['source_changes'].items()}}, ensure_ascii=False))
    return 0 if result['fetch_complete'] else 2


if __name__ == '__main__':
    sys.exit(main())
