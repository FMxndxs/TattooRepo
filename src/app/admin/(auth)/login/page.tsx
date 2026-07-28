import { redirect } from 'next/navigation'

// Admin login is handled via the regular site AuthModal.
// This route no longer serves a public login form.
export default function AdminLoginPage() {
  redirect('/')
}
