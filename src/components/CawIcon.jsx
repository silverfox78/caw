import { FURIOUS_ICON_URL } from '../utils/brandAssets.js'

const SIZE_CLASS = {
  sm: 'caw-icon--sm',
  md: 'caw-icon--md',
  lg: 'caw-icon--lg',
  xl: 'caw-icon--xl',
}

function CawIcon({ size = 'md', className = '', alt = 'CAW' }) {
  const sizeClass = SIZE_CLASS[size] ?? SIZE_CLASS.md

  return (
    <img
      className={`caw-icon ${sizeClass}${className ? ` ${className}` : ''}`}
      src={FURIOUS_ICON_URL}
      alt={alt}
      width={size === 'xl' ? 112 : size === 'lg' ? 80 : size === 'sm' ? 40 : 56}
      height={size === 'xl' ? 112 : size === 'lg' ? 80 : size === 'sm' ? 40 : 56}
      decoding="async"
    />
  )
}

export default CawIcon
