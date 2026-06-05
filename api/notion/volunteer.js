/**
 * POST /api/notion/volunteer
 * 자원봉사 신청 저장
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_VOLUNTEER_DB_ID

  if (!token || !dbId) {
    return res.status(200).json({ result: 'ok', note: 'Notion 미연동' })
  }

  const { name, phone, type, date, message } = req.body

  if (!name || !phone || !type) {
    return res.status(400).json({ error: '필수 항목 누락' })
  }

  try {
    const now = new Date().toISOString()

    // undefined 프로퍼티 제외
    const properties = {
      '성함':     { title:     [{ text: { content: name } }] },
      '연락처':   { rich_text: [{ text: { content: phone } }] },
      '봉사항목': { select:    { name: type } },
      '메모':     { rich_text: [{ text: { content: message || '' } }] },
      '처리상태': { select:    { name: '신청' } },
      '신청일시': { date:      { start: now } },
    }
    if (date) properties['희망날짜'] = { date: { start: date } }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${token}`,
        'Content-Type':   'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ parent: { database_id: dbId }, properties }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(`Notion API ${response.status}: ${errBody.message ?? ''}`)
    }
    res.status(200).json({ result: 'ok' })
  } catch (err) {
    console.error('[volunteer API]', err)
    res.status(500).json({ error: err.message })
  }
}
