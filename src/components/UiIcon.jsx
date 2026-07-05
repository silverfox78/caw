const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.6',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const ICONS = {
  house: (
    <>
      <path d="M3.5 7.5 8 3.5l4.5 4" {...STROKE} />
      <path d="M5 7.5V12.5h6V7.5" {...STROKE} />
    </>
  ),
  map: (
    <>
      <path d="M3 5.5 6 4.5l5 2 4-1.5v7.5l-5-2-5 2V5.5z" {...STROKE} />
      <path d="M6 4.5v9M11 6.5v9" {...STROKE} opacity="0.55" />
    </>
  ),
  file: (
    <>
      <path d="M5 3.5h4l3 3v7.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" {...STROKE} />
      <path d="M9 3.5V7h3.5" {...STROKE} />
    </>
  ),
  help: (
    <>
      <circle cx="8" cy="8" r="5.25" {...STROKE} />
      <path d="M6.1 6.35a2 2 0 0 1 3.45-.55c.55.55.55 1.45-.05 1.95-.75.6-1.5 1.1-1.5 2.2" {...STROKE} />
      <circle cx="8" cy="11.75" r="0.55" fill="currentColor" stroke="none" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 12.5V6.5M8 12.5V4.5M12.5 12.5v-4" {...STROKE} />
      <path d="M3 12.5h10" {...STROKE} opacity="0.45" />
    </>
  ),
  menu: (
    <>
      <path d="M3.5 5h9M3.5 8h9M3.5 11h9" {...STROKE} />
    </>
  ),
  close: (
    <>
      <path d="m4.75 4.75 6.5 6.5M11.25 4.75l-6.5 6.5" {...STROKE} />
    </>
  ),
  arrow: (
    <path d="M4 8h7M8.5 5.5 11 8l-2.5 2.5" {...STROKE} />
  ),
}

function UiIcon({ name, className = '', size = 16 }) {
  const paths = ICONS[name]

  if (!paths) {
    return null
  }

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      className={`ui-icon${className ? ` ${className}` : ''}`}
    >
      {paths}
    </svg>
  )
}

export default UiIcon
