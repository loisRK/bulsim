# 거마산 불심정사 홈페이지 아키텍처

## 개요

| 항목 | 내용 |
|------|------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Vercel Serverless Functions (Node.js) |
| CMS | Notion API (스님이 노션에서 직접 작성) |
| 호스팅 | Vercel (무료) |
| 비용 | **월 0원** |

---

## 전체 흐름

```
스님 (Notion 작성)
       │
       ▼
  Notion Database
  ┌─────────────────┐
  │ 오늘의 법문      │
  │ 공지사항         │
  │ 사찰 소식        │
  │ 자원봉사 신청    │
  └─────────────────┘
       │  Notion API
       ▼
  Vercel Serverless Functions  (/api/notion/*)
  - NOTION_TOKEN 보안 보관
  - CORS 처리
  - 데이터 정제
       │
       ▼
  React Frontend (Vite 빌드)
  - 페이지 라우팅
  - 컴포넌트 렌더
  - Notion 미연동 시 staticData fallback
       │
       ▼
  신도 브라우저 (PC / 모바일)
```

---

## 디렉토리 구조

```
bulsim/
├── public/
│   └── photo/                  ← 사찰 사진 (기존 photo/ 폴더 이동)
│
├── src/                        ← React 프론트엔드
│   ├── main.jsx                  앱 진입점
│   ├── App.jsx                   라우터 설정
│   ├── data/
│   │   └── staticData.js         Notion 미연동 시 fallback 데이터
│   ├── hooks/
│   │   └── useNotion.js          Notion API 호출 커스텀 훅
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSlider.jsx
│   │   ├── QuickLinks.jsx
│   │   ├── DharmaCard.jsx        오늘의 법문
│   │   ├── NoticeBoard.jsx       공지사항
│   │   ├── NewsSection.jsx       사찰 소식
│   │   └── PageBanner.jsx        하위 페이지 상단 배너
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Notice.jsx
│   │   ├── Schedule.jsx
│   │   ├── News.jsx
│   │   ├── Education.jsx
│   │   ├── Events.jsx
│   │   └── Volunteer.jsx
│   └── styles/
│       └── global.css
│
├── api/                        ← Vercel Serverless Functions
│   └── notion/
│       ├── dharma.js             GET  /api/notion/dharma
│       ├── notices.js            GET  /api/notion/notices
│       ├── news.js               GET  /api/notion/news
│       └── volunteer.js          POST /api/notion/volunteer
│
├── index.html                  ← Vite HTML 진입점
├── vite.config.js
├── vercel.json                 ← 배포 설정 (SPA 라우팅 + API)
├── package.json
├── .env.example                ← 환경변수 예시
└── ARCHITECTURE.md             ← 이 파일
```

---

## Frontend 상세

### 기술 스택
- **React 18** — UI 컴포넌트
- **Vite** — 빌드 도구 (빠른 개발 서버, 번들링)
- **React Router v6** — 클라이언트 사이드 라우팅

### 라우팅 구조
| URL | 페이지 | 설명 |
|-----|--------|------|
| `/` | Home | 메인 홈 |
| `/about` | About | 불심정사 소개 |
| `/notice` | Notice | 공지사항 |
| `/schedule` | Schedule | 법회 일정 |
| `/news` | News | 사찰 소식 |
| `/education` | Education | 불교 교육 |
| `/events` | Events | 주요 행사 |
| `/volunteer` | Volunteer | 자원봉사 신청 |

### Notion Fallback 전략
- Notion API 미설정 또는 오류 시 `src/data/staticData.js`의 데이터 자동 사용
- 단계적 도입 가능: Notion 없이도 사이트 작동

---

## Backend (Serverless) 상세

### API 엔드포인트

| Method | 경로 | 설명 | Notion DB |
|--------|------|------|-----------|
| GET | `/api/notion/dharma` | 오늘의 법문 조회 | 오늘의법문 DB |
| GET | `/api/notion/notices` | 공지사항 목록 | 공지사항 DB |
| GET | `/api/notion/news` | 사찰 소식 목록 | 사찰소식 DB |
| POST | `/api/notion/volunteer` | 자원봉사 신청 저장 | 자원봉사신청 DB |

### Vercel Serverless 선택 이유
- 별도 서버 불필요, 비용 0원
- `NOTION_TOKEN` 등 민감한 키를 서버에서만 사용 (브라우저 노출 없음)
- React 빌드 결과물과 동일 프로젝트에서 관리

---

## Notion CMS 설정

### 1. Notion Integration 생성
1. https://www.notion.so/my-integrations 접속
2. "New integration" 클릭
3. 이름: `불심정사 홈페이지`
4. 생성된 `Internal Integration Token` 복사 → `.env`의 `NOTION_TOKEN`에 저장

### 2. 데이터베이스 생성 및 공유

**오늘의법문 DB**
| 속성명 | 타입 | 설명 |
|--------|------|------|
| 제목 | Title | 법문 제목 |
| 내용 | Text | 법문 본문 |
| 날짜 | Date | 작성 날짜 |
| 공개 | Checkbox | ✅ 체크 시 홈페이지 표시 |

**공지사항 DB**
| 속성명 | 타입 | 설명 |
|--------|------|------|
| 제목 | Title | 공지 제목 |
| 내용 | Text | 공지 내용 |
| 분류 | Select | 사중 / 교육 / 봉사 |
| 날짜 | Date | 작성 날짜 |
| 공개 | Checkbox | ✅ 체크 시 홈페이지 표시 |

**사찰소식 DB**
| 속성명 | 타입 | 설명 |
|--------|------|------|
| 제목 | Title | 소식 제목 |
| 내용 | Text | 소식 본문 |
| 날짜 | Date | 작성 날짜 |
| 공개 | Checkbox | ✅ 체크 시 홈페이지 표시 |

**자원봉사신청 DB** (신도 신청 내용 수신)
| 속성명 | 타입 | 설명 |
|--------|------|------|
| 성함 | Title | 신청자 이름 |
| 연락처 | Text | 전화번호 |
| 봉사항목 | Select | 공양간/청소/법회준비 등 |
| 희망날짜 | Date | 봉사 희망일 |
| 메모 | Text | 남기실 말씀 |
| 처리상태 | Select | 신청 / 확인 / 완료 |

각 DB → 우측 상단 `...` → `Add connections` → `불심정사 홈페이지` 선택

### 3. DB ID 확인 방법
노션 데이터베이스 URL: `https://notion.so/[DB_ID]?v=...`
URL에서 `?` 앞 32자리 문자열이 DB ID

---

## 환경변수 (.env)

```
NOTION_TOKEN=secret_xxxxxxxxxxxx       # Notion Integration Token
NOTION_DHARMA_DB_ID=xxxx...            # 오늘의법문 DB ID
NOTION_NOTICES_DB_ID=xxxx...           # 공지사항 DB ID
NOTION_NEWS_DB_ID=xxxx...              # 사찰소식 DB ID
NOTION_VOLUNTEER_DB_ID=xxxx...         # 자원봉사신청 DB ID
```

---

## 배포 방법 (Vercel)

```bash
# 1. GitHub에 코드 push
git init && git add . && git commit -m "init"
git remote add origin https://github.com/[계정]/bulsim.git
git push -u origin main

# 2. Vercel 접속 → Import Project → GitHub 연결
# 3. Environment Variables에 .env 내용 입력
# 4. Deploy 클릭 → https://bulsim.vercel.app 자동 생성

# 이후 코드 수정 후 git push하면 자동 재배포
```

---

## 스님 사용 가이드 (Notion으로 홈페이지 관리)

### 오늘의 법문 올리기
1. 노션 앱 열기
2. `오늘의법문` 데이터베이스 접속
3. `+ New` 클릭 → 제목·내용·날짜 입력
4. `공개` 체크박스 ✅ 체크
5. 홈페이지 새로고침 → 법문 자동 반영

### 공지사항 올리기
1. `공지사항` 데이터베이스에서 `+ New`
2. 제목·내용·분류 선택·날짜 입력
3. `공개` ✅ 체크

### 자원봉사 신청 확인
1. `자원봉사신청` 데이터베이스 접속
2. 신청 목록 확인 (날짜·이름·연락처·항목)
3. 확인 완료 시 `처리상태` → `확인` 또는 `완료` 변경
