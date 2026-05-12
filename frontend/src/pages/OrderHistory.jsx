import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star, Upload, X } from "lucide-react";
import * as orderService from "../services/orderService";
import { getImageUrl } from "../utils/url";
import Loader from "../components/common/Loader";
import "../styles/Admin.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading) return <Loader />;
  if (error) return <div className="error" style={{ padding: "2rem", textAlign: "center" }}>Lỗi: {error}</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
          <p style={{ fontSize: "1.1rem" }}>Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="admin-card card animate-fade-in">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng tiền</th>
                  <th>Ngày mua</th>
                  <th>Đánh giá của bạn</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.ID_donhang}>
                    <td style={{ width: "70px" }}>
                      <img
                        src={getImageUrl(order.HinhAnh_url)}
                        alt={order.tenSP}
                        style={{
                          width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>
                      <Link to={`/products/${order.ID_sanpham}`} style={{ color: "var(--primary)", fontWeight: 500 }}>
                        {order.tenSP || `Sản phẩm #${order.ID_sanpham}`}
                      </Link>
                    </td>
                    <td>{order.soluong}</td>
                    <td>{formatPrice(order.gia)}</td>
                    <td style={{ fontWeight: "bold" }}>
                      {formatPrice(order.gia * order.soluong)}
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {formatDate(order.thoigiantao)}
                    </td>
                    <td>
                      {order.has_review ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={14} fill={s <= order.review_rating ? "#f59e0b" : "transparent"} color={s <= order.review_rating ? "#f59e0b" : "#d1d5db"} />
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewModal({ ID_sanpham: order.ID_sanpham, tenSP: order.tenSP })}
                          style={{
                            background: "none", border: "none", color: "var(--primary)",
                            cursor: "pointer", textDecoration: "underline", fontSize: "0.9rem",
                          }}
                        >
                          Bạn chưa đánh giá
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reviewModal && (
        <ReviewModal
          productId={reviewModal.ID_sanpham}
          productName={reviewModal.tenSP}
          onClose={() => setReviewModal(null)}
          onSuccess={() => { setReviewModal(null); fetchOrders(); }}
        />
      )}
    </div>
  );
}

function ReviewModal({ productId, productName, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert("Vui lòng chọn số sao từ 1-5");
      return;
    }
    setLoading(true);
    try {
      await orderService.createReview(productId, rating, comment, images);
      alert("Đánh giá thành công!");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: "2rem", maxWidth: "500px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem" }}>Đánh giá: {productName}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Đánh giá sao</label>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            {[1,2,3,4,5].map(s => (
              <Star
                key={s}
                size={32}
                fill={(hoverRating || rating) >= s ? "#f59e0b" : "transparent"}
                color={(hoverRating || rating) >= s ? "#f59e0b" : "#d1d5db"}
                style={{ cursor: "pointer", transition: "transform 0.1s" }}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Nhận xét</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Hình ảnh (tùy chọn)</label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {previews.map((src, idx) => (
              <div key={idx} style={{ position: "relative", width: "70px", height: "70px" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                <button
                  onClick={() => removeImage(idx)}
                  style={{ position: "absolute", top: -4, right: -4, background: "var(--danger)", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                ><X size={10} /></button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current.click()}
              style={{ width: "70px", height: "70px", border: "2px dashed #cbd5e1", borderRadius: "8px", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
            >
              <Upload size={18} color="#94a3b8" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" style={{ display: "none" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}
