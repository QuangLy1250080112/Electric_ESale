import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as productService from "../services/productService";
import { getImageUrl } from "../utils/url";
import Loader from "../components/common/Loader";
import ProductModal from "./products/ProductModal";
import {
  Layers,
  Upload,
  Image,
  ArrowRight,
  Plus,
  X,
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../styles/Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ tenDanhMuc: "", mota: "" });
  const [newCatImage, setNewCatImage] = useState(null);

  // Products and Filter State
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const ITEMS_PER_PAGE = 25;
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    supplierName: "",
  });

  const fetchProductsTimeout = useRef(null);

  useEffect(() => {
    fetchCategories();
    productService.getSuppliers().then(setSuppliers).catch(console.error);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const fetchProducts = useCallback(
    async (page = 0, currentFilters = filters) => {
      try {
        setLoadingProducts(true);
        const data = await productService.getProducts({
          skip: page * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE + 1,
          search: currentFilters.search || undefined,
          ID_danhmuc: currentFilters.categoryId || undefined,
          min_price: currentFilters.minPrice || undefined,
          max_price: currentFilters.maxPrice || undefined,
          supplier_name: currentFilters.supplierName || undefined,
        });
        if (data.length > ITEMS_PER_PAGE) {
          setHasNextPage(true);
          setProducts(data.slice(0, ITEMS_PER_PAGE));
        } else {
          setHasNextPage(false);
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (fetchProductsTimeout.current)
      clearTimeout(fetchProductsTimeout.current);
    fetchProductsTimeout.current = setTimeout(() => {
      fetchProducts(currentPage, filters);
    }, 500);
    return () => clearTimeout(fetchProductsTimeout.current);
  }, [filters, currentPage, fetchProducts]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (categoryId, file) => {
    try {
      setUploadingId(categoryId);
      await productService.uploadCategoryImage(categoryId, file);
      await fetchCategories();
    } catch (err) {
      alert("Lỗi khi tải ảnh: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploadingId(null);
    }
  };

  const onFileSelect = (categoryId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) handleImageUpload(categoryId, file);
    };
    input.click();
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const created = await productService.createCategory({
        tenDanhMuc: newCat.tenDanhMuc,
        mota: newCat.mota,
      });
      if (newCatImage) {
        await productService.uploadCategoryImage(
          created.ID_danhmuc,
          newCatImage,
        );
      }
      setShowAddModal(false);
      setNewCat({ tenDanhMuc: "", mota: "" });
      setNewCatImage(null);
      fetchCategories();
      alert("Đã thêm danh mục thành công!");
    } catch (err) {
      alert("Lỗi khi thêm danh mục: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="categories-loading">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="categories-error">
        <p>Đã xảy ra lỗi: {error}</p>
        <button
          className="btn btn-secondary"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div className="categories-page">
      <div
        className="categories-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="categories-header-icon"
            style={{ margin: 0, marginBottom: "1rem" }}
          >
            <Layers size={32} />
          </div>
          <h1 style={{ margin: 0 }}>Danh mục sản phẩm</h1>
        </div>
        {user?.is_admin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          >
            <Plus size={20} /> Thêm danh mục
          </button>
        )}
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div
            key={cat.ID_danhmuc}
            className="category-box"
            onClick={() => navigate(`/categories/${cat.ID_danhmuc}`)}
          >
            <div className="category-image-wrapper">
              {cat.anh_url ? (
                <img
                  src={getImageUrl(cat.anh_url)}
                  alt={cat.tenDanhMuc}
                  className="category-image"
                />
              ) : (
                <div className="category-placeholder">
                  <Image size={48} />
                </div>
              )}
              <div className="category-overlay">
                <ArrowRight size={24} />
              </div>
            </div>

            <div className="category-content">
              <h3>{cat.tenDanhMuc}</h3>
              {cat.mota && <p className="category-desc">{cat.mota}</p>}

              {user?.is_admin && (
                <button
                  className="btn btn-secondary btn-upload-cat"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(cat.ID_danhmuc);
                  }}
                  disabled={uploadingId === cat.ID_danhmuc}
                >
                  <Upload size={14} />
                  <span>
                    {uploadingId === cat.ID_danhmuc ? "Đang tải..." : "Đổi ảnh"}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="categories-empty">
          <Layers size={64} className="empty-icon" />
          <p>Chưa có danh mục nào được tạo.</p>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      <div className="products-section" style={{ marginTop: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.8rem",
              fontWeight: 800,
            }}
          >
            <Package size={28} color="var(--primary)" />
            Tất cả sản phẩm
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user?.is_admin && (
              <button
                className="btn btn-primary"
                onClick={() => setIsProductModalOpen(true)}
              >
                <Plus size={18} /> Thêm sản phẩm
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} /> Lọc sản phẩm
            </button>
          </div>
        </div>

        {showFilters && (
          <div
            className="filter-panel glass-card"
            style={{
              padding: "1.5rem",
              marginBottom: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div className="form-group">
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Tìm kiếm sản phẩm
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên sản phẩm..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Danh mục
              </label>
              <select
                className="form-control"
                value={filters.categoryId}
                onChange={(e) =>
                  handleFilterChange("categoryId", e.target.value)
                }
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.ID_danhmuc} value={c.ID_danhmuc}>
                    {c.tenDanhMuc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Nhà cung cấp
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm nhà cung cấp..."
                  value={filters.supplierName}
                  onChange={(e) => {
                    handleFilterChange("supplierName", e.target.value);
                    setShowSupplierDropdown(true);
                  }}
                  onFocus={() => setShowSupplierDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSupplierDropdown(false), 200)
                  }
                />
                {showSupplierDropdown && (
                  <div
                    className="autocomplete-dropdown"
                    style={{ maxHeight: "180px", overflowY: "auto" }}
                  >
                    {suppliers
                      .filter((s) =>
                        s.tenNhaCungCap
                          .toLowerCase()
                          .includes(filters.supplierName.toLowerCase()),
                      )
                      .map((s) => (
                        <div
                          key={s.ID_NhaCungCap}
                          className="autocomplete-item"
                          onClick={() =>
                            handleFilterChange("supplierName", s.tenNhaCungCap)
                          }
                        >
                          {s.tenNhaCungCap}
                        </div>
                      ))}
                    {suppliers.filter((s) =>
                      s.tenNhaCungCap
                        .toLowerCase()
                        .includes(filters.supplierName.toLowerCase()),
                    ).length === 0 && (
                      <div
                        className="autocomplete-item"
                        style={{ color: "#94a3b8" }}
                      >
                        Không tìm thấy
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label
                style={{
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Khoảng giá (VNĐ)
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="number"
                  className="form-control"
                  placeholder="Từ..."
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#94a3b8",
                  }}
                >
                  -
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Đến..."
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {loadingProducts ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <div className="categories-empty">
            <Package size={48} className="empty-icon" />
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        ) : (
          <div className="category-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {products.map((product) => {
              const name = product.tenSP || product.name;
              const price = product.gia || product.price;
              const pid = product.ID_sanpham || product.id;
              const imageUrl = getImageUrl(
                product.HinhAnh_url || product.image_url,
              );
              return (
                <div
                  key={pid}
                  className="category-product-card"
                  onClick={() => navigate(`/products/${pid}`)}
                >
                  <div className="cat-product-image">
                    <img src={imageUrl} alt={name} loading="lazy" />
                  </div>
                  <div className="cat-product-info">
                    <h3 className="cat-product-name">{name}</h3>
                    <p className="cat-product-price">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {(currentPage > 0 || hasNextPage) && (
          <div
            className="pagination-controls"
            style={{
              marginTop: "3rem",
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-secondary"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ 
              display: 'inline-flex', width: '32px', height: '32px', 
              alignItems: 'center', justifyContent: 'center', 
              border: '2px solid var(--primary)', borderRadius: '6px', 
              backgroundColor: 'var(--primary)', color: 'white', fontWeight: 'bold'
            }}>
              {currentPage + 1}
            </span>
            <button
              className="btn btn-secondary"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h3>Thêm danh mục mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={handleAddCategory}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label>Tên danh mục</label>
                <input
                  className="form-control"
                  value={newCat.tenDanhMuc}
                  onChange={(e) =>
                    setNewCat({ ...newCat, tenDanhMuc: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Mô tả</label>
                <textarea
                  className="form-control"
                  value={newCat.mota}
                  onChange={(e) =>
                    setNewCat({ ...newCat, mota: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Ảnh đại diện (tùy chọn)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setNewCatImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
              >
                Tạo danh mục
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onRefresh={() => fetchProducts(currentPage, filters)}
      />
    </div>
  );
}
