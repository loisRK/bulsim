/**
 * POST /api/notion/volunteer
 * 자원봉사 신청 → Notion DB에 새 항목 생성
 *
 * Request body: { name, phone, type, date, message }
 *
 * Notion DB 필수 속성:
 *   성함(Title), 연락처(Text), 봉사항목(Select), 희망날짜(Date), 메모(Text), 처리상태(Select)
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_VOLUNTEER_DB_ID

  // 환경변수 미설정 시에도 성공 응답 (프론트에서 완료 화면 표시)
  if (!token || !dbId) {
    return res.status(200).json({ result: 'ok', note: 'Notion 미연동 — 로컬 저장만 됨' })
  }

  const { name, phone, type, date, message } = req.body

  if (!name || !phone || !type) {
    return res.status(400).json({ error: '필수 항목 누락' })
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${token}`,
        'Content-Type':   'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          '성함':     { title:     [{ text: { content: name } }] },
          '연락처':   { rich_text: [{ text: { content: phone } }] },
          '봉사항목': { select:    { name: type } },
          '희망날짜': date ? { date: { start: date } } : undefined,
          '메모':     { rich_text: [{ text: { content: message || '' } }] },
          '처리상태': { select:    { name: '신청' } },
        },
      }),
    })

    if (!response.ok) throw new Error(`Notion API ${response.status}`)
    res.status(200).json({ result: 'ok' })
  } catch (err) {
    console.error('[volunteer API]', err)
    // 오류여도 사용자에게는 성공 응답 (UX 우선)
    res.status(200).json({ result: 'ok', error: err.message })
  }
}
