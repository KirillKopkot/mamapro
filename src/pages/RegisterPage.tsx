import { AuthShell } from '../features/auth/AuthShell'
import { RegisterForm } from '../features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthShell mode="register">
      <RegisterForm />
    </AuthShell>
  )
}
