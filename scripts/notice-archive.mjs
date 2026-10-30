// Versioned import of already-published summaries; no live scraping or inferred dates.
export function buildNoticeArchive(notices, assignments) {
  const slugs = new Set(notices.map(item => item.slug));
  if (Object.keys(assignments).length !== slugs.size || Object.keys(assignments).some(slug => !slugs.has(slug))) {
    throw Error('公告歸檔對照必須逐筆涵蓋既有公告');
  }
  return notices.map(notice => {
    const assignment = assignments[notice.slug];
    const draft = {
      ...assignment, publishedDate: notice.date, title: notice.title,
      endDate: assignment.endDate || '', location: assignment.location || '',
      body: [...new Set([notice.excerpt, ...notice.content])].join('\n\n'),
      legacySlugs: [notice.slug], sourceKeys: [notice.sourceKey],
      sourceUrl: notice.sourceUrl, links: notice.links || [],
    };
    return { id: 'archive-' + notice.sourceKey.replace(':', '-'), draft, published: structuredClone(draft), version: 1, approvedVersion: 1 };
  });
}
