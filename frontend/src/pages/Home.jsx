import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import * as productService from "../services/productService";
import ProductCard from "./products/ProductCard";
import ProductModal from "./products/ProductModal";
import Loader from "../components/common/Loader";
import { getImageUrl } from "../utils/url";
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Zap,
  Shield,
  Headphones,
  Award,
  Star,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  Clock,
  Flame,
  User2,
} from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();

  // Product data
  const [allProducts, setAllProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [hottestProducts, setHottestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab state: 'newest' | 'hottest' | 'all'
  const [activeTab, setActiveTab] = useState("newest");

  // Pagination
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(0);

  // Search from URL
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [all, newest, hottest] = await Promise.all([
          productService.getProducts({ limit: 100 }),
          productService.getNewestProducts(10),
          productService.getHottestProducts(10),
        ]);
        setAllProducts(all);
        setNewestProducts(newest);
        setHottestProducts(hottest);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearch(searchQuery);
      setSearchParams({ search: searchQuery });
      setActiveTab("all");
      setCurrentPage(0);
    }
  };

  const refreshProducts = async () => {
    try {
      const [all, newest, hottest] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getNewestProducts(10),
        productService.getHottestProducts(10),
      ]);
      setAllProducts(all);
      setNewestProducts(newest);
      setHottestProducts(hottest);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get current product list based on active tab
  const getCurrentProducts = () => {
    let products;
    switch (activeTab) {
      case "newest":
        products = newestProducts;
        break;
      case "hottest":
        products = hottestProducts;
        break;
      case "all":
      default:
        products = allProducts;
        break;
    }

    // Apply search filter
    if (search) {
      products = products.filter((p) =>
        p.tenSP.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return products;
  };

  const currentProducts = getCurrentProducts();
  const totalPages = Math.ceil(currentProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = currentProducts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-pattern"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Hệ thống ESale trực tuyến</span>
          </div>
          <h1>
            Nâng tầm <span className="gradient-text">Công nghệ</span>,<br />
            Vươn xa Trải nghiệm
          </h1>
          <p className="hero-desc">
            Khám phá bộ sưu tập thiết bị điện tử hàng đầu với công nghệ tiên
            tiến nhất. Cam kết chính hãng, giá tốt nhất thị trường.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Sản phẩm</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Khách hàng</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Hài lòng</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-header-centered">
          <span className="section-tag">Giới thiệu</span>
          <h2>
            Chào mừng đến với <span className="gradient-text">ESale</span>
          </h2>
          <p>
            Hệ thống bán hàng trực tuyến hàng đầu chuyên cung cấp các sản phẩm
            điện tử chính hãng
          </p>
        </div>
        <div className="about-grid">
          <div className="about-card glass-card">
            <div className="about-icon">
              <ShoppingBag size={32} />
            </div>
            <h3>Đa dạng sản phẩm</h3>
            <p>
              Hàng trăm sản phẩm điện tử từ các thương hiệu uy tín trong và
              ngoài nước, đáp ứng mọi nhu cầu của bạn.
            </p>
          </div>
          <div className="about-card glass-card">
            <div className="about-icon accent">
              <Zap size={32} />
            </div>
            <h3>Giao hàng nhanh chóng</h3>
            <p>
              Hệ thống vận chuyển nhanh chóng, giao hàng trong vòng 24h cho khu
              vực nội thành.
            </p>
          </div>
          <div className="about-card glass-card">
            <div className="about-icon success">
              <Shield size={32} />
            </div>
            <h3>Bảo hành chính hãng</h3>
            <p>
              Tất cả sản phẩm đều được bảo hành chính hãng, đổi trả trong 30
              ngày nếu có lỗi từ nhà sản xuất.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us-section">
        <div className="section-header-centered">
          <span className="section-tag">Cam kết</span>
          <h2>
            Vì sao chọn <span className="gradient-text">chúng tôi</span>?
          </h2>
          <p>Những giá trị cốt lõi tạo nên sự khác biệt của ESale</p>
        </div>
        <div className="why-us-grid">
          <div className="why-card">
            <div className="why-number">01</div>
            <div className="why-content">
              <h4>
                <Award size={20} /> Chất lượng hàng đầu
              </h4>
              <p>
                Chỉ phân phối sản phẩm chính hãng 100%, nguồn gốc rõ ràng từ các
                nhà cung cấp uy tín.
              </p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-number">02</div>
            <div className="why-content">
              <h4>
                <Star size={20} /> Giá cả cạnh tranh
              </h4>
              <p>
                Cam kết giá tốt nhất thị trường. Hoàn tiền chênh lệch nếu bạn
                tìm thấy giá rẻ hơn.
              </p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-number">03</div>
            <div className="why-content">
              <h4>
                <Headphones size={20} /> Hỗ trợ 24/7
              </h4>
              <p>
                Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
                qua đa kênh liên lạc.
              </p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-number">04</div>
            <div className="why-content">
              <h4>
                <Shield size={20} /> Thanh toán an toàn
              </h4>
              <p>
                Hệ thống thanh toán được mã hóa SSL, đảm bảo an toàn tuyệt đối
                cho mọi giao dịch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Introduction */}
      <section className="owner-section">
        <div className="owner-card glass-card">
          <div className="owner-avatar">
            <User2 size={64} />
          </div>
          <div className="owner-info">
            <span className="section-tag">Về chủ cửa hàng</span>
            <h3>Nhóm quản lí ESale</h3>
            <p className="owner-title">
              Nhóm sáng lập & Giám đốc điều hành ESale
            </p>
            <p className="owner-bio">
              Với hơn 5 năm kinh nghiệm trong lĩnh vực thương mại điện tử và đam
              mê với công nghệ, chúng tôi sáng lập ESale với sứ mệnh mang đến
              cho khách hàng Việt Nam những sản phẩm điện tử chất lượng nhất với
              giá cả phải chăng nhất. Mỗi sản phẩm tại ESale đều được tôi đích
              thân kiểm tra và tuyển chọn kỹ lưỡng.
            </p>
            <div className="owner-quote">
              <em>
                "Sự hài lòng của khách hàng là thước đo thành công của chúng
                tôi."
              </em>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="section-header-centered">
          <span className="section-tag">Sản phẩm</span>
          <h2>
            Khám phá <span className="gradient-text">sản phẩm</span> của chúng
            tôi
          </h2>
          <p>Thiết bị điện tử chính hãng, giá tốt nhất thị trường</p>
        </div>

        {/* Toolbar */}
        <div className="products-toolbar-home">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "newest" ? "active" : ""}`}
              onClick={() => handleTabChange("newest")}
            >
              <Clock size={16} />
              <span>Mới nhất</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "hottest" ? "active" : ""}`}
              onClick={() => handleTabChange("hottest")}
            >
              <Flame size={16} />
              <span>Hot nhất</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              <Layers size={16} />
              <span>Tất cả</span>
            </button>
          </div>

          {user?.is_admin && (
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              <span>Thêm sản phẩm</span>
            </button>
          )}
        </div>

        {/* Search filter indicator */}
        {search && (
          <div className="search-filter-info">
            Đang lọc: <strong>"{search}"</strong>
            <button
              onClick={() => {
                setSearch("");
                setSearchParams({});
              }}
              className="clear-filter"
            >
              ✕ Xóa
            </button>
            {" — "} Tìm thấy <strong>{currentProducts.length}</strong> sản phẩm
          </div>
        )}

        {/* Product Grid */}
        <div className="products-grid-home">
          {loading ? (
            <div className="loading-center">
              <Loader />
            </div>
          ) : error ? (
            <div className="error-center">
              <p>Đã xảy ra lỗi: {error}</p>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </button>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="empty-center">
              <Sparkles size={48} className="empty-icon" />
              <p>Không tìm thấy sản phẩm nào.</p>
            </div>
          ) : (
            <div className="product-grid">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.ID_sanpham || product.id}
                  product={product}
                  onDelete={refreshProducts}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={20} />
              <span>Trước</span>
            </button>
            <div className="pagination-info">
              Trang <strong>{currentPage + 1}</strong> /{" "}
              <strong>{totalPages}</strong>
            </div>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
            >
              <span>Sau</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Category CTA */}
        <div className="category-cta">
          <p>Không có sản phẩm bạn tìm?</p>
          <Link to="/categories" className="btn btn-secondary btn-cta">
            <Layers size={18} />
            <span>Đến trang danh mục</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={refreshProducts}
      />
    </div>
  );
}
