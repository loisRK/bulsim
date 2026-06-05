import { useState, useEffect } from 'react'

/**
 * Notion API 데이터를 가져오는 커스텀 훅
 * - 로딩 중엔 null 반환 (static 데이터 flash 없음)
 * - API 실패 시에만 fallback 사용
 */
export function useNotion(endpoint, fallback = null) {
  const [data,    setData]    = useState(null)   // 로딩 중엔 null
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json ?? fallback)   // API가 null 반환 시 fallback 사용
      } catch (err) {
        console.warn(`[Notion] ${endpoint} 실패, fallback 사용:`, err.message)
        setError(err.message)
        setData(fallback)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [endpoint])

  return { data, loading, error }
}
