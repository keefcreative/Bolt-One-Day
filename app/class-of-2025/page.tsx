'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClassOf2025Redirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the Class of 2026 campaign page
    router.replace('/class-of-2026')
  }, [router])

  return null
}
