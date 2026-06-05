const SIZES = { sm: 16, md: 22, lg: 28, xl: 36, hero: 52 }

const ICONS = {
  schedule: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  notice: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </>
  ),
  volunteer: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  subway: (
    <>
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <circle cx="8" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
    </>
  ),
  bus: (
    <>
      <path d="M8 6v10" />
      <path d="M16 6v10" />
      <path d="M6 20h12" />
      <rect x="4" y="6" width="16" height="10" rx="2" />
      <path d="M4 10h16" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="16" cy="16" r="1.5" />
    </>
  ),
  car: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3.7a1 1 0 0 0-.3-.7l-2.5-2.5A1 1 0 0 0 18.4 9H5.6a1 1 0 0 0-.7.3l-2.5 2.5A1 1 0 0 0 2 12.3V16c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 11h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 3c-2 3-5 4-7 4 1 3 3 5 7 5s6-2 7-5c-2 0-5-1-7-4z" />
      <path d="M12 12c-3 2-6 2-8 0 1 3 3 5 8 5s7-2 8-5c-2 2-5 2-8 0z" />
      <path d="M12 21v-4" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 17v5" />
      <path d="M5 7h14l-1.5 5.5a2 2 0 0 1-1.9 1.5H8.4a2 2 0 0 1-1.9-1.5L5 7z" />
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
}

export default function Icon({ name, size = 'md', className = '' }) {
  const px = typeof size === 'number' ? size : (SIZES[size] ?? 22)

  return (
    <svg
      className={`icon ${className}`.trim()}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={name !== 'close' && name !== 'menu'}
    >
      {ICONS[name]}
    </svg>
  )
}
