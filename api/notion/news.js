/**
 * GET /api/notion/news
 * 사찰 소식 목록 조회
 *
 * Notion DB 속성:
 *   제목(Title), 내용(Text, 짧은 요약), 본문(Text, 전체 내용),
 *   사진URL(URL), 날짜(Date), 공개(Checkbox)
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token = process.env.NOTION_TOKEN
  const dbId  = process.env.NOTION_NEWS_DB_ID

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

    const news = pages.map(page => {
      const props = page.properties
      const date  = props['날짜']?.date?.start
        ? new Date(props['날짜'].date.start)
        : new Date()

      // 제목: "제목" 또는 "Name" 모두 지원
      const titleProp = props['제목'] || props['Name'] || props['이름']

      return {
        id:     page.id,
        day:    String(date.getDate()).padStart(2, '0'),
        month:  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
        title:  titleProp?.title?.[0]?.plain_text ?? '',
        desc:   props['내용']?.rich_text?.[0]?.plain_text ?? '',
        body:   props['본문']?.rich_text?.map(r => r.plain_text).join('') ?? '',
        photo:  props['사진URL']?.url ?? null,
      }
    })

    res.status(200).json(news)
  } catch (err) {
    console.error('[news API]', err)
    res.status(200).json(null)
  }
}
