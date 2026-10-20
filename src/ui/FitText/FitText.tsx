import { useLayoutEffect, useRef, type HTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './FitText.module.css'

type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  readonly children: string
}

export function FitText({ children, className, ...props }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const fit = () => {
      text.style.fontSize = ''
      const availableWidth = container.clientWidth
      const textWidth = text.getBoundingClientRect().width
      if (textWidth > availableWidth && availableWidth > 0) {
        const fontSize = Number.parseFloat(getComputedStyle(text).fontSize)
        text.style.fontSize = `${(fontSize * availableWidth) / textWidth}px`
      }
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    document.fonts.addEventListener('loadingdone', fit)

    return () => {
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', fit)
    }
  }, [children])

  return (
    <span {...props} ref={containerRef} className={classNames(styles.container, className)}>
      <span ref={textRef} className={styles.text}>
        {children}
      </span>
    </span>
  )
}
