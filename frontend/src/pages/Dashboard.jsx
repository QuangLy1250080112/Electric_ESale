import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <div>Please login to view dashboard</div>
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="user-info">
        <h2>User Profile</h2>
        <p>Email: {user?.email}</p>
        <p>Username: {user?.username}</p>
        <p>Full Name: {user?.full_name}</p>
      </div>
    </div>
  )
}
