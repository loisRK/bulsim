/**
 * GET /api/notion/notices
 * 공지사항 목록 조회
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
          page_size: 20,
        }),
      }
    )

    const data  = await response.json()
    const pages = data.results ?? []
    const groups = {}

    // 카테고리 → 표시 정보 매핑 (노션에서 어떤 값으로 입력해도 동작하도록 유연하게 처리)
    const CATEGORY_MAP = {
      '사중': { badge: '사중', title: '공지사항' },
      '공지': { badge: '사중', title: '공지사항' },  // "공지"도 허용
      '교육': { badge: '교육', title: '불교 교육' },
      '봉사': { badge: '봉사', title: '자원봉사' },
    }

    pages.forEach(page => {
      const props = page.properties

      // 제목: "제목" 또는 "Name" 컬럼 모두 지원
      const titleProp = props['제목'] || props['Name'] || props['이름']
      const title = titleProp?.title?.[0]?.plain_text ?? ''

      const category = props['분류']?.select?.name ?? '사중'
      const info = CATEGORY_MAP[category] ?? { badge: category, title: '공지사항' }

      if (!groups[category]) {
        groups[category] = {
          id:    category,
          badge: info.badge,
          title: info.title,
          items: [],
        }
      }
      if (title) groups[category].items.push({ text: title })
    })

    res.status(200).json(Object.values(groups))
  } catch (err) {
    console.error('[notices API]', err)
    res.status(200).json(null)
  }
}
