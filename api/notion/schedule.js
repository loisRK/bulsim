/**
 * GET /api/notion/schedule?year=2026&month=6
 * 사찰일정 DB에서 해당 월 이벤트 조회
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_SCHEDULE_DB_ID
  if (!token || !dbId) return res.status(200).json([])

  const { year, month } = req.query
  const y = parseInt(year  || new Date().getFullYear())
  const m = parseInt(month || new Date().getMonth() + 1)

  // 해당 월 첫날 ~ 마지막날
  const start = `${y}-${String(m).padStart(2,'0')}-01`
  const end   = new Date(y, m, 0)  // 말일
  const endStr = `${y}-${String(m).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`

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
          filter: {
            and: [
              { property: '공개', checkbox: { equals: true } },
              { property: '날짜', date: { on_or_after: start } },
              { property: '날짜', date: { on_or_before: endStr } },
            ]
          },
          sorts: [{ property: '날짜', direction: 'ascending' }],
        }),
      }
    )

    const data  = await response.json()
    const pages = data.results ?? []

    const events = pages.map(page => {
      const props = page.properties
      const titleProp = props['Name'] || props['제목']
      return {
        id:      page.id,
        title:   titleProp?.title?.[0]?.plain_text ?? '',
        date:    props['날짜']?.date?.start ?? '',
        type:    props['분류']?.select?.name ?? '기타',
        content: props['내용']?.rich_text?.[0]?.plain_text ?? '',
      }
    })

    res.status(200).json(events)
  } catch (err) {
    console.error('[schedule API]', err)
    res.status(200).json([])
  }
}
