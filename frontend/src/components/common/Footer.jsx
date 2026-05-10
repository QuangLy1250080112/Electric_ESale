import { MessageCircle, Send, Camera, Mail, Phone, MapPin } from 'lucide-react'
import '../../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>ESale</h2>
          <p>
            Cung cấp các thiết bị điện tử chất lượng cao với giá cả cạnh tranh. 
            Hệ thống bán hàng trực tuyến hiện đại, nhanh chóng và an toàn.
          </p>
        </div>

        <div className="footer-section">
          <h3>Khám phá</h3>
          <ul className="footer-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/#products">Sản phẩm</a></li>
            <li><a href="/categories">Danh mục</a></li>
            <li><a href="/about">Giới thiệu</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Hỗ trợ</h3>
          <ul className="footer-links">
            <li><a href="/faq">Câu hỏi thường gặp</a></li>
            <li><a href="/shipping">Chính sách giao hàng</a></li>
            <li><a href="/returns">Chính sách đổi trả</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3>Liên hệ</h3>
          <p><MapPin size={18} /> 123 Đường ABC, Quận 1, TP. HCM</p>
          <p><Phone size={18} /> (028) 1234 5678</p>
          <p><Mail size={18} /> contact@esale.example.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 ESale </p>
        <div className="social-links">
          <a href="#" title="Facebook"><MessageCircle size={20} /></a>
          <a href="#" title="Twitter"><Send size={20} /></a>
          <a href="#" title="Instagram"><Camera size={20} /></a>
        </div>
      </div>
    </footer>
  )
}
