/**
 * GET /api/notion/notices
 * 공지사항 — 플랫 리스트로 반환 (카테고리 태그 포함)
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_NOTICES_DB_ID
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

    const CATEGORY_MAP = {
      '사중': '사중', '공지': '사중',
      '교육': '교육',
      '봉사': '봉사',
    }

    const items = pages.map(page => {
      const props    = page.properties
      const titleProp = props['제목'] || props['Name'] || props['이름']
      const title    = titleProp?.title?.[0]?.plain_text ?? ''
      const category = props['분류']?.select?.name ?? '사중'
      const date     = props['날짜']?.date?.start
        ? new Date(props['날짜'].date.start) : new Date()

      return {
        pageId: page.id,
        title,
        badge:  CATEGORY_MAP[category] ?? category,
        month:  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
        day:    String(date.getDate()).padStart(2, '0'),
      }
    }).filter(item => item.title)

    res.status(200).json(items)
  } catch (err) {
    console.error('[notices API]', err)
    res.status(200).json(null)
  }
}
