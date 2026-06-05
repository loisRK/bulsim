import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import { useNotion } from '../hooks/useNotion'

const PAGE_SIZE   = 10  // 페이지당 항목 수
const PAGE_GROUP  = 5   // 네비게이터 단위

export default function Notice() {
  const { data: notices, loading } = useNotion('/api/notion/notices', null)
  const navigate = useNavigate()

  const list    = notices || []
  const [activeTab, setActiveTab]   = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const activeId   = activeTab || list[0]?.id
  const activeGroup = list.find(n => n.id === activeId)
  const items      = activeGroup?.items ?? []

  // 페이지네이션 계산
  const totalPages  = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const page        = Math.min(currentPage, totalPages)
  const pageItems   = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // 페이지 그룹 (5단위)
  const groupStart  = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1
  const groupEnd    = Math.min(groupStart + PAGE_GROUP - 1, totalPages)
  const pageNumbers = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i)

  const goToDetail = item => {
    navigate(`/notice/${item.pageId}`, {
      state: {
        item: {
          id:    item.pageId,
          title: item.text,
          desc:  '',
          badge: item.badge,
          month: item.month,
          day:   item.day,
        }
      }
    })
  }

  const changeTab = id => {
    setActiveTab(id)
    setCurrentPage(1)
  }

  return (
    <>
      <PageBanner title="공지사항" breadcrumb="사찰 소식" />
      <section className="section">
        <div className="section-inner" style={{ maxWidth: 900 }}>

          {loading && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              불러오는 중...
            </p>
          )}

          {!loading && list.length === 0 && (
            <p style={{ color: 'var(--gray)', padding: '40px 0', textAlign: 'center' }}>
              등록된 공지사항이 없습니다.
            </p>
          )}

          {!loading && list.length > 0 && (
            <>
              {/* 탭 */}
              <div className="notice-tabs">
                {list.map(n => (
                  <div
                    key={n.id}
                    className={`notice-tab${activeId === n.id ? ' active' : ''}`}
                    onClick={() => changeTab(n.id)}
                  >
                    {n.title}
                  </div>
                ))}
              </div>

              {/* 공지 목록 */}
              <div className="notice-board">
                {pageItems.length === 0 ? (
                  <p style={{ color: 'var(--gray)', padding: '30px 0', textAlign: 'center' }}>
                    등록된 글이 없습니다.
                  </p>
                ) : (
                  pageItems.map((item, i) => (
                    <div
                      key={i}
                      className="notice-board-row"
                      onClick={() => goToDetail(item)}
                    >
                      <span className="notice-board-badge">{item.badge}</span>
                      <span className="notice-board-text">{item.text}</span>
                      <span className="notice-board-date">{item.month}</span>
                      <span className="notice-board-arrow">›</span>
                    </div>
                  ))
                )}
              </div>

              {/* 페이지네이터 */}
              {totalPages > 1 && (
                <div className="paginator">
                  {/* 이전 그룹 */}
                  {groupStart > 1 && (
                    <button className="page-btn" onClick={() => setCurrentPage(groupStart - 1)}>
                      ‹
                    </button>
                  )}

                  {/* 페이지 번호 */}
                  {pageNumbers.map(n => (
                    <button
                      key={n}
                      className={`page-btn${n === page ? ' active' : ''}`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  ))}

                  {/* 다음 그룹 */}
                  {groupEnd < totalPages && (
                    <button className="page-btn" onClick={() => setCurrentPage(groupEnd + 1)}>
                      ›
                    </button>
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
