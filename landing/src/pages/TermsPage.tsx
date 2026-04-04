import { useEffect } from 'react'

const SITE_URL = 'https://onda-life.com'
const PAGE_TITLE = 'Terms of Use | ONDA Life'
const PAGE_DESC =
  'ONDA Life Terms of Use (EULA) — license grant, health disclaimer, virtual currency (OND) terms, and limitations of liability for the ONDA mobile application.'

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function TermsPage() {
  useEffect(() => {
    document.title = PAGE_TITLE
    setMeta('description', PAGE_DESC)
    setMeta('og:title', PAGE_TITLE, true)
    setMeta('og:description', PAGE_DESC, true)
    setMeta('og:url', `${SITE_URL}/terms`, true)
    setMeta('og:type', 'website', true)
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-6 md:py-24">
      <article className="prose prose-invert prose-sm md:prose-base max-w-none
        prose-headings:text-white/90 prose-headings:font-mono
        prose-h1:text-2xl prose-h1:mb-8
        prose-h2:text-base prose-h2:mt-10 prose-h2:mb-3
        prose-p:text-white/50 prose-p:leading-relaxed
        prose-li:text-white/50
        prose-strong:text-white/70
        prose-a:text-cyan-400 hover:prose-a:text-cyan-300
      ">
        <h1>Terms of Use (EULA)</h1>
        <div className="flex flex-col gap-1 mb-10">
          <p className="text-white/30 text-xs font-mono m-0"><strong className="text-white/40">Application:</strong> ONDA (ONDA Life)</p>
          <p className="text-white/30 text-xs font-mono m-0"><strong className="text-white/40">Last Updated:</strong> January 9, 2026</p>
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>By downloading, installing, or using the ONDA mobile application ("the App"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the App.</p>

        <h2>2. License Grant</h2>
        <p>The developer ("we", "us", or "our") grants you a personal, non-exclusive, non-transferable, limited license to use the App for your personal, non-commercial purposes on devices you own or control.</p>

        <h2>3. Health and Wellness Disclaimer</h2>
        <p><strong>ONDA IS NOT A MEDICAL DEVICE.</strong> The App provides mindfulness, meditation, and breathing exercises for general wellness purposes only.</p>
        <ul>
          <li>The biometric data (heart rate, HRV, sleep) and stress/energy calculations are for informational purposes and should not be used for medical diagnosis or treatment.</li>
          <li>Always seek the advice of a physician or other qualified health provider with any questions regarding a medical condition.</li>
          <li>Do not disregard professional medical advice or delay in seeking it because of something you have read or experienced in the App.</li>
        </ul>

        <h2>4. Data Privacy and Biometrics</h2>
        <p>The App integrates with Apple HealthKit (iOS) and Google Health Connect (Android) to access health data.</p>
        <ul>
          <li>Your health data is processed to provide personalized insights and rewards.</li>
          <li>We use third-party services like Supabase for data storage and authentication, and OpenAI for emotion analysis.</li>
          <li>By using the App, you consent to the collection and processing of this data as described in our <a href="/privacy">Privacy Policy</a>.</li>
        </ul>

        <h2>5. Virtual Currency (OND)</h2>
        <p>The App features a virtual currency called "OND" awarded for completing practices.</p>
        <ul>
          <li>OND has no real-world monetary value.</li>
          <li>OND cannot be exchanged for "real" currency or items of value outside the App.</li>
          <li>We reserve the right to manage, regulate, and eliminate OND at our sole discretion.</li>
        </ul>

        <h2>6. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Decompile, reverse engineer, or attempt to derive the source code of the App.</li>
          <li>Use the App for any illegal or unauthorized purpose.</li>
          <li>Interfere with or disrupt the integrity or performance of the App.</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. In no event shall the developer be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App.</p>

        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Your continued use of the App following any changes constitutes your acceptance of the new Terms.</p>
      </article>
    </main>
  )
}
