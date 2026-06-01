/**
 * GET /api/notion/notices
 * 공지사항 목록 조회 — 분류별로 그룹핑하여 반환
 *
 * Notion DB 필수 속성:
 *   제목(Title), 내용(Text), 분류(Select: 사중/교육/봉사), 날짜(Date), 공개(Checkbox)
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' })

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
          page_size: 20,
        }),
      }
    )

    const data   = await response.json()
    const pages  = data.results ?? []

    // 분류별 그룹핑
    const groups = {}
    const BADGE_MAP = { '사중': '사중', '교육': '교육', '봉사': '봉사' }

    pages.forEach(page => {
      const props    = page.properties
      const title    = props['제목']?.title?.[0]?.plain_text ?? ''
      const category = props['분류']?.select?.name ?? '사중'

      if (!groups[category]) {
        groups[category] = {
          id:    category,
          badge: BADGE_MAP[category] ?? category,
          title: category === '사중' ? '공지사항' : category === '교육' ? '불교 교육' : '자원봉사',
          items: [],
        }
      }
      groups[category].items.push({ text: title })
    })

    res.status(200).json(Object.values(groups))
  } catch (err) {
    console.error('[notices API]', err)
    res.status(200).json(null)
  }
}
