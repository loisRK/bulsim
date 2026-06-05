/**
 * GET /api/notion/dharma
 * 오늘의 법문 조회 — Notion DB에서 가장 최근 공개 항목 반환
 *
 * Notion DB 필수 속성:
 *   제목(Title), 내용(Text), 날짜(Date), 공개(Checkbox)
 */
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_DHARMA_DB_ID

  // 환경변수 미설정 시 디버그 정보 반환 (확인 후 null로 되돌릴 것)
  if (!token || !dbId) {
    return res.status(200).json({
      debug: true,
      hasToken: !!token,
      hasDbId: !!dbId,
      tokenPrefix: token ? token.substring(0, 10) + '...' : 'missing',
    })
  }

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
          page_size: 1,
        }),
      }
    )

    const data = await response.json()
    const page = data.results?.[0]
    if (!page) return res.status(200).json(null)

    const props = page.properties
    res.status(200).json({
      text:   props['내용']?.rich_text?.[0]?.plain_text ?? '',
      source: '— 주지스님 법문 중에서',
      date:   props['날짜']?.date?.start
        ? new Date(props['날짜'].date.start).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
        : '',
    })
  } catch (err) {
    console.error('[dharma API]', err)
    res.status(200).json({ debug: true, error: err.message })
  }
}
