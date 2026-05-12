import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/url";
import { Trash2, Minus, Plus } from "lucide-react";
import * as orderService from "../services/orderService";
import "../styles/Admin.css"; // Reuse admin table styles

export default function Cart() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleRemove = async (item) => {
    try {
      removeItem(item.id);
    } catch (err) {
      alert("Lỗi khi xóa khỏi giỏ hàng");
    }
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    updateQuantity(item.id, newQty);
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  const handleCheckoutClick = () => {
    if (items.length === 0) return;
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập trước khi thanh toán!");
      navigate("/login");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const checkoutItems = items.map((item) => ({
        ID_sanpham: item.id,
        soluong: item.quantity,
        gia: item.price,
      }));

      await orderService.checkout(checkoutItems);
      clearCart();
      setShowCheckoutModal(false);
      alert("Thanh toán thành công! Đơn hàng đã được xác nhận.");
    } catch (error) {
      const msg = error.response?.data?.detail || "Có lỗi xảy ra khi thanh toán!";
      alert(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Build QR data with user and cart info
  const qrData = JSON.stringify({
    items: items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
    total,
    user: user?.tenTK || "guest",
  });
  const paymentUrl = `${window.location.origin}/payment-confirm?data=${encodeURIComponent(qrData)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(paymentUrl)}`;

  if (items.length === 0) {
    return (
      <div
        className="cart-page empty"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <h1>Giỏ hàng của bạn</h1>
        <p>Giỏ hàng đang trống</p>
        <Link
          to="/#products"
          className="btn btn-primary"
          style={{ marginTop: "1rem", display: "inline-block" }}
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div
      className="cart-page"
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Giỏ hàng của bạn</h1>

      <div className="admin-card card animate-fade-in">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Giá tổng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={{ width: "80px" }}>
                    <img
                      src={getImageUrl(item.HinhAnh_url || item.image_url)}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", background: "white" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: "30px", textAlign: "center", fontWeight: "600" }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn-icon"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", background: "white" }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleRemove(item)}
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-alt)",
          }}
        >
          <div style={{ marginRight: "2rem", fontSize: "1.25rem" }}>
            Tổng cộng:{" "}
            <strong style={{ color: "var(--primary)" }}>
              {formatPrice(total)}
            </strong>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCheckoutClick}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>

      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            padding: "2rem", textAlign: "center", maxWidth: "480px", width: "90%"
          }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Xác nhận thanh toán</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Quét mã QR bằng điện thoại hoặc nhấn "Xác nhận" để hoàn tất.
            </p>

            <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "12px", display: "inline-block", marginBottom: "1rem" }}>
              <img src={qrCodeUrl} alt="Payment QR Code" style={{ borderRadius: "8px" }} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ borderTop: "1px solid #eee", padding: "1rem 0" }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    <span>{item.name} × {item.quantity}</span>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "bold", borderTop: "1px solid #eee", paddingTop: "0.75rem" }}>
                <span>Tổng cộng:</span>
                <span style={{ color: "var(--primary)" }}>{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginBottom: "0.5rem" }}
              onClick={handleConfirmCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Đang xử lý..." : "✓ Xác nhận thanh toán"}
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ width: "100%" }}
              onClick={() => setShowCheckoutModal(false)}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
