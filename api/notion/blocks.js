/**
 * GET /api/notion/blocks?pageId=xxx
 * 노션 페이지 본문 블록 조회
 * - paragraph, heading, image, bulleted/numbered list 지원
 * - 이미지 URL은 요청마다 새로 발급 (Notion 이미지는 1시간 만료)
 */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const token  = process.env.NOTION_TOKEN
  const pageId = req.query.pageId
  if (!token || !pageId) return res.status(400).json({ error: 'pageId 필요' })

  try {
    const response = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
      {
        headers: {
          'Authorization':  `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
        },
      }
    )

    const data   = await response.json()
    const blocks = data.results ?? []

    // 렌더링에 필요한 정보만 추출
    const parsed = blocks.map(block => {
      const type = block.type
      const b    = block[type]

      // 리치 텍스트 → plain text 변환
      const richToText = (arr = []) => arr.map(r => r.plain_text).join('')

      switch (type) {
        case 'paragraph':
          return { type: 'paragraph', text: richToText(b.rich_text) }

        case 'heading_1':
          return { type: 'heading_1', text: richToText(b.rich_text) }

        case 'heading_2':
          return { type: 'heading_2', text: richToText(b.rich_text) }

        case 'heading_3':
          return { type: 'heading_3', text: richToText(b.rich_text) }

        case 'bulleted_list_item':
          return { type: 'bullet', text: richToText(b.rich_text) }

        case 'numbered_list_item':
          return { type: 'number', text: richToText(b.rich_text) }

        case 'image': {
          const url = b.type === 'external' ? b.external?.url : b.file?.url
          const caption = richToText(b.caption)
          return { type: 'image', url, caption }
        }

        case 'divider':
          return { type: 'divider' }

        case 'quote':
          return { type: 'quote', text: richToText(b.rich_text) }

        default:
          return null
      }
    }).filter(Boolean)

    res.status(200).json(parsed)
  } catch (err) {
    console.error('[blocks API]', err)
    res.status(500).json({ error: err.message })
  }
}
