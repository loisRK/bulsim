# 거마산 불심정사 홈페이지

> 실제 운영 중인 사찰 홈페이지 — 비개발자 클라이언트를 위한 CMS 연동 웹 서비스

**배포 URL:** https://bulsim.vercel.app _(배포 후 업데이트)_  
**GitHub:** https://github.com/loiskim/bulsim _(업로드 후 업데이트)_

---

## 프로젝트 소개

인천 거마산 자락에 위치한 **불심정사**의 공식 홈페이지입니다.

주지 스님이 직접 콘텐츠를 관리할 수 있도록 **코드 없이 노션(Notion)만으로** 법문·공지사항·사찰 소식을 업데이트하면 홈페이지에 실시간 반영되는 구조로 설계했습니다. 신도의 주요 사용 환경이 모바일이고 연령대가 높다는 점을 고려해 가독성과 단순함을 최우선으로 두었습니다.

### 주요 기능

| 기능 | 설명 |
|------|------|
| 오늘의 법문 | 스님이 노션에 작성하면 메인 홈에 자동 반영 |
| 공지사항 | 노션 DB에서 카테고리별 관리 (사중·교육·봉사) |
| 사찰 소식 | 행사·법회 소식을 노션에서 작성 |
| 자원봉사 신청 | 신도가 홈페이지에서 신청 → 노션 DB에 자동 저장 |
| 법회 일정 | 일일·정기·재일기도 일정 안내 |
| 오시는 길 | 교통 단계별 안내 |
| 반응형 웹 | 모바일·태블릿·데스크탑 대응 |

---

## 기술 스택

### Frontend
- **React 18** — 컴포넌트 기반 UI
- **Vite** — 빌드 도구
- **React Router v6** — 클라이언트 사이드 라우팅

### Backend / API
- **Vercel Serverless Functions** — Notion API 프록시 서버
- **Notion API** — CMS 역할 (콘텐츠 저장·관리)

### 배포
- **Vercel** — 프론트엔드 호스팅 + Serverless Functions 실행
- **GitHub** — 코드 저장 및 자동 배포 트리거

---

## 아키텍처 구조

```
[스님 — Notion에서 글 작성]
           │
           ▼
    ┌─────────────┐
    │   Notion    │  데이터베이스 (CMS)
    │  Database   │  법문 / 공지 / 소식 / 봉사신청
    └─────────────┘
           │  Notion API
           ▼
    ┌─────────────────────┐
    │  Vercel Serverless  │  API 중간 다리
    │     Functions       │  토큰 보안 / CORS 처리
    │  /api/notion/*      │
    └─────────────────────┘
           │  JSON
           ▼
    ┌─────────────┐
    │    React    │  프론트엔드
    │  Frontend   │  화면 렌더링 / 라우팅
    └─────────────┘
           │
           ▼
    [신도 브라우저 — PC / 모바일]
```

### 파일 구조

```
bulsim/
├── src/
│   ├── pages/          각 페이지 컴포넌트 (8개)
│   ├── components/     공통 컴포넌트 (Header, Footer 등)
│   ├── hooks/
│   │   └── useNotion.js    Notion API 호출 + fallback 처리
│   ├── data/
│   │   └── staticData.js   Notion 미연동 시 기본 데이터
│   └── styles/
│       └── global.css
├── api/notion/         Vercel Serverless Functions
│   ├── dharma.js       GET  오늘의 법문
│   ├── notices.js      GET  공지사항
│   ├── news.js         GET  사찰 소식
│   └── volunteer.js    POST 자원봉사 신청
├── public/photo/       사찰 사진
├── docs/               문서
└── vercel.json         배포 설정
```

---

## 이 구조를 선택한 이유

### 1. 왜 서버를 직접 구축하지 않았나

처음엔 Node.js + Express + DB로 직접 백엔드를 구축하는 방안을 검토했습니다. 하지만 클라이언트 상황을 고려했을 때 현실적이지 않았습니다.

- 서버 유지비 발생 (월 수만 원)
- 서버 장애·보안 패치를 직접 관리해야 함
- 소규모 사찰에 과도한 인프라

대신 **Vercel Serverless Functions**를 선택했습니다. 요청이 들어올 때만 실행되고, 유지비가 없으며, 배포가 git push 한 번으로 자동화됩니다.

### 2. 왜 Notion을 CMS로 선택했나

스님이 직접 콘텐츠를 관리해야 하는 요구사항이 있었습니다. 일반적인 CMS(WordPress, Strapi 등)는 별도 학습이 필요하고 서버 운영 비용이 발생합니다.

Notion은 이미 많은 사람들이 메모·문서 작성 앱으로 익숙하게 사용합니다. 스님도 별도 교육 없이 **카카오 채팅방처럼** 글을 작성하면 홈페이지에 바로 반영됩니다.

- 별도 관리자 페이지 개발 불필요
- 클라이언트의 진입 장벽 최소화
- Notion API로 데이터 읽기·쓰기 모두 가능

### 3. 왜 HTML에서 React로 마이그레이션했나

초기 버전은 HTML + 바닐라 JS로 구축했습니다. 페이지가 늘어나면서 문제가 생겼습니다.

- 헤더·푸터가 각 HTML 파일에 중복 존재
- 공통 데이터 수정 시 모든 파일을 일일이 수정
- 페이지 이동 시 전체 새로고침으로 사용자 경험 저하

React로 전환하면서 컴포넌트 재사용, 중앙화된 데이터 관리, SPA 라우팅이 가능해졌습니다. 특히 `staticData.js` 한 파일만 수정하면 전체 사이트에 반영되는 구조로 유지보수성이 크게 향상되었습니다.

### 4. 왜 Fallback 전략을 설계했나

Notion API가 일시적으로 응답하지 않거나 연동 전 단계에서도 사이트가 정상 작동해야 했습니다. `useNotion` 훅에서 API 호출 실패 시 `staticData.js`의 기본 데이터를 자동으로 사용하도록 설계했습니다. 이를 통해 외부 서비스 장애가 사용자 경험에 영향을 주지 않습니다.

### 5. 모바일·고령 사용자 UX 고려

신도의 대부분이 스마트폰을 사용하고 연령대가 높다는 점을 클라이언트에게 직접 확인했습니다. 이를 반영한 설계 결정들:

- 기본 폰트 크기 16px (일반 사이트 14px 대비 크게)
- 메뉴·버튼 font-weight 700~800 (굵은 텍스트)
- 터치 타겟 최소 48px 확보
- 자원봉사 신청 폼 입력 항목 5개로 최소화
- 단순하고 큰 버튼, 불필요한 요소 제거

---

## 개발 과정에서의 의사결정

| 상황 | 선택지 | 선택 이유 |
|------|--------|-----------|
| 콘텐츠 관리 | WordPress vs Notion | 클라이언트 학습 비용 없음, 운영비 없음 |
| 백엔드 | Express 서버 vs Serverless | 유지비 없음, 소규모 트래픽에 적합 |
| 초기 구현 | React vs HTML | 빠른 프로토타입 → 이후 React 마이그레이션 |
| 호스팅 | GitHub Pages vs Vercel | Serverless API 실행 필요, GitHub Pages 불가 |
| 스타일링 | CSS-in-JS vs Global CSS | 클라이언트가 직접 색상 수정 가능하도록 CSS 변수 사용 |

---

## 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경변수 설정

`.env.example`을 `.env`로 복사 후 Notion 토큰과 DB ID 입력

```
NOTION_TOKEN=secret_xxx
NOTION_DHARMA_DB_ID=xxx
NOTION_NOTICES_DB_ID=xxx
NOTION_NEWS_DB_ID=xxx
NOTION_VOLUNTEER_DB_ID=xxx
```
