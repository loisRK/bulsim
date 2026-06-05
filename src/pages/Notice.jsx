import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'

const PAGE_SIZE  = 10
const PAGE_GROUP = 5

export default function Notice() {
  const { data, loading } = useNotion('/api/notion/notices', null)
  const navigate = useNavigate()

  const [query,       setQuery]       = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const allItems = data || []

  // 검색 필터 (제목 기준)
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems
    const q = query.trim().toLowerCase()
    return allItems.filter(item => item.title.toLowerCase().includes(q))
  }, [allItems, query])

  // 검색어 변경 시 첫 페이지로
  const handleSearch = e => {
    setQuery(e.target.value)
    setCurrentPage(1)
  }

  // 페이지네이션
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page        = Math.min(currentPage, totalPages)
  const pageItems   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groupStart  = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1
  const groupEnd    = Math.min(groupStart + PAGE_GROUP - 1, totalPages)
  const pageNumbers = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i)

  const goToDetail = item => {
    navigate(`/notice/${item.pageId}`, {
      state: {
        item: {
          id:    item.pageId,
          title: item.title,
          badge: item.badge,
          month: item.month,
          day:   item.day,
        }
      }
    })
  }

  return (
    <>
      <PageBanner title="공지사항" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 860 }}>

          {/* 검색창 */}
          <div className="notice-search-bar">
            <span className="notice-search-icon">🔍</span>
            <input
              type="text"
              placeholder="공지사항 검색..."
              value={query}
              onChange={handleSearch}
              className="notice-search-input"
            />
            {query && (
              <button className="notice-search-clear" onClick={() => { setQuery(''); setCurrentPage(1) }}>
                ✕
              </button>
            )}
          </div>

          {/* 검색 결과 수 */}
          {query && (
            <p className="notice-search-result">
              <strong>"{query}"</strong> 검색 결과 {filtered.length}건
            </p>
          )}

          {/* 게시판 */}
          {loading ? (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>불러오는 중...</p>
          ) : (
            <>
              <div className="notice-board">
                <div className="notice-board-header">
                  <span>분류</span>
                  <span>제목</span>
                  <span>날짜</span>
                </div>

                {pageItems.length === 0 ? (
                  <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
                    {query ? '검색 결과가 없습니다.' : '등록된 공지가 없습니다.'}
                  </p>
                ) : (
                  pageItems.map((item, i) => (
                    <div key={i} className="notice-board-row" onClick={() => goToDetail(item)}>
                      <span className={`notice-board-badge badge-${item.badge}`}>{item.badge}</span>
                      <span className="notice-board-text">
                        {query
                          ? highlightText(item.title, query)
                          : item.title
                        }
                      </span>
                      <span className="notice-board-date">{item.month}</span>
                      <span className="notice-board-arrow">›</span>
                    </div>
                  ))
                )}
              </div>

              {/* 페이지네이터 */}
              {totalPages > 1 && (
                <div className="paginator">
                  {groupStart > 1 && (
                    <button className="page-btn" onClick={() => setCurrentPage(groupStart - 1)}>‹</button>
                  )}
                  {pageNumbers.map(n => (
                    <button
                      key={n}
                      className={`page-btn${n === page ? ' active' : ''}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  {groupEnd < totalPages && (
                    <button className="page-btn" onClick={() => setCurrentPage(groupEnd + 1)}>›</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

// 검색어 하이라이트
function highlightText(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: '#fff3cd', color: 'var(--dark)', borderRadius: 2 }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}
