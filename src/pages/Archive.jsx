import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import Icon from '../components/Icon'
import { useNotion } from '../hooks/useNotion'

const PAGE_SIZE  = 10
const PAGE_GROUP = 5

const BADGE_COLOR = {
  '법문': 'var(--red)',
  '사진': '#1a56db',
  '영상': '#2e7d32',
  '문서': 'var(--gray)',
}

export default function Archive() {
  const { data, loading } = useNotion('/api/notion/archive', null)
  const navigate = useNavigate()

  const [query,        setQuery]       = useState('')
  const [selectedTag,  setSelectedTag] = useState('전체')
  const [currentPage,  setCurrentPage] = useState(1)

  const allItems = data || []

  // 태그 목록 (데이터에서 동적으로 추출)
  const tags = useMemo(() => {
    const set = new Set(allItems.map(item => item.badge).filter(Boolean))
    return ['전체', ...Array.from(set)]
  }, [allItems])

  // 태그 + 검색 필터
  const filtered = useMemo(() => {
    let items = allItems
    if (selectedTag !== '전체') {
      items = items.filter(item => item.badge === selectedTag)
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      items = items.filter(item => item.title.toLowerCase().includes(q))
    }
    return items
  }, [allItems, selectedTag, query])

  const handleSearch = e => { setQuery(e.target.value); setCurrentPage(1) }

  const handleTagSelect = tag => {
    setSelectedTag(tag)
    setCurrentPage(1)
    setQuery('')
  }

  // 페이지네이션
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page        = Math.min(currentPage, totalPages)
  const pageItems   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groupStart  = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1
  const groupEnd    = Math.min(groupStart + PAGE_GROUP - 1, totalPages)
  const pageNumbers = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i)

  const goToDetail = item => {
    navigate(`/archive/${item.pageId}`, {
      state: { item: { id: item.pageId, title: item.title, badge: item.badge, month: item.month, day: item.day, desc: item.desc } }
    })
  }

  return (
    <>
      <PageBanner title="자료실" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner board-layout-outer">
          <div className="board-layout">

            {/* 좌측 태그 사이드바 */}
            <aside className="board-sidebar">
              <div className="board-sidebar-title">자료실</div>
              <ul className="board-tag-nav">
                {tags.map(tag => (
                  <li
                    key={tag}
                    className={`board-tag-item${selectedTag === tag ? ' active' : ''}`}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {selectedTag === tag && <span className="board-tag-dot">•</span>}
                    {tag}
                  </li>
                ))}
              </ul>
            </aside>

            {/* 우측 게시판 */}
            <div className="board-main">

              {/* 제목 + 검색창 */}
              <div className="board-top-row">
                <h2 className="board-heading">
                  자료실
                  {selectedTag !== '전체' && (
                    <> <span className="board-heading-sep">—</span> <span className="board-heading-tag">{selectedTag}</span></>
                  )}
                </h2>
                <div className="notice-search-bar board-search-bar">
                  <span className="notice-search-icon"><Icon name="search" size="sm" /></span>
                  <input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    value={query}
                    onChange={handleSearch}
                    className="notice-search-input"
                  />
                  {query && (
                    <button type="button" className="notice-search-clear" onClick={() => { setQuery(''); setCurrentPage(1) }} aria-label="검색어 지우기">
                      <Icon name="close" size="sm" />
                    </button>
                  )}
                </div>
              </div>

              {query && (
                <p className="notice-search-result">
                  <strong>"{query}"</strong> 검색 결과 {filtered.length}건
                </p>
              )}

              {loading ? (
                <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>불러오는 중...</p>
              ) : (
                <>
                  <div className="notice-board">
                    {pageItems.length === 0 ? (
                      <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
                        {query ? '검색 결과가 없습니다.' : '등록된 자료가 없습니다.'}
                      </p>
                    ) : (
                      pageItems.map((item, i) => (
                        <div key={i} className="notice-board-row" onClick={() => goToDetail(item)}>
                          <span className="notice-board-title-wrap">
                            <span
                              className="notice-board-badge"
                              style={{ background: BADGE_COLOR[item.badge] || 'var(--gray)' }}
                            >
                              {item.badge}
                            </span>
                            <span className="notice-board-text">
                              {query ? highlightText(item.title, query) : item.title}
                            </span>
                          </span>
                          <span className="notice-board-date">{item.month}.{item.day}</span>
                          <span className="notice-board-arrow">›</span>
                        </div>
                      ))
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="paginator">
                      {groupStart > 1 && (
                        <button className="page-btn" onClick={() => setCurrentPage(groupStart - 1)}>‹</button>
                      )}
                      {pageNumbers.map(n => (
                        <button key={n} className={`page-btn${n === page ? ' active' : ''}`} onClick={() => setCurrentPage(n)}>
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
          </div>
        </div>
      </section>
    </>
  )
}

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
