/**
 * GET /api/notion/news
 * 사찰 소식 목록 조회
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
          page_size: 10,
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
      return {
        day:   String(date.getDate()).padStart(2, '0'),
        month: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`,
        title: (props['제목'] || props['Name'] || props['이름'])?.title?.[0]?.plain_text ?? '',
        desc:  props['내용']?.rich_text?.[0]?.plain_text ?? '',
      }
    })

    res.status(200).json(news)
  } catch (err) {
    console.error('[news API]', err)
    res.status(200).json(null)
  }
}
