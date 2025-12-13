'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class CampaignErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Campaign component error:', error, errorInfo)

    // Optional: Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // trackError('campaign-component-error', { error, errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      // Show fallback or nothing
      return this.props.fallback || null
    }

    return this.props.children
  }
}
