import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/stock" className="text-xl font-bold">
            Clinic Stock Console
          </Link>

          <nav>
            <Link to="/stock" className="text-sm font-medium hover:underline">
              Stock
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
           Welcome {user?.firstName} {user?.lastName}
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
