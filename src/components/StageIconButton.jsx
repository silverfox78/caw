const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const ICONS = {
  expand: (
    <>
      <path d="M3.5 5.5h5.5M3.5 8h4M3.5 10.5h5.5" {...STROKE} opacity="0.45" />
      <path d="M10.5 5.5 13 8l-2.5 2.5" {...STROKE} />
    </>
  ),
  collapse: (
    <>
      <path d="M3.5 5.5h5.5M3.5 8h4M3.5 10.5h5.5" {...STROKE} opacity="0.45" />
      <path d="M5.5 10.5 8 13l2.5-2.5" {...STROKE} />
    </>
  ),
  addItem: (
    <>
      <circle cx="8" cy="8" r="5.25" {...STROKE} opacity="0.55" />
      <path d="M8 5.25v5.5M5.25 8h5.5" {...STROKE} />
    </>
  ),
  addGroup: (
    <>
      <path d="M3.5 6.5h6.5a1 1 0 0 1 1 1v5.5H3.5V6.5z" {...STROKE} />
      <path d="M5.5 6.5V5.25a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6.5" {...STROKE} />
      <path d="M8 9.25v2.25M6.75 10.5h2.5" {...STROKE} />
    </>
  ),
  remove: (
    <>
      <path d="M5.5 5.5h5" {...STROKE} />
      <path d="M6.25 5.5V4.75h3.5v.75" {...STROKE} />
      <path d="M6 5.5l.35 6h3.3l.35-6" {...STROKE} />
      <path d="M6.75 7.75v3M9.25 7.75v3" {...STROKE} opacity="0.75" />
    </>
  ),
}

function StageIconButton({
  icon,
  label,
  variant = 'default',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`stage-icon-btn stage-icon-btn--${variant}${className ? ` ${className}` : ''}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="stage-icon-btn__svg">
        {ICONS[icon]}
      </svg>
    </button>
  )
}

export default StageIconButton
