/**
 * notion-setup.js
 * Notion 데이터베이스에 필요한 컬럼(속성)을 자동으로 생성합니다.
 *
 * 실행 방법:
 *   1. 루트에 .env 파일 생성 후 토큰·DB ID 입력
 *   2. node scripts/notion-setup.js
 */

import 'dotenv/config'

const TOKEN = process.env.NOTION_TOKEN
const DBS = {
  dharma:    process.env.NOTION_DHARMA_DB_ID,
  notices:   process.env.NOTION_NOTICES_DB_ID,
  news:      process.env.NOTION_NEWS_DB_ID,
  volunteer: process.env.NOTION_VOLUNTEER_DB_ID,
}

// ── 각 DB에 생성할 속성 정의 ──────────────────────────
const SCHEMAS = {

  // 오늘의법문 DB
  dharma: {
    '내용':  { rich_text: {} },
    '날짜':  { date: {} },
    '공개':  { checkbox: {} },
  },

  // 공지사항 DB
  notices: {
    '내용':  { rich_text: {} },
    '분류':  { select: { options: [
      { name: '사중', color: 'red' },
      { name: '교육', color: 'blue' },
      { name: '봉사', color: 'green' },
    ]}},
    '날짜':  { date: {} },
    '공개':  { checkbox: {} },
  },

  // 사찰소식 DB
  news: {
    '내용':   { rich_text: {} },
    '본문':   { rich_text: {} },
    '사진URL': { url: {} },
    '날짜':   { date: {} },
    '공개':   { checkbox: {} },
  },

  // 자원봉사신청 DB
  volunteer: {
    '연락처':   { rich_text: {} },
    '봉사항목': { select: { options: [
      { name: '공양간 봉사', color: 'yellow' },
      { name: '도량 청소',  color: 'green' },
      { name: '법회 준비',  color: 'blue' },
      { name: '행사 봉사',  color: 'purple' },
      { name: '이웃 돕기',  color: 'orange' },
      { name: '기타',       color: 'gray' },
    ]}},
    '희망날짜': { date: {} },
    '메모':     { rich_text: {} },
    '처리상태': { select: { options: [
      { name: '신청', color: 'yellow' },
      { name: '확인', color: 'blue' },
      { name: '완료', color: 'green' },
    ]}},
  },
}

// ── 실행 ─────────────────────────────────────────────
async function updateDB(name, dbId, properties) {
  if (!dbId) {
    console.warn(`⚠️  ${name} DB ID가 .env에 없습니다. 건너뜁니다.`)
    return
  }

  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
    method: 'PATCH',
    headers: {
      'Authorization':  `Bearer ${TOKEN}`,
      'Content-Type':   'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ properties }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error(`❌ ${name} 실패:`, data.message)
  } else {
    const cols = Object.keys(properties).join(', ')
    console.log(`✅ ${name} — 컬럼 생성 완료: ${cols}`)
  }
}

async function main() {
  console.log('\n🪷 불심정사 Notion 데이터베이스 설정 시작\n')

  if (!TOKEN) {
    console.error('❌ NOTION_TOKEN이 .env에 없습니다.')
    process.exit(1)
  }

  await updateDB('오늘의법문',   DBS.dharma,    SCHEMAS.dharma)
  await updateDB('공지사항',     DBS.notices,   SCHEMAS.notices)
  await updateDB('사찰소식',     DBS.news,      SCHEMAS.news)
  await updateDB('자원봉사신청', DBS.volunteer, SCHEMAS.volunteer)

  console.log('\n✨ 설정 완료! Notion에서 컬럼을 확인하세요.\n')
}

main().catch(console.error)
