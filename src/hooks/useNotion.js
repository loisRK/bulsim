import { useState, useEffect } from 'react'

/**
 * Notion API 데이터를 가져오는 커스텀 훅
 * - API 호출 실패 시 fallback 데이터 사용
 * - loading / error 상태 제공
 *
 * 사용 예시:
 *   const { data, loading } = useNotion('/api/notion/dharma', fallbackData)
 */
export function useNotion(endpoint, fallback = null) {
  const [data,    setData]    = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.warn(`[Notion] ${endpoint} 실패, fallback 사용:`, err.message)
        setError(err.message)
        // fallback은 초기값으로 이미 세팅됨
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [endpoint])

  return { data, loading, error }
}
