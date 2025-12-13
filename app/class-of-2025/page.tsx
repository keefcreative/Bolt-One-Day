'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClassOf2025Redirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the V2 campaign page
    router.replace('/class-of-2025-v2')
  }, [router])

  return null
}
