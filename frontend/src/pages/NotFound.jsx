import { Link, useNavigate } from 'react-router-dom'
import { MapPinOff, ArrowLeft, Home } from 'lucide-react'
import '../styles/ErrorPage.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-shape shape-err-1"></div>
      <div className="error-bg-shape shape-err-2"></div>

      <div className="error-container">
        <div className="error-icon-wrapper" style={{ color: '#ef4444' }}>
          <MapPinOff size={56} strokeWidth={1.5} />
        </div>
        
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Không tìm thấy trang</h2>
        <p className="error-message">
          Trang bạn đang tìm kiếm không tồn tại, đã bị gỡ bỏ hoặc bạn đã gõ sai đường dẫn.
        </p>

        <div className="error-actions">
          <button onClick={() => navigate(-1)} className="btn-error-back">
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <Link to="/" className="btn-error-home">
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
