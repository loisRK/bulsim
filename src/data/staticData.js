/* ═══════════════════════════════════════════════════════
   staticData.js
   Notion API 미연동 시 사용하는 기본 데이터입니다.
   Notion 연동 후에도 API 오류 시 fallback으로 사용됩니다.
═══════════════════════════════════════════════════════ */

export const TEMPLE = {
  name: "불심정사",
  mountain: "거마산",
  fullName: "거마산 불심정사",
  englishName: "BULSIMJEONGSA TEMPLE",
  address: "인천광역시 남동구 무네미로312번길 47",
  tel: "032-466-8475",
  email: "이메일을 입력해 주세요",
  greeting:
    "불심정사는 거마산 자락에 위치한 청정 도량으로, 부처님의 가르침 아래 대중과 함께 수행하고 정진하는 공간입니다.",
  greetingLong: `불심정사를 찾아주신 여러분을 진심으로 환영합니다.

거마산 자락에 자리한 불심정사는 부처님의 자비로운 가르침을 따라 대중과 함께 수행하고 정진하는 청정 도량입니다.

이곳은 바쁜 일상 속에서 잠시 발걸음을 멈추고 마음의 평안을 찾을 수 있는 공간입니다. 누구나 언제든지 편안한 마음으로 방문하시어 부처님의 가피를 받으시기 바랍니다.

합장 인사드립니다.`,
  transport: [
    {
      icon: "subway",
      label: "지하철 + 버스",
      steps: [
        { step: "1", text: "1호선 <b>송내역</b> 하차" },
        {
          step: "2",
          text: "송내역남부 정류장 → 버스 <b>14-1 · 47 · 16-1</b> 탑승",
        },
        { step: "3", text: "<b>무내미마을</b> 정류장 하차 후 도보 5분" },
      ],
      info: "소요시간 약 17분 · 요금 1,500원",
    },
    {
      icon: "bus",
      label: "버스만 이용",
      steps: [
        { step: "1", text: "인천대공원 정류장에서 <b>11 · 30번</b> 탑승" },
        { step: "2", text: "<b>무내미마을</b> 정류장 하차 후 도보 5분" },
      ],
      info: "",
    },
    {
      icon: "car",
      label: "자가용",
      steps: [{ step: "1", text: "인천광역시 남동구 무네미로312번길 47" }],
      info: "주차 가능 (사찰 앞 주차장)",
    },
  ],
};

export const NAV = [
  {
    label: "불심정사 소개",
    href: "/about",
    sub: [
      { label: "인사말", href: "/about#greeting" },
      { label: "대웅전", href: "/about#hall" },
      { label: "역사", href: "/about#history" },
      { label: "오시는 길", href: "/about#location" },
    ],
  },
  {
    label: "신행안내",
    href: "/schedule",
    sub: [
      { label: "법회 일정", href: "/schedule" },
      { label: "자원봉사 신청", href: "/volunteer" },
    ],
  },
  {
    label: "사찰 소식",
    href: "/notice",
    sub: [
      { label: "공지사항", href: "/notice" },
      { label: "사찰일정", href: "/schedule" },
      { label: "주요행사", href: "/events" },
      { label: "자료실",   href: "/archive" },
    ],
  },
];

export const QUICK_LINKS = [
  { icon: "schedule",  label: "법회안내", sub: "매주 일요법회", href: "/schedule" },
  { icon: "notice",    label: "공지사항", sub: "사찰 공지 보기", href: "/notice" },
  { icon: "volunteer", label: "봉사신청", sub: "자원봉사 신청", href: "/volunteer" },
  { icon: "location",  label: "오시는 길", sub: "찾아오는 방법", href: "/about#location" },
];

export const SLIDES = [
  {
    img: "/photo/IMG_5231.jpeg",
    en: "BULSHIMJEONGSA",
    title: "거마산 불심정사에\n오신 것을 환영합니다",
    desc: "부처님의 가르침이 살아 숨 쉬는 청정 도량",
  },
  {
    img: "/photo/IMG_5221.jpeg",
    en: "MAIN HALL",
    title: "대웅전 법회",
    desc: "연등이 가득한 법당에서 부처님의 자비를 만나세요",
  },
  {
    img: "/photo/IMG_5261.jpeg",
    en: "DHARMA SERVICE",
    title: "정성스러운 법회",
    desc: "스님과 신도가 함께 기도하는 불심정사의 법회",
  },
  {
    img: "/photo/IMG_5290.jpeg",
    en: "COMMUNITY",
    title: "함께하는 불심정사",
    desc: "스님과 신도가 하나 되어 만들어가는 도량",
  },
];

export const DHARMA_TODAY = {
  text: "마음이 청정하면 세상이 청정하고, 마음이 어지러우면 세상이 어지럽습니다. 모든 것은 마음이 만들어 내니, 지금 이 순간 내 마음을 잘 살피시기 바랍니다.",
  source: "— 주지스님 법문 중에서",
  date: "2026년 6월 1일",
};

export const NOTICES = [
  {
    id: "temple",
    badge: "사중",
    title: "공지사항",
    items: [
      { text: "2025년 하안거 기도 일정 안내" },
      { text: "부처님오신날 연등 달기 신청 접수" },
      { text: "대웅전 보수공사 기간 중 법회 장소 변경" },
      { text: "가을 정기법회 일정 안내" },
      { text: "신도증 발급 안내" },
    ],
  },
  {
    id: "edu",
    badge: "교육",
    title: "불교 교육",
    items: [
      { text: "불교기초교육 수강생 모집" },
      { text: "반야심경 경전 공부 모임" },
      { text: "명상 입문 클래스 안내" },
      { text: "어린이 불교학교 등록 안내" },
      { text: "청년 불자 모임 정기 법회" },
    ],
  },
  {
    id: "volunteer",
    badge: "봉사",
    title: "자원봉사",
    items: [
      { text: "공양간 봉사자 모집 (매주 일요일)" },
      { text: "도량 청소 봉사 일정 안내" },
      { text: "이웃 돕기 봉사활동 모집" },
      { text: "사찰 행사 자원봉사 신청" },
    ],
  },
];

export const NEWS = [
  {
    day: "24",
    month: "2025.05",
    title: "부처님오신날 법요식 봉행",
    desc: "불기 2569년 부처님오신날을 맞아 성대한 법요식이 봉행되었습니다.",
  },
  {
    day: "18",
    month: "2025.05",
    title: "연등행렬 행사 안내",
    desc: "부처님오신날을 앞두고 연등행렬이 진행됩니다. 많은 참여 바랍니다.",
  },
  {
    day: "10",
    month: "2025.05",
    title: "봄 정기 대청소 및 도량 정비",
    desc: "사부대중이 함께 도량을 정비하고 청정한 수행 환경을 만들었습니다.",
  },
  {
    day: "01",
    month: "2025.05",
    title: "초하루 법회 및 방생 행사",
    desc: "5월 초하루 법회와 함께 생명 존중의 방생 행사가 진행되었습니다.",
  },
];

export const SCHEDULE = [
  {
    day: "매일",
    time: "04:00 – 05:00",
    name: "새벽예불",
    tag: "tag-blue",
    label: "매일",
  },
  {
    day: "매일",
    time: "10:00 – 11:30",
    name: "사시불공",
    tag: "tag-blue",
    label: "매일",
  },
  {
    day: "매일",
    time: "17:00 – 17:30",
    name: "저녁예불",
    tag: "tag-blue",
    label: "매일",
  },
  {
    day: "음력 매월 1일",
    time: "10:00",
    name: "초하루 신중기도",
    tag: "tag-green",
    label: "월간",
  },
  {
    day: "음력 매월 15일",
    time: "10:00",
    name: "보름 미타 재일기도",
    tag: "tag-green",
    label: "월간",
  },
  {
    day: "음력 매월 18일",
    time: "10:00",
    name: "지장재일",
    tag: "tag-gold",
    label: "재일",
  },
  {
    day: "음력 매월 24일",
    time: "10:00",
    name: "관음재일",
    tag: "tag-gold",
    label: "재일",
  },
];

export const ABOUT_HISTORY = [
  { year: "창건", desc: "불심정사 창건" },
  { year: "현재", desc: "거마산 자락 청정 도량으로 운영 중" },
];

export const EVENTS = [
  {
    badge: "법회",
    date: "2026년 5월 24일 (일)",
    title: "2026년 부처님 오신날 법회",
    desc: "불기 2570년 부처님 오신날을 맞아 거마산 불심정사에서 봉축 법회를 봉행하였습니다.\n\n연등이 아름답게 장엄된 법당 안에서 스님과 신도 사부대중이 한자리에 모여 부처님의 자비로운 가르침을 되새기고, 세상 모든 존재의 평안과 행복을 발원하는 뜻깊은 시간을 가졌습니다.",
    info: [
      { label: "일시", value: "2026년 5월 24일 (일) 오전 10시 30분" },
      { label: "장소", value: "거마산 불심정사 대웅전" },
      { label: "주관", value: "불심정사 사부대중" },
    ],
    photos: ["/photo/IMG_5290.jpeg", "/photo/IMG_5242.jpeg"],
  },
];
