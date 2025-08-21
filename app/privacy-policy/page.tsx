import LegalPageLayout from '@/components/legal/LegalPageLayout'
import privacyPolicyData from '@/data/legal/privacy-policy.json'

export const metadata = {
  title: 'Privacy Policy | DesignWorks Bureau',
  description: 'Learn how DesignWorks Bureau collects, uses, and protects your personal information. Our comprehensive privacy policy outlines our commitment to your data protection.',
}

export default function PrivacyPolicyPage() {
  return <LegalPageLayout data={privacyPolicyData.privacyPolicy} />
}