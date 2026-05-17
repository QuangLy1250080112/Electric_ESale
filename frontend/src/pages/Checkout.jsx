import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package, CheckCircle, Truck } from "lucide-react";
import * as orderService from "../services/orderService";
import "leaflet/dist/leaflet.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [step, setStep] = useState(0); // 0=receiving, 1=confirmed, 2=delivering, 3=done
  const [progress, setProgress] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const bikeMarkerRef = useRef(null);

  const formatPrice = (p) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  useEffect(() => {
    if (!state) { navigate("/cart"); return; }

    // Step 0: Receiving (5 seconds)
    const t1 = setTimeout(() => setStep(1), 5000);
    // Step 1: Confirmed (shown briefly, then auto-advance)
    const t2 = setTimeout(() => setStep(2), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [state, navigate]);

  // Step 2: Delivering with map animation
  useEffect(() => {
    if (step !== 2 || !state) return;
    let intervalId = null;

    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const container = document.getElementById("delivery-map");
      if (!container || mapInstanceRef.current) return;

      const shopLat = state.shopLocation.lat, shopLng = state.shopLocation.lng;
      const userLat = state.userLocation.lat, userLng = state.userLocation.lng;

      const map = L.map(container).fitBounds([[shopLat, shopLng], [userLat, userLng]], { padding: [50, 50] });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OSM" }).addTo(map);
      mapInstanceRef.current = map;

      const redIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
      });
      L.marker([shopLat, shopLng], { icon: redIcon }).addTo(map).bindPopup("Cửa hàng ESale");
      L.marker([userLat, userLng]).addTo(map).bindPopup("Vị trí của bạn");
      L.polyline([[shopLat, shopLng], [userLat, userLng]], { color: "#2563eb", weight: 3, dashArray: "10,10" }).addTo(map);

      const greenIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41],
      });
      const bike = L.marker([shopLat, shopLng], { icon: greenIcon }).addTo(map).bindPopup("🏍️ Shipper");
      bikeMarkerRef.current = bike;

      const totalTime = state.distance * (state.deliverySecondsPerKm || 5) * 1000;
      const fps = 30;
      const totalFrames = Math.max(Math.round((totalTime / 1000) * fps), 1);
      let frame = 0;

      intervalId = setInterval(() => {
        frame++;
        const t = Math.min(frame / totalFrames, 1);
        const lat = shopLat + (userLat - shopLat) * t;
        const lng = shopLng + (userLng - shopLng) * t;
        bike.setLatLng([lat, lng]);
        setProgress(Math.round(t * 100));
        if (t >= 1) {
          clearInterval(intervalId);
          if (state.orderIds) {
            Promise.all(state.orderIds.map((id) => orderService.updateOrderStatus(id, "completed")))
              .then(() => setStep(3)).catch(() => setStep(3));
          } else { setStep(3); }
        }
      }, 1000 / fps);
    });

    return () => { if (intervalId) clearInterval(intervalId); };
  }, [step, state]);

  if (!state) return null;

  const steps = [
    { icon: <Package size={28} />, label: "Đang tiếp nhận đơn", desc: "Cửa hàng đang xử lý đơn hàng của bạn..." },
    { icon: <CheckCircle size={28} />, label: "Đã xác nhận đơn hàng", desc: "Đơn hàng đã được xác nhận thành công!" },
    { icon: <Truck size={28} />, label: "Đang giao hàng", desc: `Shipper đang trên đường đến (${state.distance?.toFixed(1)} km)` },
    { icon: <CheckCircle size={28} />, label: "Giao hàng thành công!", desc: "Đơn hàng đã được giao tới bạn." },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Theo dõi đơn hàng</h1>

      {/* Progress Steps */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "20px", left: "10%", right: "10%", height: "3px", background: "#e2e8f0", zIndex: 0 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #2563eb)", width: `${Math.min((step / 3) * 100, 100)}%`, transition: "width 1s ease" }} />
        </div>
        {steps.map((s, i) => (
          <div key={i} style={{ textAlign: "center", zIndex: 1, flex: 1 }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem",
              background: step >= i ? "linear-gradient(135deg, #10b981, #2563eb)" : "#e2e8f0",
              color: step >= i ? "white" : "#94a3b8", transition: "all 0.5s ease", boxShadow: step === i ? "0 0 20px rgba(37,99,235,0.4)" : "none",
            }}>{s.icon}</div>
            <div style={{ fontSize: "0.75rem", fontWeight: step >= i ? 600 : 400, color: step >= i ? "#1e293b" : "#94a3b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Current Step Animation Box */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem",
        border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center",
      }}>
        {step === 0 && (
          <div className="animate-fade-in">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }} className="pulse-animation">📦</div>
            <h3>Đang tiếp nhận đơn hàng...</h3>
            <p style={{ color: "#666" }}>Vui lòng chờ trong giây lát</p>
            <div style={{ width: "200px", height: "4px", background: "#e2e8f0", borderRadius: "2px", margin: "1rem auto", overflow: "hidden" }}>
              <div className="loading-bar" />
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h3 style={{ color: "#10b981" }}>Đã xác nhận đơn hàng!</h3>
            <p style={{ color: "#666" }}>Chuẩn bị giao hàng...</p>
          </div>
        )}
        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🏍️</div>
            <h3>Đơn hàng đang được giao tới bạn</h3>
            <p style={{ color: "#666", marginBottom: "1rem" }}>Tiến trình: {progress}%</p>
            <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #2563eb)", width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
            <div id="delivery-map" style={{ height: "350px", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
          </div>
        )}
        {step === 3 && (
          <div className="animate-fade-in">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h3 style={{ color: "#10b981" }}>Giao hàng thành công!</h3>
            <p style={{ color: "#666", marginBottom: "1rem" }}>Cảm ơn bạn đã mua hàng. Bạn có thể đánh giá sản phẩm ngay bây giờ.</p>
            <button className="btn btn-primary" onClick={() => navigate("/orders")} style={{ padding: "0.75rem 2rem" }}>
              Xem lịch sử đơn hàng
            </button>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
        <h4 style={{ marginBottom: "1rem" }}>Chi tiết đơn hàng</h4>
        {state.items?.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            <span>{item.name} × {item.quantity}</span>
            <strong>{formatPrice(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #eee", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#666" }}>
            <span>Phí vận chuyển ({state.distance?.toFixed(1)} km):</span>
            <span>{formatPrice(state.shippingFee)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: "bold", marginTop: "0.5rem" }}>
            <span>Tổng thanh toán:</span>
            <span style={{ color: "var(--primary)" }}>{formatPrice(state.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
