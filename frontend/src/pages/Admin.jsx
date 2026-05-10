import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  List,
  Users,
  Upload,
  X,
  Search,
  Edit,
  Trash2,
  Filter
} from "lucide-react";
import * as productService from "../services/productService";
import { getImageUrl } from "../utils/url";
import "../styles/Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add-product");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cats, sups] = await Promise.all([
        productService.getCategories(),
        productService.getSuppliers(),
      ]);
      setCategories(cats);
      setSuppliers(sups);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Quản trị hệ thống</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === "add-product" ? "active" : ""}`}
            onClick={() => setActiveTab("add-product")}
          >
            <Plus size={20} />
            <span>Thêm sản phẩm</span>
          </button>
          <button
            className={`sidebar-link ${activeTab === "manage-products" ? "active" : ""}`}
            onClick={() => setActiveTab("manage-products")}
          >
            <Package size={20} />
            <span>Quản lý sản phẩm</span>
          </button>
          <button
            className={`sidebar-link ${activeTab === "suppliers" ? "active" : ""}`}
            onClick={() => setActiveTab("suppliers")}
          >
            <List size={20} />
            <span>Quản lí nhà cung cấp</span>
          </button>
          <button
            className={`sidebar-link ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            <Users size={20} />
            <span>Quản lí tài khoản</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content-area">
        {activeTab === "add-product" && (
          <AddProductTab categories={categories} suppliers={suppliers} />
        )}
        {activeTab === "manage-products" && (
          <ManageProductsTab categories={categories} suppliers={suppliers} />
        )}
        {activeTab === "suppliers" && (
          <ManageSuppliersTab categories={categories} />
        )}
        {activeTab === "accounts" && <ManageAccountsTab />}
      </main>
    </div>
  );
}

// ================= ADD PRODUCT TAB =================
function AddProductTab({ categories, suppliers }) {
  const [formData, setFormData] = useState({
    tenSP: "",
    mota: "",
    gia: "",
    soluong: "",
    ID_danhmuc: 1,
    supplier_ID: null,
  });
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (categories.length > 0 && formData.ID_danhmuc === 1)
      setFormData((p) => ({ ...p, ID_danhmuc: categories[0].ID_danhmuc }));
  }, [categories]);

  const filteredSuppliers = suppliers.filter((s) =>
    s.tenNhaCungCap.toLowerCase().includes(supplierSearch.toLowerCase()),
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPreviews((prev) => [
        ...prev,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
      setImages((prev) => [...prev, ...files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_ID)
      return alert("Vui lòng chọn nhà cung cấp từ danh sách");
    setLoading(true);
    try {
      const product = await productService.addProduct({
        ...formData,
        gia: parseFloat(formData.gia),
        soluong: parseInt(formData.soluong || 0),
      });
      if (images.length > 0) {
        for (const img of images)
          await productService.addProductImage(product.ID_sanpham, img);
      }
      alert("Thêm sản phẩm thành công!");
      setFormData({
        tenSP: "",
        mota: "",
        gia: "",
        soluong: "",
        ID_danhmuc: categories[0]?.ID_danhmuc || 1,
        supplier_ID: null,
      });
      setSupplierSearch("");
      setImages([]);
      setPreviews([]);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card card animate-fade-in">
      <div className="card-header">
        <h3>Thêm sản phẩm mới</h3>
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Tên sản phẩm</label>
            <input
              className="form-control"
              value={formData.tenSP}
              onChange={(e) =>
                setFormData({ ...formData, tenSP: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giá bán (VNĐ)</label>
            <input
              className="form-control"
              type="number"
              value={formData.gia}
              onChange={(e) =>
                setFormData({ ...formData, gia: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số lượng</label>
            <input
              className="form-control"
              type="number"
              value={formData.soluong}
              onChange={(e) =>
                setFormData({ ...formData, soluong: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <select
              className="form-control"
              value={formData.ID_danhmuc}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ID_danhmuc: parseInt(e.target.value),
                })
              }
            >
              {categories.map((cat) => (
                <option key={cat.ID_danhmuc} value={cat.ID_danhmuc}>
                  {cat.tenDanhMuc}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nhà cung cấp (Gõ để tìm kiếm)</label>
            <input
              className="form-control"
              value={supplierSearch}
              onChange={(e) => {
                setSupplierSearch(e.target.value);
                setShowSuppliers(true);
                setFormData({ ...formData, supplier_ID: null });
              }}
              onFocus={() => setShowSuppliers(true)}
              onBlur={() => setTimeout(() => setShowSuppliers(false), 200)}
              required
              placeholder="Nhập tên nhà cung cấp..."
            />
            {showSuppliers && (
              <div className="autocomplete-dropdown">
                {filteredSuppliers.map((sup) => (
                  <div
                    key={sup.ID_NhaCungCap}
                    className="autocomplete-item"
                    onClick={() => {
                      setSupplierSearch(sup.tenNhaCungCap);
                      setFormData({
                        ...formData,
                        supplier_ID: sup.ID_NhaCungCap,
                      });
                      setShowSuppliers(false);
                    }}
                  >
                    {sup.tenNhaCungCap}
                  </div>
                ))}
                {filteredSuppliers.length === 0 && (
                  <div className="autocomplete-item text-muted">
                    Không tìm thấy
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="form-group full-width">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.mota}
              onChange={(e) =>
                setFormData({ ...formData, mota: e.target.value })
              }
            />
          </div>
        </div>

        <div className="image-upload-section mt-4">
          <label className="form-label">Hình ảnh</label>
          <div className="admin-image-grid">
            {previews.map((src, i) => (
              <div key={i} className="image-preview-item">
                <img src={src} alt="Preview" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => {
                    setPreviews((p) => p.filter((_, j) => j !== i));
                    setImages((p) => p.filter((_, j) => j !== i));
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-image-placeholder"
              onClick={() => fileInputRef.current.click()}
            >
              <Upload size={24} />
              <span>Tải ảnh</span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ================= MANAGE PRODUCTS TAB =================
function ManageProductsTab({ categories, suppliers }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    supplier_name: "",
    min_price: "",
    max_price: "",
    date_from: "",
    date_to: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      setProducts(await productService.getProducts({ ...activeFilters, limit: 100 }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-card card animate-fade-in">
      <div className="admin-toolbar" style={{flexDirection: 'column', alignItems: 'stretch'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3>Quản lý sản phẩm</h3>
          <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Bộ lọc
          </button>
        </div>
        
        {showFilters && (
          <div className="filters-panel" style={{marginTop: '1rem', padding: '1rem', background: 'var(--bg-alt)', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
            <div>
              <label>Tên sản phẩm</label>
              <input className="form-control" value={filters.search} onChange={e=>setFilters({...filters, search: e.target.value})} placeholder="Nhập tên..." />
            </div>
            <div>
              <label>Tên nhà cung cấp</label>
              <input className="form-control" value={filters.supplier_name} onChange={e=>setFilters({...filters, supplier_name: e.target.value})} placeholder="Tên nhà cung cấp..." />
            </div>
            <div>
              <label>Giá tối thiểu</label>
              <input className="form-control" type="number" value={filters.min_price} onChange={e=>setFilters({...filters, min_price: e.target.value})} />
            </div>
            <div>
              <label>Giá tối đa</label>
              <input className="form-control" type="number" value={filters.max_price} onChange={e=>setFilters({...filters, max_price: e.target.value})} />
            </div>
            <div>
              <label>Từ ngày</label>
              <input className="form-control" type="date" value={filters.date_from} onChange={e=>setFilters({...filters, date_from: e.target.value})} />
            </div>
            <div>
              <label>Đến ngày</label>
              <input className="form-control" type="date" value={filters.date_to} onChange={e=>setFilters({...filters, date_to: e.target.value})} />
            </div>
            <div style={{gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem'}}>
              <button className="btn btn-secondary" onClick={() => setFilters({search: "", supplier_name: "", min_price: "", max_price: "", date_from: "", date_to: ""})}>Xóa bộ lọc</button>
              <button className="btn btn-primary" onClick={fetchProducts}><Search size={16} /> Áp dụng</button>
            </div>
          </div>
        )}
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.ID_sanpham}
                onClick={() => navigate(`/products/${p.ID_sanpham}`)}
              >
                <td style={{ width: "60px" }}>
                  <img
                    src={getImageUrl(p.HinhAnh_url)}
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </td>
                <td>{p.tenSP}</td>
                <td>{p.gia?.toLocaleString()}đ</td>
                <td>{p.soluong || 0}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="action-buttons">
                    <button
                      className="btn-icon delete"
                      onClick={async () => {
                        if (window.confirm("Xóa sản phẩm này?")) {
                          await productService.deleteProduct(p.ID_sanpham);
                          fetchProducts();
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= MANAGE SUPPLIERS TAB =================
function ManageSuppliersTab({ categories }) {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    tenNhaCungCap: "",
    sdt: "",
    email: "",
    ID_danhmuc: 1,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);
  const fetchSuppliers = async () =>
    setSuppliers(await productService.getSuppliers());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.createSupplier(formData);
      alert("Đã thêm nhà cung cấp");
      fetchSuppliers();
    } catch (err) {
      alert("Lỗi");
    }
  };

  return (
    <div className="admin-card card animate-fade-in">
      <div className="admin-toolbar">
        <h3>Quản lí nhà cung cấp</h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="form-grid">
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Tên nhà cung cấp"
              value={formData.tenNhaCungCap}
              onChange={(e) =>
                setFormData({ ...formData, tenNhaCungCap: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Số điện thoại"
              value={formData.sdt}
              onChange={(e) =>
                setFormData({ ...formData, sdt: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>
        <div
          className="form-actions"
          style={{ marginTop: "1rem", paddingTop: 0, border: "none" }}
        >
          <button type="submit" className="btn btn-primary">
            Thêm mới
          </button>
        </div>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên NCC</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.ID_NhaCungCap}>
                <td>{s.tenNhaCungCap}</td>
                <td>{s.sdt}</td>
                <td>{s.email}</td>
                <td>
                  <button
                    className="btn-icon delete"
                    onClick={async () => {
                      if (window.confirm("Xóa?")) {
                        await productService.deleteSupplier(s.ID_NhaCungCap);
                        fetchSuppliers();
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= MANAGE ACCOUNTS TAB =================
function ManageAccountsTab() {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    tenTK: "",
    matkhau: "",
    email: "",
    role: "user" // user, staff, admin
  });

  useEffect(() => {
    fetchAccounts();
  }, []);
  const fetchAccounts = async () =>
    setAccounts(await productService.getAccounts());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        tenTK: formData.tenTK,
        matkhau: formData.matkhau,
        email: formData.email,
        is_staff: formData.role === 'staff' || formData.role === 'admin',
        is_admin: formData.role === 'admin'
      }
      await productService.createAccount(submitData);
      alert("Đã thêm tài khoản");
      fetchAccounts();
    } catch (err) {
      alert("Lỗi");
    }
  };

  return (
    <div className="admin-card card animate-fade-in">
      <div className="admin-toolbar">
        <h3>Quản lí tài khoản</h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="admin-form"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="form-grid">
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Tên tài khoản"
              value={formData.tenTK}
              onChange={(e) =>
                setFormData({ ...formData, tenTK: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Mật khẩu"
              type="password"
              value={formData.matkhau}
              onChange={(e) =>
                setFormData({ ...formData, matkhau: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <select 
              className="form-control" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Khách hàng (User)</option>
              <option value="staff">Nhân viên (Staff)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>
        </div>
        <div
          className="form-actions"
          style={{ marginTop: "1rem", paddingTop: 0, border: "none" }}
        >
          <button type="submit" className="btn btn-primary">
            Tạo tài khoản
          </button>
        </div>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.uID}>
                <td>{a.tenTK}</td>
                <td>{a.email}</td>
                <td>{a.is_admin ? "Admin" : a.is_staff ? "Staff" : "User"}</td>
                <td>
                  <button
                    className="btn-icon delete"
                    onClick={async () => {
                      if (window.confirm("Xóa?")) {
                        await productService.deleteAccount(a.uID);
                        fetchAccounts();
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
