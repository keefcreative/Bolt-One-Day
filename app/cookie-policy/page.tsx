import LegalPageLayout from '@/components/legal/LegalPageLayout'
import cookiePolicyData from '@/data/legal/cookie-policy.json'

export const metadata = {
  title: 'Cookie Policy | DesignWorks Bureau',
  description: 'Learn about how DesignWorks Bureau uses cookies on our website to improve your browsing experience and analyze website performance.',
}

export default function CookiePolicyPage() {
  return <LegalPageLayout data={cookiePolicyData.cookiePolicy} />
}