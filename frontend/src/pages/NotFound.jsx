import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  )
}
