import { useState, useEffect } from 'react'

export interface CampaignSpotsData {
  available: boolean
  spotsRemaining: number
  totalSpots: number
  activeSubscriptions?: number
  deadline?: string
  deadlinePassed?: boolean
  message?: string
  loading: boolean
  error: string | null
}

export function useCampaignSpots(campaignId: string = 'classOf2025'): CampaignSpotsData {
  const [data, setData] = useState<CampaignSpotsData>({
    available: true,
    spotsRemaining: 0,
    totalSpots: 10,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchSpots = async () => {
      try {
        const response = await fetch(`/api/campaign/spots?campaign=${campaignId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch campaign spots')
        }

        const result = await response.json()

        if (isMounted) {
          setData({
            available: result.available,
            spotsRemaining: result.spotsRemaining,
            totalSpots: result.totalSpots,
            activeSubscriptions: result.activeSubscriptions,
            deadline: result.deadline,
            deadlinePassed: result.deadlinePassed,
            message: result.message,
            loading: false,
            error: null,
          })
        }
      } catch (error: any) {
        if (isMounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to load campaign data',
          }))
        }
      }
    }

    fetchSpots()

    // Refresh every 30 seconds to keep spots updated
    const interval = setInterval(fetchSpots, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [campaignId])

  return data
}
