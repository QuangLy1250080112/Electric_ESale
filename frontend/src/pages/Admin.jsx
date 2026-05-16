import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
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
  Filter,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";
import * as productService from "../services/productService";
import * as orderService from "../services/orderService";
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
            <span>Quản lý nhà cung cấp</span>
          </button>
          <button
            className={`sidebar-link ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            <Users size={20} />
            <span>Quản lý tài khoản</span>
          </button>
          <button
            className={`sidebar-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag size={20} />
            <span>Quản lý đơn hàng</span>
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
        {activeTab === "orders" && <ManageOrdersTab />}
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

  const [excelData, setExcelData] = useState([]);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const excelInputRef = useRef(null);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const mapped = data.map((row, idx) => ({
          id: idx,
          tenSP: row.TenSP || "",
          gia: row.Gia || 0,
          soluong: row.Soluong || 0,
          danhmuc: row.Danhmuc || "",
          nhacungcap: row.Nhacungcap || "",
          mota: row.Mota || "",
          image: null,
          preview: null,
        }));
        setExcelData(mapped);
        setShowExcelModal(true);
      } catch (err) {
        alert("Lỗi khi đọc file Excel!");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleExcelSubmit = async (finalData) => {
    for (const row of finalData) {
      if (!row.tenSP) return alert("Thiếu tên sản phẩm ở một số dòng");
      const cat = categories.find((c) => c.tenDanhMuc.toLowerCase() === String(row.danhmuc).toLowerCase());
      const sup = suppliers.find((s) => s.tenNhaCungCap.toLowerCase() === String(row.nhacungcap).toLowerCase());
      if (!cat) return alert(`Danh mục "${row.danhmuc}" không tồn tại ở dòng có SP: ${row.tenSP}`);
      if (!sup) return alert(`Nhà cung cấp "${row.nhacungcap}" không tồn tại ở dòng có SP: ${row.tenSP}`);
    }

    setLoading(true);
    try {
      for (const row of finalData) {
        const cat = categories.find((c) => c.tenDanhMuc.toLowerCase() === String(row.danhmuc).toLowerCase());
        const sup = suppliers.find((s) => s.tenNhaCungCap.toLowerCase() === String(row.nhacungcap).toLowerCase());

        const product = await productService.addProduct({
          tenSP: row.tenSP,
          gia: parseFloat(row.gia),
          soluong: parseInt(row.soluong),
          ID_danhmuc: cat.ID_danhmuc,
          supplier_ID: sup.ID_NhaCungCap,
          mota: row.mota,
        });

        if (row.image) {
          await productService.addProductImage(product.ID_sanpham, row.image);
        }
      }
      alert("Nhập dữ liệu thành công!");
      setShowExcelModal(false);
      setExcelData([]);
    } catch (err) {
      alert("Lỗi khi nhập liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Thêm sản phẩm mới</h3>
        <div>
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            ref={excelInputRef}
            onChange={handleExcelUpload}
          />
          <button
            className="btn btn-secondary"
            onClick={() => excelInputRef.current?.click()}
          >
            Nhập từ Excel
          </button>
        </div>
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
      <ExcelImportModal
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        initialData={excelData}
        categories={categories}
        suppliers={suppliers}
        onSubmit={handleExcelSubmit}
      />
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
    date_to: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      setProducts(
        await productService.getProducts({ ...activeFilters, limit: 100 }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-card card animate-fade-in">
      <div
        className="admin-toolbar"
        style={{ flexDirection: "column", alignItems: "stretch" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Quản lý sản phẩm</h3>
          <button
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Bộ lọc
          </button>
        </div>

        {showFilters && (
          <div
            className="filters-panel"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--bg-alt)",
              borderRadius: "8px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            <div>
              <label>Tên sản phẩm</label>
              <input
                className="form-control"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Nhập tên..."
              />
            </div>
            <div>
              <label>Tên nhà cung cấp</label>
              <input
                className="form-control"
                value={filters.supplier_name}
                onChange={(e) =>
                  setFilters({ ...filters, supplier_name: e.target.value })
                }
                placeholder="Tên nhà cung cấp..."
              />
            </div>
            <div>
              <label>Giá tối thiểu</label>
              <input
                className="form-control"
                type="number"
                value={filters.min_price}
                onChange={(e) =>
                  setFilters({ ...filters, min_price: e.target.value })
                }
              />
            </div>
            <div>
              <label>Giá tối đa</label>
              <input
                className="form-control"
                type="number"
                value={filters.max_price}
                onChange={(e) =>
                  setFilters({ ...filters, max_price: e.target.value })
                }
              />
            </div>
            <div>
              <label>Từ ngày</label>
              <input
                className="form-control"
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters({ ...filters, date_from: e.target.value })
                }
              />
            </div>
            <div>
              <label>Đến ngày</label>
              <input
                className="form-control"
                type="date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters({ ...filters, date_to: e.target.value })
                }
              />
            </div>
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setFilters({
                    search: "",
                    supplier_name: "",
                    min_price: "",
                    max_price: "",
                    date_from: "",
                    date_to: "",
                  })
                }
              >
                Xóa bộ lọc
              </button>
              <button className="btn btn-primary" onClick={fetchProducts}>
                <Search size={16} /> Áp dụng
              </button>
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
        <h3>Quản lý nhà cung cấp</h3>
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
    role: "user", // user, staff, admin
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
        is_staff: formData.role === "staff" || formData.role === "admin",
        is_admin: formData.role === "admin",
      };
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
        <h3>Quản lý tài khoản</h3>
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
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
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

// ================= MANAGE ORDERS TAB =================
function ManageOrdersTab() {
  const [ordersData, setOrdersData] = useState({ orders: [], total: 0, page: 1, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(page, perPage);
      setOrdersData(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading && ordersData.orders.length === 0)
    return <div style={{ padding: "2rem", textAlign: "center" }}>Đang tải đơn hàng...</div>;

  return (
    <div className="admin-card card animate-fade-in">
      <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Toàn bộ đơn hàng đã hoàn thành</h3>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Tổng: {ordersData.total} đơn hàng</span>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Hình ảnh</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Tổng tiền</th>
              <th>Ngày hoàn thành</th>
              <th>Người mua</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.orders.map((order) => (
              <tr key={order.ID_donhang}>
                <td>#{order.ID_donhang}</td>
                <td style={{ width: "60px" }}>
                  <img
                    src={getImageUrl(order.HinhAnh_url)}
                    alt=""
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                  />
                </td>
                <td>{order.tenSP || `SP #${order.ID_sanpham}`}</td>
                <td>{order.soluong}</td>
                <td>{formatPrice(order.gia)}</td>
                <td style={{ fontWeight: "600", color: "var(--primary)" }}>
                  {formatPrice(order.tong_tien)}
                </td>
                <td style={{ fontSize: "0.85rem" }}>{formatDate(order.thoigiantao)}</td>
                <td>{order.tenTK || `UID: ${order.uID}`}</td>
              </tr>
            ))}
            {ordersData.orders.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {ordersData.total_pages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            padding: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="btn btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ← Trang trước
          </button>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Trang {ordersData.page} / {ordersData.total_pages}
          </span>
          <button
            className="btn btn-secondary"
            disabled={page >= ordersData.total_pages}
            onClick={() => setPage(page + 1)}
          >
            Trang sau →
          </button>
        </div>
      )}
    </div>
  );
}

function ExcelImportModal({ isOpen, onClose, initialData, categories, suppliers, onSubmit }) {
  const [data, setData] = useState([]);
  const [activeCatCell, setActiveCatCell] = useState(null);
  const [activeSupCell, setActiveSupCell] = useState(null);

  useEffect(() => {
    if (isOpen) setData(initialData);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const updateRow = (id, field, value) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const deleteRow = (id) => {
    setData((prev) => prev.filter((r) => r.id !== id));
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, image: file, preview } : r)));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content excel-modal-content">
        <div className="modal-header">
          <h3>Nhập dữ liệu từ Excel</h3>
          <button onClick={onClose} className="close-modal">
            <X size={20} />
          </button>
        </div>
        <div className="excel-table-container">
          <table className="excel-table">
            <thead>
              <tr>
                <th>Tên Sản Phẩm</th>
                <th style={{ width: "100px" }}>Giá</th>
                <th style={{ width: "80px" }}>Số Lượng</th>
                <th>Danh Mục</th>
                <th>Nhà Cung Cấp</th>
                <th>Mô Tả</th>
                <th style={{ width: "100px" }}>Hình Ảnh</th>
                <th style={{ width: "60px" }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const catExists = categories.some((c) => c.tenDanhMuc.toLowerCase() === String(row.danhmuc).toLowerCase());
                const supExists = suppliers.some((s) => s.tenNhaCungCap.toLowerCase() === String(row.nhacungcap).toLowerCase());

                return (
                  <tr key={row.id}>
                    <td>
                      <input className="excel-input" value={row.tenSP} onChange={(e) => updateRow(row.id, "tenSP", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="excel-input" value={row.gia} onChange={(e) => updateRow(row.id, "gia", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="excel-input" value={row.soluong} onChange={(e) => updateRow(row.id, "soluong", e.target.value)} />
                    </td>
                    <td style={{ position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          className="excel-input"
                          value={row.danhmuc}
                          onChange={(e) => updateRow(row.id, "danhmuc", e.target.value)}
                          onFocus={() => setActiveCatCell(row.id)}
                          onBlur={() => setTimeout(() => setActiveCatCell(null), 200)}
                        />
                        {!catExists && <AlertTriangle size={16} className="warning-icon" title="Danh mục không tồn tại" />}
                      </div>
                      {activeCatCell === row.id && (
                        <div className="autocomplete-dropdown" style={{ maxHeight: "150px" }}>
                          {categories.filter((c) => c.tenDanhMuc.toLowerCase().includes(String(row.danhmuc).toLowerCase())).map((c) => (
                            <div key={c.ID_danhmuc} className="autocomplete-item" onClick={() => updateRow(row.id, "danhmuc", c.tenDanhMuc)}>
                              {c.tenDanhMuc}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          className="excel-input"
                          value={row.nhacungcap}
                          onChange={(e) => updateRow(row.id, "nhacungcap", e.target.value)}
                          onFocus={() => setActiveSupCell(row.id)}
                          onBlur={() => setTimeout(() => setActiveSupCell(null), 200)}
                        />
                        {!supExists && <AlertTriangle size={16} className="warning-icon" title="Nhà cung cấp không tồn tại" />}
                      </div>
                      {activeSupCell === row.id && (
                        <div className="autocomplete-dropdown" style={{ maxHeight: "150px" }}>
                          {suppliers.filter((s) => s.tenNhaCungCap.toLowerCase().includes(String(row.nhacungcap).toLowerCase())).map((s) => (
                            <div key={s.ID_NhaCungCap} className="autocomplete-item" onClick={() => updateRow(row.id, "nhacungcap", s.tenNhaCungCap)}>
                              {s.tenNhaCungCap}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <input className="excel-input" value={row.mota} onChange={(e) => updateRow(row.id, "mota", e.target.value)} />
                    </td>
                    <td>
                      <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", color: "var(--primary)" }}>
                        <Upload size={14} /> Tải ảnh
                        <input type="file" style={{ display: "none" }} accept="image/*" onChange={(e) => handleImageChange(row.id, e)} />
                      </label>
                      {row.preview && (
                        <img src={row.preview} alt="preview" style={{ width: "40px", height: "40px", objectFit: "cover", marginTop: "4px", borderRadius: "4px" }} />
                      )}
                    </td>
                    <td>
                      <button className="btn-icon delete" onClick={() => deleteRow(row.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="form-actions" style={{ marginTop: "1rem", paddingTop: "1rem" }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ marginRight: "1rem" }}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={() => onSubmit(data)}>
            Lưu Dữ Liệu
          </button>
        </div>
      </div>
    </div>
  );
}
