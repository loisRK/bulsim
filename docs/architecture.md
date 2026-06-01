# 불심정사 홈페이지 아키텍처

## 한 줄 요약

> **"React로 화면을 만들고, Notion으로 내용을 관리하고, Vercel로 인터넷에 올린다"**

---

## 전체 구조

```
[스님 - Notion 앱에서 글 작성]
           │
           ▼
    ┌─────────────┐
    │   Notion    │  ← 데이터베이스 (CMS 역할)
    │  Database   │    법문 / 공지 / 소식 / 봉사신청
    └─────────────┘
           │  Notion API
           ▼
    ┌─────────────┐
    │   Vercel    │  ← 배포 플랫폼
    │  Serverless │    /api/notion/* 함수 실행
    │  Functions  │    NOTION_TOKEN 안전하게 보관
    └─────────────┘
           │  JSON 응답
           ▼
    ┌─────────────┐
    │    React    │  ← 우리가 작성한 프론트엔드
    │  Frontend   │    화면 렌더링 / 페이지 라우팅
    └─────────────┘
           │
           ▼
    [신도 브라우저 - PC / 모바일]
```

---

## 각 역할 상세

### Frontend — React (우리가 작성한 코드)

| 항목 | 내용 |
|------|------|
| 역할 | 화면 구성, 페이지 이동, 데이터 표시 |
| 기술 | React 18, Vite, React Router v6 |
| 위치 | `src/` 디렉토리 |
| 수정 | 디자인·레이아웃·메뉴 변경 시 이 코드를 수정 |

React는 사용자가 보는 **화면만** 담당한다.
데이터를 직접 저장하거나 관리하지 않는다.

---

### Backend — Notion (데이터 저장·관리)

| 항목 | 내용 |
|------|------|
| 역할 | 콘텐츠 작성·저장·관리 (CMS) |
| 기술 | Notion Database + Notion API |
| 사용자 | 스님이 노션 앱에서 직접 작성 |
| 비용 | 무료 |

Notion이 **데이터베이스 서버** 역할을 한다.
별도 서버를 구축하거나 운영할 필요가 없다.

**Notion에서 관리하는 데이터:**
- 오늘의 법문
- 공지사항
- 사찰 소식
- 자원봉사 신청 내역

---

### API 중간 다리 — Vercel Serverless Functions

| 항목 | 내용 |
|------|------|
| 역할 | React ↔ Notion 사이의 중간 연결 |
| 기술 | Vercel Serverless Functions (Node.js) |
| 위치 | `api/notion/` 디렉토리 |
| 비용 | 무료 (Vercel 무료 플랜 포함) |

**왜 중간 다리가 필요한가?**

```
❌ React에서 Notion을 직접 호출하면
   → NOTION_TOKEN(비밀키)이 브라우저에 노출됨
   → 누구나 토큰을 볼 수 있어 보안 위험

✅ Vercel Functions를 거치면
   → 토큰은 서버에만 보관
   → 브라우저는 토큰을 볼 수 없음
```

**API 목록:**

| 주소 | 방식 | 역할 |
|------|------|------|
| `/api/notion/dharma` | GET | 오늘의 법문 조회 |
| `/api/notion/notices` | GET | 공지사항 조회 |
| `/api/notion/news` | GET | 사찰 소식 조회 |
| `/api/notion/volunteer` | POST | 자원봉사 신청 저장 |

---

### 배포 플랫폼 — Vercel

| 항목 | 내용 |
|------|------|
| 역할 | 코드를 인터넷 주소로 서비스 |
| 제공 | React 호스팅 + Serverless API 실행 |
| 주소 | `https://bulsim.vercel.app` (자동 생성) |
| 자동 배포 | GitHub push → 자동으로 최신 버전 반영 |
| 비용 | 무료 |

Vercel 하나로 **프론트엔드 호스팅**과 **API 서버** 역할을 동시에 한다.

---

## 데이터 흐름 예시

### 스님이 법문을 올리는 경우

```
1. 스님이 노션 앱 열기
2. "오늘의법문" 데이터베이스에 글 작성
3. "공개" 체크박스 ✅ 체크
        ↓
4. 신도가 홈페이지 접속
5. React → /api/notion/dharma 호출
6. Vercel 함수 → Notion API 호출
7. Notion → 최신 법문 데이터 반환
8. React → 화면에 법문 표시
```

### 신도가 자원봉사를 신청하는 경우

```
1. 신도가 홈페이지 자원봉사 신청 폼 작성
2. React → /api/notion/volunteer 에 POST
3. Vercel 함수 → Notion "자원봉사신청" DB에 새 항목 생성
4. 스님이 노션에서 신청 내역 확인
```

---

## Notion 미연동 시 동작 (Fallback)

Notion을 아직 연결하지 않아도 사이트는 정상 작동한다.
`src/data/staticData.js`에 저장된 기본 데이터를 자동으로 사용한다.

```
Notion API 호출 성공 → Notion 데이터 표시
Notion API 호출 실패 → staticData.js 기본 데이터 표시
```

단계적으로 도입할 수 있다.

---

## 파일 구조 요약

```
bulsim/
├── src/                    ← [Frontend] React 코드
│   ├── pages/                각 페이지 (Home, About, Notice 등)
│   ├── components/           공통 컴포넌트 (Header, Footer 등)
│   ├── hooks/useNotion.js    Notion API 호출 + fallback 처리
│   ├── data/staticData.js    기본 데이터 (Notion 미연동 시 사용)
│   └── styles/global.css     전체 스타일
│
├── api/notion/             ← [API 중간 다리] Vercel Serverless
│   ├── dharma.js
│   ├── notices.js
│   ├── news.js
│   └── volunteer.js
│
├── public/photo/           ← 사찰 사진
├── vercel.json             ← Vercel 배포 설정
├── .env.example            ← 환경변수 예시
└── docs/                   ← 문서
    └── architecture.md       이 파일
```

---

## 비용 요약

| 서비스 | 역할 | 비용 |
|--------|------|------|
| GitHub | 코드 저장 | 무료 |
| Vercel | 호스팅 + API | 무료 |
| Notion | 데이터 관리 | 무료 |
| 도메인 | 주소 (선택) | 연 1~2만원 |

**도메인을 제외하면 운영 비용 0원**
