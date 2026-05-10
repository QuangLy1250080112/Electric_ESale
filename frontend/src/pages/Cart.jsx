import { useCart } from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/url";
import { Trash2 } from "lucide-react";
import * as productService from "../services/productService";
import "../styles/Admin.css"; // Reuse admin table styles

export default function Cart() {
  const { items, total, removeItem } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (item) => {
    try {
      // Fetch current product to get latest stock
      const product = await productService.getProduct(item.id);
      const currentStock = product.soluong || 0;

      // Add back the removed quantity to stock
      await productService.updateProduct(item.id, {
        soluong: currentStock + item.quantity,
      });

      // Remove from local cart
      removeItem(item.id);
      alert("Đã xóa khỏi giỏ hàng và hoàn trả số lượng!");
    } catch (err) {
      alert("Lỗi khi xóa khỏi giỏ hàng");
    }
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

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
                  <td>{item.quantity}</td>
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
            onClick={() => alert("Chức năng thanh toán đang được phát triển!")}
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
