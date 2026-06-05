/**
 * GET /api/notion/notices
 * 공지사항 목록 — 카테고리별 그룹핑, 각 항목에 pageId 포함
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
    const groups = {}

    const CATEGORY_MAP = {
      '사중': { badge: '사중', title: '공지사항' },
      '공지': { badge: '사중', title: '공지사항' },
      '교육': { badge: '교육', title: '불교 교육' },
      '봉사': { badge: '봉사', title: '자원봉사' },
    }

    pages.forEach(page => {
      const props    = page.properties
      const titleProp = props['제목'] || props['Name'] || props['이름']
      const title    = titleProp?.title?.[0]?.plain_text ?? ''
      const category = props['분류']?.select?.name ?? '사중'
      const info     = CATEGORY_MAP[category] ?? { badge: category, title: '공지사항' }

      const date = props['날짜']?.date?.start
        ? new Date(props['날짜'].date.start) : new Date()

      const cover = page.cover
        ? page.cover.type === 'file'
          ? page.cover.file?.url
          : page.cover.external?.url
        : null

      if (!groups[category]) {
        groups[category] = { id: category, badge: info.badge, title: info.title, items: [] }
      }

      if (title) {
        groups[category].items.push({
          pageId: page.id,
          text:   title,
          date:   props['날짜']?.date?.start ?? '',
          month:  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
          day:    String(date.getDate()).padStart(2, '0'),
          badge:  info.badge,
          cover,
        })
      }
    })

    res.status(200).json(Object.values(groups))
  } catch (err) {
    console.error('[notices API]', err)
    res.status(200).json(null)
  }
}
