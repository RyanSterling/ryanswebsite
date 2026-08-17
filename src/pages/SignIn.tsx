import { SignIn as ClerkSignIn } from '@clerk/react'
import { dark } from '@clerk/themes'
import { useSearchParams } from 'react-router-dom'

export default function SignIn() {
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl={`/sign-up?redirect=${encodeURIComponent(redirect)}`}
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
