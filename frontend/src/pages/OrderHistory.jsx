import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Package } from "lucide-react";
import * as orderService from "../services/orderService";
import { getImageUrl } from "../utils/url";
import Loader from "../components/common/Loader";
import "../styles/OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    <div className="order-history-page">
      <div className="order-history-header">
        <Package size={28} />
        <h1>Đơn hàng của tôi</h1>
      </div>

      {orders.length === 0 ? (
        <div className="order-empty-state">
          <Package size={48} color="#94a3b8" />
          <p>Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="order-history-card card animate-fade-in">
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
                        className="order-product-img"
                      />
                    </td>
                    <td>
                      <Link to={`/products/${order.ID_sanpham}`} className="order-product-link">
                        {order.tenSP || `Sản phẩm #${order.ID_sanpham}`}
                      </Link>
                    </td>
                    <td>{order.soluong}</td>
                    <td>{formatPrice(order.gia)}</td>
                    <td style={{ fontWeight: "bold" }}>
                      {formatPrice(order.gia * order.soluong)}
                    </td>
                    <td className="order-date-cell">
                      {formatDate(order.thoigiantao)}
                    </td>
                    <td>
                      {order.has_review ? (
                        <div className="order-review-stars">
                          {[1,2,3,4,5].map(s => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= order.review_rating ? "#f59e0b" : "transparent"}
                              color={s <= order.review_rating ? "#f59e0b" : "#d1d5db"}
                            />
                          ))}
                        </div>
                      ) : (
                        <Link
                          to={`/products/${order.ID_sanpham}#reviews`}
                          className="order-no-review-link"
                        >
                          Bạn chưa đánh giá
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
