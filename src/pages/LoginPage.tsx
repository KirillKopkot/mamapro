import { AuthShell } from '../features/auth/AuthShell'
import { LoginForm } from '../features/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthShell mode="login">
      <LoginForm />
    </AuthShell>
  )
}
