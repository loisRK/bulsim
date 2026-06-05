/**
 * GET /api/notion/archive
 * 자료실 목록 조회
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_ARCHIVE_DB_ID
  if (!token || !dbId) return res.status(200).json(null)

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${dbId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization':  `Bearer ${token}`,
          'Content-Type':   'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          filter: { property: '공개', checkbox: { equals: true } },
          sorts:  [{ property: '날짜', direction: 'descending' }],
          page_size: 100,
        }),
      }
    )

    const data  = await response.json()
    const pages = data.results ?? []

    const items = pages.map(page => {
      const props    = page.properties
      const titleProp = props['Name'] || props['제목'] || props['이름']
      const date     = props['날짜']?.date?.start
        ? new Date(props['날짜'].date.start) : new Date()

      // 첨부파일 (Files & media 프로퍼티 — 여러 파일 지원)
      const filesProp = props['첨부파일'] || props['파일'] || props['Files'] || props['files']
      const attachments = (filesProp?.files ?? []).map(f => ({
        name: f.name || '파일',
        url:  f.type === 'external' ? f.external?.url : f.file?.url,
      })).filter(f => f.url)

      return {
        pageId: page.id,
        title:  titleProp?.title?.[0]?.plain_text ?? '',
        badge:  props['분류']?.select?.name ?? '문서',
        month:  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
        day:    String(date.getDate()).padStart(2, '0'),
        desc:   props['내용']?.rich_text?.[0]?.plain_text ?? '',
        attachments,
      }
    }).filter(item => item.title)

    res.status(200).json(items)
  } catch (err) {
    console.error('[archive API]', err)
    res.status(200).json(null)
  }
}
