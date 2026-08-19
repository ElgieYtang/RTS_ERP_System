import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, FileText, Package, ShoppingCart, Truck } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const quickModules = [
  { label: 'Quotations', icon: FileText, accent: 'bg-maroon' },
  { label: 'Purchase Orders', icon: ShoppingCart, accent: 'bg-brand-orange' },
  { label: 'Outslips', icon: Package, accent: 'bg-maroon-dark' },
  { label: 'Delivery Receipts', icon: Truck, accent: 'bg-[#9B2335]' },
]

interface LoginFormProps {
  email: string
  password: string
  showPassword: boolean
  error: string
  variant: 'mobile' | 'desktop'
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onForgotPassword: () => void
  onSubmit: (e: React.FormEvent) => void
}

function LoginForm({
  email,
  password,
  showPassword,
  error,
  variant,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onForgotPassword,
  onSubmit,
}: LoginFormProps) {
  const isMobile = variant === 'mobile'
  const labelClass = isMobile
    ? 'mb-1.5 block text-sm font-medium text-white/90'
    : 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-secondary'
  const inputClass = isMobile
    ? 'login-field h-12 rounded-xl border border-white/10 bg-white px-4 text-text-primary placeholder:text-text-secondary/70'
    : 'login-field h-11 rounded-xl border-transparent bg-white px-4 lg:bg-maroon-light/40'

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor={`email-${variant}`} className={labelClass}>
          Email
        </label>
        <Input
          id={`email-${variant}`}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={inputClass}
          placeholder="you@company.com"
          required
        />
      </div>

      <div>
        <label htmlFor={`password-${variant}`} className={labelClass}>
          Password
        </label>
        <div className="relative">
          <Input
            id={`password-${variant}`}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={cn(inputClass, 'pr-11')}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-maroon"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {!isMobile && (
          <div className="mt-2 text-right">
            <button
              type="button"
              className="text-xs font-medium italic text-maroon hover:underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>

      {error && (
        <p
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            isMobile ? 'bg-error-bg/90 text-error-text' : 'bg-error-bg text-error-text',
          )}
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className={cn(
          'h-12 w-full rounded-xl text-sm font-semibold shadow-md',
          isMobile ? 'mt-2' : 'uppercase tracking-wide',
        )}
      >
        Sign in
      </Button>
    </form>
  )
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('admin@responsivcode.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (login(email, password)) {
      navigate(from, { replace: true })
    } else {
      setError('Invalid email or password.')
    }
  }

  const handleForgotPassword = () => {
    setError('Password reset is not enabled in this demo.')
  }

  const formProps = {
    email,
    password,
    showPassword,
    error,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onTogglePassword: () => setShowPassword((v) => !v),
    onForgotPassword: handleForgotPassword,
    onSubmit: handleSubmit,
  }

  return (
    <>
      {/* Mobile — centered card on dark background */}
      <div className="flex min-h-screen items-center justify-center bg-[#141018] px-4 py-8 lg:hidden">
        <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#1f1619] p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain mix-blend-lighten" />
            <span className="text-lg font-bold text-maroon-light">ResponsivCode</span>
          </div>

          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/55">
            Sign in to manage your transactions and workflows.
          </p>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/45">Sign in with your account</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <LoginForm {...formProps} variant="mobile" />

          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-medium text-maroon-light hover:underline"
            >
              Forgot password?
            </button>
            <span className="text-white/30">·</span>
            <button
              type="button"
              onClick={() => setError('Please contact your system administrator for access.')}
              className="font-medium text-maroon-light hover:underline"
            >
              Contact support
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] font-semibold uppercase tracking-widest text-white/35">
            Authorized personnel only
          </p>
        </div>
      </div>

      {/* Desktop — split panel */}
      <div className="hidden min-h-screen lg:flex">
        <aside className="relative flex w-[58%] flex-col justify-between bg-[#1a1214] px-14 py-12 text-white">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-11 w-11 object-contain mix-blend-lighten" />
              <div>
                <p className="text-lg font-bold tracking-wide">RESPONSIVCODE</p>
                <p className="text-xs font-medium uppercase tracking-widest text-maroon-light/80">
                  ERP System
                </p>
              </div>
            </div>

            <h1 className="mt-16 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
              Streamlined operations for{' '}
              <span className="bg-gradient-to-r from-maroon-light via-brand-orange to-maroon-light bg-clip-text text-transparent">
                your business.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
              Manage quotations, purchase orders, inventory movement, and delivery workflows
              from one secure workspace.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-3">
              {quickModules.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 backdrop-blur-sm"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                      item.accent,
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} ResponsivCode. Internal use only.
          </p>
        </aside>

        <main className="flex flex-1 flex-col items-center justify-center bg-surface px-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-[#1a1214]">Sign in</h2>
              <p className="mt-1 text-sm text-text-secondary">Secure ERP access</p>
            </div>

            <LoginForm {...formProps} variant="desktop" />

            <p className="mt-10 text-center text-[10px] font-semibold uppercase tracking-widest text-text-secondary/70">
              Authorized personnel only
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
