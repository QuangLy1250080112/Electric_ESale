import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/url";
import { Trash2, Minus, Plus, MapPin, Loader } from "lucide-react";
import * as orderService from "../services/orderService";
import * as settingsService from "../services/settingsService";
import "../styles/Admin.css";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Cart() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shopSettings, setShopSettings] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const handleRemove = async (item) => {
    try { removeItem(item.id); } catch { alert("Lỗi khi xóa khỏi giỏ hàng"); }
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty < 1) return;
    updateQuantity(item.id, newQty);
  };

  const handleCheckoutClick = async () => {
    if (items.length === 0) return;
    if (!isLoggedIn) { alert("Vui lòng đăng nhập trước khi thanh toán!"); navigate("/login"); return; }
    setShowCheckoutModal(true);
    setLocationLoading(true);
    setLocationError("");
    try {
      const settings = await settingsService.getShopSettings();
      setShopSettings(settings);
    } catch { setLocationError("Không thể tải cài đặt cửa hàng"); }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationLoading(false); },
        () => { setLocationError("Không thể lấy vị trí. Vui lòng bật GPS."); setLocationLoading(false); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else { setLocationError("Trình duyệt không hỗ trợ GPS"); setLocationLoading(false); }
  };

  const distance = (shopSettings && userLocation)
    ? haversineDistance(userLocation.lat, userLocation.lng, shopSettings.latitude, shopSettings.longitude)
    : 0;
  const shippingFee = shopSettings ? Math.round(distance * shopSettings.shipping_fee_per_km) : 0;
  const grandTotal = total + shippingFee;

  const handleConfirmCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const checkoutItems = items.map((item) => ({ ID_sanpham: item.id, soluong: item.quantity, gia: item.price }));
      const result = await orderService.checkout(checkoutItems);
      clearCart();
      setShowCheckoutModal(false);
      navigate("/checkout", {
        state: {
          orderIds: result.order_ids,
          shopLocation: { lat: shopSettings.latitude, lng: shopSettings.longitude },
          userLocation,
          distance,
          shippingFee,
          grandTotal,
          deliverySecondsPerKm: shopSettings.delivery_seconds_per_km,
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        },
      });
    } catch (error) {
      alert(error.response?.data?.detail || "Có lỗi xảy ra khi thanh toán!");
    } finally { setCheckoutLoading(false); }
  };

  const qrData = JSON.stringify({ items: items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })), total: grandTotal, user: user?.tenTK || "guest" });
  const paymentUrl = `${window.location.origin}/payment-confirm?data=${encodeURIComponent(qrData)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUrl)}`;

  if (items.length === 0) {
    return (
      <div className="cart-page empty" style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Giỏ hàng của bạn</h1>
        <p>Giỏ hàng đang trống</p>
        <Link to="/#products" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>Giỏ hàng của bạn</h1>
      <div className="admin-card card animate-fade-in">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th><th>Tên sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Giá tổng</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} onClick={() => navigate(`/products/${item.id}`)} style={{ cursor: "pointer" }}>
                  <td style={{ width: "80px" }}>
                    <img src={getImageUrl(item.HinhAnh_url || item.image_url)} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                  </td>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button className="btn-icon" onClick={() => handleQuantityChange(item, item.quantity - 1)} disabled={item.quantity <= 1} style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", background: "white" }}><Minus size={14} /></button>
                      <span style={{ minWidth: "30px", textAlign: "center", fontWeight: "600" }}>{item.quantity}</span>
                      <button className="btn-icon" onClick={() => handleQuantityChange(item, item.quantity + 1)} style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "2px 6px", cursor: "pointer", background: "white" }}><Plus size={14} /></button>
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>{formatPrice(item.price * item.quantity)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button className="btn-icon delete" onClick={() => handleRemove(item)} title="Xóa khỏi giỏ hàng"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}>
          <div style={{ marginRight: "2rem", fontSize: "1.25rem" }}>Tổng cộng: <strong style={{ color: "var(--primary)" }}>{formatPrice(total)}</strong></div>
          <button className="btn btn-primary btn-lg" onClick={handleCheckoutClick}>Tiến hành thanh toán</button>
        </div>
      </div>

      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem", maxWidth: "520px", width: "90%" }}>
            <h2 style={{ marginBottom: "0.5rem", textAlign: "center" }}>Xác nhận thanh toán</h2>
            <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem", textAlign: "center" }}>Quét mã QR hoặc nhấn "Xác nhận" để hoàn tất.</p>

            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ background: "#f5f5f5", padding: "0.75rem", borderRadius: "12px", display: "inline-block" }}>
                <img src={qrCodeUrl} alt="Payment QR Code" style={{ borderRadius: "8px", width: "200px" }} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid #eee", padding: "0.75rem 0" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.85rem" }}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #eee", padding: "0.75rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                <span>Tiền hàng:</span><span>{formatPrice(total)}</span>
              </div>
              {locationLoading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#888" }}>
                  <Loader size={14} className="spin-animation" /> Đang lấy vị trí...
                </div>
              ) : locationError ? (
                <div style={{ fontSize: "0.85rem", color: "#e53e3e" }}>{locationError}</div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666", marginBottom: "0.3rem" }}>
                    <span><MapPin size={14} style={{ verticalAlign: "middle" }} /> Khoảng cách:</span>
                    <span>{distance.toFixed(1)} km</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                    <span>Phí vận chuyển:</span><span>{formatPrice(shippingFee)}</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "bold", borderTop: "2px solid var(--primary)", paddingTop: "0.75rem", marginBottom: "1rem" }}>
              <span>Tổng thanh toán:</span>
              <span style={{ color: "var(--primary)" }}>{formatPrice(grandTotal)}</span>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: "100%", marginBottom: "0.5rem" }} onClick={handleConfirmCheckout} disabled={checkoutLoading || locationLoading || !!locationError}>
              {checkoutLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setShowCheckoutModal(false)}>Hủy bỏ</button>
          </div>
        </div>
      )}
    </div>
  );
}
