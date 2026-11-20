import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'

const directionThreshold = 8
const refreshThreshold = 72
const feedback = {
  pull: '下拉重新整理',
  release: '放開即可重新整理',
  loading: '正在重新整理…',
}

function canStartPull(target: EventTarget | null) {
  if (!(target instanceof Element) || target.closest(
    'input, textarea, select, button, summary, [contenteditable], dialog, [role="dialog"], video, audio',
  )) return false

  for (let element: Element | null = target; element && element !== document.body; element = element.parentElement) {
    if (element.scrollHeight > element.clientHeight + 1 &&
      /^(auto|scroll|overlay)$/.test(getComputedStyle(element).overflowY)) return false
  }
  return true
}

export default function PwaRefresh() {
  const [status, setStatus] = useState<keyof typeof feedback | null>(null)

  useEffect(() => {
    let start: Touch | null = null
    let dragging = false
    let ready = false
    let reloading = false

    function clearPull() {
      start = null
      dragging = false
      ready = false
      document.removeEventListener('touchmove', handleMove)
    }

    function cancelPull() {
      clearPull()
      if (!reloading) setStatus(null)
    }

    function handleStart(event: TouchEvent) {
      if (start) cancelPull()
      if (reloading || event.touches.length !== 1 || window.scrollY > 1 || !canStartPull(event.target)) return

      start = event.touches[0]
      document.addEventListener('touchmove', handleMove, { passive: false })
    }

    function handleMove(event: TouchEvent) {
      const touch = event.touches[0]
      if (!start || event.touches.length !== 1 || touch.identifier !== start.identifier || window.scrollY > 1) {
        cancelPull()
        return
      }

      const down = touch.clientY - start.clientY
      const across = Math.abs(touch.clientX - start.clientX)
      if (!dragging) {
        if (Math.max(Math.abs(down), across) < directionThreshold) return
        if (down <= across) {
          cancelPull()
          return
        }
        dragging = true
      }

      if (event.cancelable) event.preventDefault()
      ready = down >= refreshThreshold && down > across
      setStatus(ready ? 'release' : down >= directionThreshold ? 'pull' : null)
    }

    function handleEnd(event: TouchEvent) {
      if (!start) return
      const touch = event.changedTouches[0]
      const shouldReload = ready && touch?.identifier === start.identifier && touch.clientY - start.clientY >= refreshThreshold &&
        touch.clientY - start.clientY > Math.abs(touch.clientX - start.clientX) &&
        event.touches.length === 0 && window.scrollY <= 1
      if (!shouldReload) {
        cancelPull()
        return
      }

      clearPull()
      reloading = true
      setStatus('loading')
      window.location.reload()
    }

    document.documentElement.classList.add('pwa-pull-to-refresh')
    document.addEventListener('touchstart', handleStart, { passive: true })
    document.addEventListener('touchend', handleEnd, { passive: true })
    document.addEventListener('touchcancel', cancelPull)
    return () => {
      clearPull()
      document.documentElement.classList.remove('pwa-pull-to-refresh')
      document.removeEventListener('touchstart', handleStart)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('touchcancel', cancelPull)
    }
  }, [])

  return (
    <div className="pwa-refresh-feedback" role="status">
      {status && <span><RotateCw size={16} aria-hidden="true" />{feedback[status]}</span>}
    </div>
  )
}
