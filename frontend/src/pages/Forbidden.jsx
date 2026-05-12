import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import '../styles/ErrorPage.css'

export default function Forbidden() {
  const navigate = useNavigate()

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-shape shape-err-1" style={{ background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' }}></div>
      <div className="error-bg-shape shape-err-2" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)' }}></div>

      <div className="error-container">
        <div className="error-icon-wrapper" style={{ color: '#d97706' }}>
          <ShieldAlert size={56} strokeWidth={1.5} />
        </div>
        
        <h1 className="error-code" style={{ background: 'linear-gradient(135deg, #b45309, #78350f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          403
        </h1>
        <h2 className="error-title">Truy cập bị từ chối</h2>
        <p className="error-message">
          Bạn không có quyền truy cập vào khu vực này. Trang này chỉ dành cho Quản trị viên.
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
