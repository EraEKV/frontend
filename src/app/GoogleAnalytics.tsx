'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (
      type: string,
      action: string,
      params?: { [key: string]: any }
    ) => void
  }
}

const GA_MEASUREMENT_ID = 'G-N3BNS1NCP3'

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    const url = pathname // Мы убираем searchParams для упрощения

    // Безопасный вызов gtag
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    }
  }, [pathname])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
