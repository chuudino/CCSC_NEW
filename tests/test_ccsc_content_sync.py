"""Regression checks for evidence fidelity and safe repeated content collection."""

import copy
import importlib.util
from pathlib import Path
import unittest

MODULE_PATH = Path(__file__).resolve().parents[1] / 'skills/ccsc-content-sync/scripts/collect_source.py'
SPEC = importlib.util.spec_from_file_location('ccsc_collect_source', MODULE_PATH)
sync = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(sync)


def detail(title='九月活動回顧', body='<p>活動日期：2026-09-20。</p>', nav='首頁'):
    return f'''<html><head><link rel="canonical" href="https://ccsc.org.tw/?p=42"></head>
    <body><nav>{nav}</nav><main><article id="post-42" class="type-notice ast-article-single group-102">
    <h1 class="entry-title">{title}</h1><div class="entry-meta"><span class="author-name">ccsc</span>
    <span class="published">2026-10-12</span></div><div class="entry-content">{body}</div>
    </article></main><footer><div><a href="tel:+886225230538">辦公室</a></div></footer></body></html>'''


class SourceEvidenceTests(unittest.TestCase):
    def test_publication_date_is_not_the_activity_date_or_uploader_the_author(self):
        page = sync.parse_page(detail(), 'https://ccsc.org.tw/?p=42')
        record = page['records'][0]
        self.assertEqual(record['published_date'], '2026-10-12')
        self.assertIn('2026-09-20', record['text'])
        self.assertEqual(record['uploader'], 'ccsc')
        self.assertNotIn('author', record)
        self.assertEqual(page['contacts'][0]['href'], 'tel:+886225230538')

    def test_calendar_retains_year_context_and_merged_cell_information(self):
        body = '<h2>台北分會</h2><h3>115年行事曆</h3><table><tr><td rowspan="2">1/18</td><td>分享會</td></tr><tr><td>講者甲</td></tr></table>'
        table = sync.parse_page(detail(body=body), 'https://ccsc.org.tw/?p=42')['records'][0]['tables'][0]
        self.assertEqual(table['heading_context'], ['台北分會', '115年行事曆'])
        self.assertEqual(table['rows'][0][0]['rowspan'], '2')
        self.assertEqual(table['rows'][0][0]['text'].rstrip(' |'), '1/18')
        self.assertEqual(table['rows'][1][0]['text'].rstrip(' |'), '講者甲')

    def test_identity_survives_title_changes_and_navigation_does_not_change_body_hash(self):
        original = sync.parse_page(detail(), 'https://ccsc.org.tw/?p=42')['records'][0]
        new_nav = sync.parse_page(detail(nav='新版選單'), 'https://ccsc.org.tw/?p=42')['records'][0]
        changed_title = sync.parse_page(detail(title='更正後活動標題'), 'https://ccsc.org.tw/?p=42')['records'][0]
        self.assertEqual(original['fingerprint'], new_nav['fingerprint'])
        self.assertEqual(original['source_key'], changed_title['source_key'])
        self.assertNotEqual(original['fingerprint'], changed_title['fingerprint'])

    def test_listing_excerpt_never_overwrites_fetched_detail_and_unchanged_run_has_no_delta(self):
        archive_url = 'https://ccsc.org.tw/?post_type=notice'
        entry_url = 'https://ccsc.org.tw/?p=42'
        archive = '''<main><article id="post-42" class="type-notice ast-article-post"><h2 class="entry-title"><a href="/?p=42">九月活動回顧</a></h2><div class="entry-content">短摘要</div></article><a class="next page-numbers" href="/?post_type=notice&paged=2">下一頁</a></main>'''
        pages = {archive_url: sync.parse_page(archive, archive_url), entry_url: sync.parse_page(detail(), entry_url)}
        first = sync.collect(pages.__getitem__, [entry_url, archive_url], {}, {}, recent=1)
        self.assertTrue(first['fetch_complete'])
        self.assertTrue(first['records']['notice:42']['is_detail'])
        self.assertIn('活動日期', first['records']['notice:42']['text'])
        self.assertFalse(first['scope']['historical_archive_complete'])
        self.assertEqual(len(first['scope']['unread_pagination']), 1)
        again = sync.collect(pages.__getitem__, [entry_url, archive_url], {}, first, recent=1)
        self.assertEqual(again['source_changes']['new'], [])
        self.assertEqual(again['source_changes']['changed'], [])

    def test_failed_fetch_does_not_erase_or_modify_prior_success(self):
        baseline = {'records': {'notice:42': {'fingerprint': 'prior'}}}
        saved = copy.deepcopy(baseline)
        def unavailable(url):
            raise OSError('temporary source failure')
        result = sync.collect(unavailable, ['https://ccsc.org.tw/?p=42'], {}, baseline)
        self.assertFalse(result['fetch_complete'])
        self.assertEqual(result['source_changes']['not_observed_this_run'], ['notice:42'])
        self.assertNotIn('deleted', result['source_changes'])
        self.assertEqual(baseline, saved)

    def test_external_links_are_evidence_but_cannot_be_followed_as_source(self):
        page = sync.parse_page(detail(body='<p><a href="https://example.org/issue.pdf">下載刊物</a></p>'), 'https://ccsc.org.tw/?p=42')
        self.assertEqual(page['records'][0]['content_links'][0]['url'], 'https://example.org/issue.pdf')
        self.assertIsNone(sync.official_url('https://ccsc.org.tw.evil.example/'))
        self.assertIsNone(sync.official_url('https://ccsc.org.tw:invalid/'))
        self.assertIsNone(sync.official_url('https://example.org/issue.pdf'))
        self.assertEqual(sync.official_url('/?post_type=notice&paged=2'), sync.official_url('/?paged=2&post_type=notice'))
        with self.assertRaises(ValueError):
            sync.collect(lambda url: None, ['https://example.org/'], {}, {})


if __name__ == '__main__':
    unittest.main()
