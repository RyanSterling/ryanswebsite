import { SignIn as ClerkSignIn } from '@clerk/react'
import { dark } from '@clerk/themes'
import { useSearchParams } from 'react-router-dom'
import type { Appearance } from '@clerk/types'

export default function SignIn() {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const appearance: Appearance = {
    baseTheme: dark,
    variables: {
      colorPrimary: '#FF5125',
    },
  }

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl={redirect}
        appearance={appearance}
      />
    </main>
  )
}
