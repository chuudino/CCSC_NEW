import { useEffect, useRef, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface InstallEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const dismissedUntilKey = 'ccsc-install-dismissed-until'
const reminderInterval = 7 * 24 * 60 * 60 * 1000

function mobilePlatform() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios'
  if (/Android/i.test(navigator.userAgent)) return 'android'
  return null
}

function isInstalledWindow() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
}

function wasDismissed() {
  try {
    return Number(localStorage.getItem(dismissedUntilKey)) > Date.now()
  } catch {
    return false
  }
}

export default function InstallPrompt() {
  const { pathname } = useLocation()
  const [platform] = useState(mobilePlatform)
  const [installed, setInstalled] = useState(isInstalledWindow)
  const [dismissed, setDismissed] = useState(wasDismissed)
  const [ready, setReady] = useState(false)
  const [manuallyOpened, setManuallyOpened] = useState(false)
  const [canPrompt, setCanPrompt] = useState(false)
  const nativePrompt = useRef<InstallEvent | null>(null)
  const footerButton = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const isAdmin = /^\/admin(?:\/|$)/i.test(pathname)
  const available = platform !== null && !installed && !isAdmin

  useEffect(() => {
    if (!platform) return
    const displayMode = window.matchMedia('(display-mode: standalone)')
    const onDisplayModeChange = () => setInstalled(isInstalledWindow())
    const onPrompt = (event: Event) => {
      if (platform !== 'android' || isInstalledWindow()) return
      event.preventDefault()
      nativePrompt.current = event as InstallEvent
      setCanPrompt(true)
    }
    const onInstalled = () => {
      nativePrompt.current = null
      setCanPrompt(false)
      setInstalled(true)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    displayMode.addEventListener?.('change', onDisplayModeChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      displayMode.removeEventListener?.('change', onDisplayModeChange)
    }
  }, [platform])

  useEffect(() => {
    if (!available || dismissed) return
    const timer = window.setTimeout(() => setReady(true), 1600)
    return () => window.clearTimeout(timer)
  }, [available, dismissed])

  useEffect(() => {
    if (manuallyOpened) heading.current?.focus({ preventScroll: true })
  }, [manuallyOpened])

  function close() {
    if (manuallyOpened || closeButton.current?.closest('section')?.contains(document.activeElement)) {
      footerButton.current?.focus()
    }
    setManuallyOpened(false)
    setDismissed(true)
    try {
      localStorage.setItem(dismissedUntilKey, String(Date.now() + reminderInterval))
    } catch {
      // The reminder still closes for the current visit.
    }
  }

  async function installOnAndroid() {
    const event = nativePrompt.current
    if (!event) return

    nativePrompt.current = null
    try {
      const { outcome } = await event.prompt()
      if (outcome === 'accepted') setInstalled(true)
      else close()
    } catch {
      heading.current?.focus({ preventScroll: true })
    } finally {
      setCanPrompt(false)
    }
  }

  if (!available) return null
  const open = manuallyOpened || (ready && !dismissed)
  const safari = /Version\/[^ ]+.*Safari\//i.test(navigator.userAgent)

  return (
    <>
      <button
        type="button"
        ref={footerButton}
        className="footer__install"
        aria-expanded={open}
        aria-controls={open ? 'pwa-install' : undefined}
        onClick={() => {
          setManuallyOpened(true)
          heading.current?.focus({ preventScroll: true })
        }}
      >
        <Download size={14} aria-hidden="true" /> 安裝神修小會網站
      </button>
      {open && (
        <section id="pwa-install" className="pwa-install" aria-labelledby="pwa-install-title" onKeyDown={(event) => {
          if (event.key === 'Escape') close()
        }}>
          <img src="/pwa/apple-touch-icon.png" alt="" width="44" height="44" />
          <div className="pwa-install__content">
            <h2 id="pwa-install-title" ref={heading} tabIndex={-1}>{platform === 'android' && !canPrompt ? '如何加入主畫面' : '安裝神修小會網站'}</h2>
            {platform === 'ios' ? (
              <>
                {!safari && <p>請先用 Safari 開啟此頁。</p>}
                <p>點「分享」<Share size={15} aria-hidden="true" /> →「加入主畫面」。若看到「打開為網頁 App」，請開啟後再點「加入」。</p>
              </>
            ) : (
              <>
                {!canPrompt ? (
                  <p>用 Chrome 開啟此頁，點右上角「⋮」→「安裝應用程式」或「加到主畫面」，再依畫面指示操作。</p>
                ) : (
                  <p>從手機主畫面直接開啟神修小會網站。</p>
                )}
                {canPrompt && <button type="button" className="button button--primary" onClick={installOnAndroid}>安裝</button>}
              </>
            )}
          </div>
          <button type="button" ref={closeButton} className="pwa-install__close" onClick={close} aria-label="關閉安裝提示">
            <X size={20} aria-hidden="true" />
          </button>
        </section>
      )}
    </>
  )
}
