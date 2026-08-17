import { SignUp as ClerkSignUp } from '@clerk/react'
import { dark } from '@clerk/themes'
import { useSearchParams } from 'react-router-dom'

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <ClerkSignUp
        routing="path"
        path="/sign-up"
        signInUrl={`/sign-in?redirect=${encodeURIComponent(redirect)}`}
        forceRedirectUrl={redirect}
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#FF5125',
          },
        } as any}
      />
    </main>
  )
}
