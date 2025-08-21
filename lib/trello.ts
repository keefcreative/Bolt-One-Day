// Trello API integration for contact form submissions

interface TrelloCard {
  name: string
  desc: string
  idList: string
  pos?: string
}

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  service?: string
}

export class TrelloIntegration {
  private apiKey: string
  private token: string
  private baseUrl = 'https://api.trello.com/1'

  constructor() {
    this.apiKey = process.env.TRELLO_API_KEY || ''
    this.token = process.env.TRELLO_TOKEN || ''
  }

  async createCard(data: ContactFormData, listId: string): Promise<boolean> {
    if (!this.apiKey || !this.token) {
      console.error('Trello API credentials not found')
      return false
    }

    const cardData: TrelloCard = {
      name: `New Lead: ${data.name} - ${data.company || 'No Company'}`,
      desc: this.formatCardDescription(data),
      idList: listId,
      pos: 'top'
    }

    try {
      const response = await fetch(`${this.baseUrl}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cardData,
          key: this.apiKey,
          token: this.token
        })
      })

      if (!response.ok) {
        throw new Error(`Trello API error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Trello card created:', result.id)
      return true
    } catch (error) {
      console.error('Error creating Trello card:', error)
      return false
    }
  }

  private formatCardDescription(data: ContactFormData): string {
    return `
**Contact Information:**
- Name: ${data.name}
- Email: ${data.email}
- Company: ${data.company || 'Not provided'}
- Service Interest: ${data.service || 'General inquiry'}

**Message:**
${data.message}

**Lead Source:** Website Contact Form
**Date:** ${new Date().toLocaleDateString()}
**Time:** ${new Date().toLocaleTimeString()}
    `.trim()
  }

  // Get board lists for configuration
  async getBoardLists(boardId: string) {
    if (!this.apiKey || !this.token) {
      throw new Error('Trello API credentials not found')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/boards/${boardId}/lists?key=${this.apiKey}&token=${this.token}`
      )

      if (!response.ok) {
        throw new Error(`Trello API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching board lists:', error)
      throw error
    }
  }
}

// Default export for easy use
export const trelloIntegration = new TrelloIntegration()

// Configuration - you'll need to set these based on your Trello board
export const TRELLO_CONFIG = {
  // Replace with your actual board ID and list ID
  BOARD_ID: process.env.TRELLO_BOARD_ID || '67e16644c707eaecdad931eb',
  LEADS_LIST_ID: process.env.TRELLO_LEADS_LIST_ID || '67e1669e06d67b09804a5bea', // NEW LEADS list
  QUALIFIED_LIST_ID: process.env.TRELLO_QUALIFIED_LIST_ID || '689346c2836d7d435bde2b32', // QUALIFIED LEADS list
}