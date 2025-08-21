import * as brevo from '@getbrevo/brevo'

// Types for our integration
export interface ContactData {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  phone?: string
  attributes?: Record<string, any>
}

export interface EmailData {
  to: string | string[]
  subject: string
  htmlContent: string
  textContent?: string
  params?: Record<string, any>
  templateId?: number
}

export interface BrevoContactFormData {
  name: string
  email: string
  company?: string
  message: string
  service?: string
  source?: string
}

export interface BrevoStripeCustomerData {
  email: string
  customerId: string
  subscriptionId?: string
  plan?: string
  amount?: number
  currency?: string
  status?: string
}

class BrevoIntegration {
  private contactsApi: brevo.ContactsApi
  private transactionalEmailsApi: brevo.TransactionalEmailsApi
  private apiKey: string

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('BREVO_API_KEY not found in environment variables')
    }

    // Initialize the API clients
    const apiInstance = new brevo.ContactsApi()
    apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, this.apiKey)
    this.contactsApi = apiInstance

    const emailApiInstance = new brevo.TransactionalEmailsApi()
    emailApiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, this.apiKey)
    this.transactionalEmailsApi = emailApiInstance
  }

  // Create or update a contact in Brevo
  async createOrUpdateContact(data: BrevoContactFormData): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Brevo API key not configured')
      return false
    }

    try {
      // Parse the name into first and last name
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create contact object
      const createContact = new brevo.CreateContact()
      createContact.email = data.email
      createContact.attributes = {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        COMPANY: data.company || '',
        SERVICE_INTEREST: data.service || 'General Inquiry',
        LAST_MESSAGE: data.message,
        LEAD_SOURCE: data.source || 'Website Contact Form',
        CONTACT_DATE: new Date().toISOString(),
      }

      // Add to specific list if configured
      if (process.env.BREVO_LIST_ID) {
        createContact.listIds = [parseInt(process.env.BREVO_LIST_ID)]
      }

      // Try to create the contact
      await this.contactsApi.createContact(createContact)
      console.log(`Contact created in Brevo: ${data.email}`)
      return true
    } catch (error: any) {
      // If contact already exists, update it
      if (error?.response?.body?.code === 'duplicate_parameter') {
        try {
          await this.updateContact(data)
          return true
        } catch (updateError) {
          console.error('Error updating existing contact:', updateError)
          return false
        }
      }
      console.error('Error creating contact in Brevo:', error)
      return false
    }
  }

  // Update existing contact
  private async updateContact(data: BrevoContactFormData): Promise<void> {
    const nameParts = data.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const updateContact = new brevo.UpdateContact()
    updateContact.attributes = {
      FIRSTNAME: firstName,
      LASTNAME: lastName,
      COMPANY: data.company || '',
      SERVICE_INTEREST: data.service || 'General Inquiry',
      LAST_MESSAGE: data.message,
      LAST_CONTACT_DATE: new Date().toISOString(),
    }

    await this.contactsApi.updateContact(data.email, updateContact)
    console.log(`Contact updated in Brevo: ${data.email}`)
  }

  // Send transactional email
  async sendEmail(data: EmailData): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Brevo API key not configured')
      return false
    }

    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      
      // Handle both single and multiple recipients
      const recipients = Array.isArray(data.to) ? data.to : [data.to]
      sendSmtpEmail.to = recipients.map(email => ({ email }))
      
      // Set sender (configure this in environment variables)
      sendSmtpEmail.sender = {
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@designworks.com',
        name: process.env.BREVO_SENDER_NAME || 'DesignWorks'
      }

      // Use template if provided, otherwise use content
      if (data.templateId) {
        sendSmtpEmail.templateId = data.templateId
        sendSmtpEmail.params = data.params
      } else {
        sendSmtpEmail.subject = data.subject
        sendSmtpEmail.htmlContent = data.htmlContent
        if (data.textContent) {
          sendSmtpEmail.textContent = data.textContent
        }
      }

      const response = await this.transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
      console.log('Email sent successfully:', response.body)
      return true
    } catch (error) {
      console.error('Error sending email via Brevo:', error)
      return false
    }
  }

  // Send notification email for new contact form submission
  async sendContactNotification(data: BrevoContactFormData): Promise<boolean> {
    const notificationEmail: EmailData = {
      to: process.env.NOTIFICATION_EMAIL || 'team@designworks.com',
      subject: `New Contact Form Submission: ${data.name}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Service Interest:</strong> ${data.service || 'General inquiry'}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted on ${new Date().toLocaleString()}</em></p>
      `,
      textContent: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Service Interest: ${data.service || 'General inquiry'}

Message:
${data.message}

Submitted on ${new Date().toLocaleString()}
      `.trim()
    }

    return await this.sendEmail(notificationEmail)
  }

  // Send welcome email to new contact
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    // You can use a Brevo template ID if you have one configured
    const templateId = process.env.BREVO_WELCOME_TEMPLATE_ID

    if (templateId) {
      return await this.sendEmail({
        to: email,
        subject: '', // Subject defined in template
        htmlContent: '', // Content defined in template
        templateId: parseInt(templateId),
        params: {
          name: name,
          company: 'DesignWorks'
        }
      })
    }

    // Fallback to inline content
    return await this.sendEmail({
      to: email,
      subject: 'Welcome to DesignWorks',
      htmlContent: `
        <h1>Welcome to DesignWorks, ${name}!</h1>
        <p>Thank you for reaching out. We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to explore our portfolio and learn more about our services.</p>
        <p>Best regards,<br>The DesignWorks Team</p>
      `,
      textContent: `
Welcome to DesignWorks, ${name}!

Thank you for reaching out. We've received your message and will get back to you within 24 hours.

In the meantime, feel free to explore our portfolio and learn more about our services.

Best regards,
The DesignWorks Team
      `.trim()
    })
  }

  // Handle Stripe customer events
  async handleStripeCustomer(data: BrevoStripeCustomerData): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Brevo API key not configured')
      return false
    }

    try {
      const createContact = new brevo.CreateContact()
      createContact.email = data.email
      createContact.attributes = {
        STRIPE_CUSTOMER_ID: data.customerId,
        STRIPE_SUBSCRIPTION_ID: data.subscriptionId || '',
        SUBSCRIPTION_PLAN: data.plan || '',
        SUBSCRIPTION_STATUS: data.status || '',
        SUBSCRIPTION_AMOUNT: data.amount || 0,
        SUBSCRIPTION_CURRENCY: data.currency || 'USD',
        CUSTOMER_TYPE: 'Paid',
        SUBSCRIPTION_DATE: new Date().toISOString(),
      }

      // Add to paid customers list if configured
      if (process.env.BREVO_PAID_CUSTOMERS_LIST_ID) {
        createContact.listIds = [parseInt(process.env.BREVO_PAID_CUSTOMERS_LIST_ID)]
      }

      await this.contactsApi.createContact(createContact)
      console.log(`Stripe customer added to Brevo: ${data.email}`)
      return true
    } catch (error: any) {
      // If contact exists, update with Stripe data
      if (error?.response?.body?.code === 'duplicate_parameter') {
        try {
          const updateContact = new brevo.UpdateContact()
          updateContact.attributes = {
            STRIPE_CUSTOMER_ID: data.customerId,
            STRIPE_SUBSCRIPTION_ID: data.subscriptionId || '',
            SUBSCRIPTION_PLAN: data.plan || '',
            SUBSCRIPTION_STATUS: data.status || '',
            SUBSCRIPTION_AMOUNT: data.amount || 0,
            SUBSCRIPTION_CURRENCY: data.currency || 'USD',
            CUSTOMER_TYPE: 'Paid',
            LAST_SUBSCRIPTION_UPDATE: new Date().toISOString(),
          }

          await this.contactsApi.updateContact(data.email, updateContact)
          console.log(`Stripe customer updated in Brevo: ${data.email}`)
          return true
        } catch (updateError) {
          console.error('Error updating Stripe customer:', updateError)
          return false
        }
      }
      console.error('Error handling Stripe customer in Brevo:', error)
      return false
    }
  }

  // Get contact details
  async getContact(email: string): Promise<any> {
    if (!this.apiKey) {
      console.error('Brevo API key not configured')
      return null
    }

    try {
      const contact = await this.contactsApi.getContactInfo(email)
      return contact.body
    } catch (error) {
      console.error(`Error fetching contact ${email}:`, error)
      return null
    }
  }

  // Add contact to a specific list
  async addContactToList(email: string, listId: number): Promise<boolean> {
    if (!this.apiKey) {
      console.error('Brevo API key not configured')
      return false
    }

    try {
      const contactEmails = new brevo.AddContactToList()
      contactEmails.emails = [email]
      
      await this.contactsApi.addContactToList(listId, contactEmails)
      console.log(`Contact ${email} added to list ${listId}`)
      return true
    } catch (error) {
      console.error('Error adding contact to list:', error)
      return false
    }
  }
}

// Export singleton instance
export const brevoIntegration = new BrevoIntegration()

// Export the class for testing or custom instances
export default BrevoIntegration