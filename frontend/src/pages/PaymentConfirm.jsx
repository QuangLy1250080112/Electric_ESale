import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import * as productService from "../services/productService";

export default function PaymentConfirm() {
  const [searchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const cartParam = searchParams.get("cart");
      if (cartParam) {
        setCartItems(JSON.parse(decodeURIComponent(cartParam)));
      }
    } catch (e) {
      console.error("Lỗi khi đọc giỏ hàng", e);
    }
  }, [searchParams]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (p) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Create orders and deduct stock
      for (const item of cartItems) {
        // Lấy sản phẩm hiện tại để biết số lượng kho
        const product = await productService.getProduct(item.id);
        const currentStock = product.soluong || 0;
        
        if (currentStock >= item.quantity) {
          await productService.updateProduct(item.id, {
            soluong: currentStock - item.quantity
          });
        }
        // Ideally we would also call an API to create 'Donhang' here
      }

      setSuccess(true);
      
      // Notify original tab
      localStorage.setItem("payment_success", Date.now().toString());
    } catch (error) {
      alert("Có lỗi xảy ra khi thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: "4rem", color: "green", marginBottom: "1rem" }}>✓</div>
        <h2>Thanh toán thành công!</h2>
        <p style={{ color: "#666", marginTop: "1rem" }}>Bạn có thể đóng cửa sổ này và quay lại thiết bị của bạn.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Không tìm thấy thông tin thanh toán.</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Xác nhận thanh toán</h2>
        
        <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>{item.name} x {item.quantity}</span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", marginBottom: "2rem" }}>
          <span>Tổng cộng:</span>
          <strong style={{ color: "var(--primary, #2563eb)" }}>{formatPrice(total)}</strong>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={loading}
          style={{ 
            width: "100%", padding: "1rem", background: "var(--primary, #2563eb)", 
            color: "white", border: "none", borderRadius: "8px", 
            fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold"
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>
        
        <button 
          onClick={() => window.close()}
          style={{ 
            width: "100%", padding: "1rem", background: "transparent", 
            color: "#666", border: "none", marginTop: "0.5rem",
            cursor: "pointer"
          }}
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
