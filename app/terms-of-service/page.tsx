import LegalPageLayout from '@/components/legal/LegalPageLayout'
import termsOfServiceData from '@/data/legal/terms-of-service.json'

export const metadata = {
  title: 'Terms of Service | DesignWorks Bureau',
  description: 'Read our terms of service to understand the rules and regulations for using DesignWorks Bureau website and design services.',
}

export default function TermsOfServicePage() {
  return <LegalPageLayout data={termsOfServiceData.termsOfService} />
}