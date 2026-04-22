# ESale Database Schema (SQL Server)

## Database Structure Overview

This document describes the database schema used in the ESale e-commerce platform. The schema is organized into 3 main groups:

---

## 1. User & System Group

### TaiKhoan (Account Table)
Stores user account information
- **uID** (PK): User ID (INT PRIMARY KEY)
- **tenTK**: Username (VARCHAR, UNIQUE)
- **matkhau**: Password (VARCHAR, hashed)
- **email**: Email (VARCHAR, UNIQUE)
- **is_staff**: Staff flag (BOOLEAN)
- **is_admin**: Admin flag (BOOLEAN)
- **created_at**: Account creation timestamp
- **updated_at**: Last update timestamp

```sql
CREATE TABLE taikhoan (
    uID INT PRIMARY KEY IDENTITY(1,1),
    tenTK VARCHAR(100) UNIQUE NOT NULL,
    matkhau VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    is_staff BIT DEFAULT 0,
    is_admin BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

### Logs (Activity Logs Table)
Tracks user activities
- **id_log** (PK): Log ID (INT PRIMARY KEY)
- **uID** (FK): References TaiKhoan.uID
- **action**: Action description (VARCHAR)
- **create_at**: Action timestamp

```sql
CREATE TABLE logs (
    id_log INT PRIMARY KEY IDENTITY(1,1),
    uID INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    create_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (uID) REFERENCES taikhoan(uID)
);
```

---

## 2. Product & Inventory Group

### DanhMuc (Category Table)
Product categories
- **ID_danhmuc** (PK): Category ID (INT PRIMARY KEY)
- **tenDanhMuc**: Category name (VARCHAR, UNIQUE)
- **mota**: Description (TEXT)
- **created_at**: Creation timestamp
- **updated_at**: Update timestamp

```sql
CREATE TABLE danhmuc (
    ID_danhmuc INT PRIMARY KEY IDENTITY(1,1),
    tenDanhMuc VARCHAR(100) UNIQUE NOT NULL,
    mota TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
```

### NhaCungCap (Supplier Table)
Supplier information
- **ID_NhaCungCap** (PK): Supplier ID (INT PRIMARY KEY)
- **tenNhaCungCap**: Supplier name (VARCHAR)
- **ID_danhmuc** (FK): References DanhMuc.ID_danhmuc
- **sdt**: Phone number (VARCHAR)
- **email**: Supplier email (VARCHAR)
- **created_at**: Creation timestamp
- **updated_at**: Update timestamp

```sql
CREATE TABLE nhacungcap (
    ID_NhaCungCap INT PRIMARY KEY IDENTITY(1,1),
    tenNhaCungCap VARCHAR(100) NOT NULL,
    ID_danhmuc INT NOT NULL,
    sdt VARCHAR(20),
    email VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_danhmuc) REFERENCES danhmuc(ID_danhmuc)
);
```

### AnhSP (Product Image Table)
Product images
- **ID_HinhAnh** (PK): Image ID (INT PRIMARY KEY)
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **HinhAnh_url**: Image URL (VARCHAR)
- **created_at**: Creation timestamp

```sql
CREATE TABLE anhsp (
    ID_HinhAnh INT PRIMARY KEY IDENTITY(1,1),
    ID_sanpham INT,
    HinhAnh_url VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

### SanPham (Product Table)
Main product information
- **ID_sanpham** (PK): Product ID (INT PRIMARY KEY)
- **tenSP**: Product name (VARCHAR, UNIQUE)
- **mota**: Description (TEXT)
- **gia**: Price (FLOAT)
- **ID_danhmuc** (FK): References DanhMuc.ID_danhmuc
- **supplier_ID** (FK): References NhaCungCap.ID_NhaCungCap
- **ID_HinhAnh** (FK): References AnhSP.ID_HinhAnh
- **created_at**: Creation timestamp
- **updated_at**: Update timestamp

```sql
CREATE TABLE sanpham (
    ID_sanpham INT PRIMARY KEY IDENTITY(1,1),
    tenSP VARCHAR(100) UNIQUE NOT NULL,
    mota TEXT NOT NULL,
    gia FLOAT NOT NULL,
    ID_danhmuc INT NOT NULL,
    supplier_ID INT NOT NULL,
    ID_HinhAnh INT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_danhmuc) REFERENCES danhmuc(ID_danhmuc),
    FOREIGN KEY (supplier_ID) REFERENCES nhacungcap(ID_NhaCungCap),
    FOREIGN KEY (ID_HinhAnh) REFERENCES anhsp(ID_HinhAnh)
);
```

### ThongsoSP (Product Specifications Table)
Product technical specifications
- **ID_sp_ts** (PK): Spec ID (INT PRIMARY KEY)
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **Dienap**: Power rating (VARCHAR)
- **HieuSuat**: Efficiency (VARCHAR)
- **created_at**: Creation timestamp
- **updated_at**: Update timestamp

```sql
CREATE TABLE thongsospthongso (
    ID_sp_ts INT PRIMARY KEY IDENTITY(1,1),
    ID_sanpham INT NOT NULL,
    Dienap VARCHAR(100),
    HieuSuat VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

### TonKho (Inventory/Stock Table)
Product inventory management
- **ID_tonkho** (PK): Stock ID (INT PRIMARY KEY)
- **ten**: Stock location name (VARCHAR)
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **soluong**: Quantity in stock (INT)
- **ngaycapnhat**: Last update date (DATETIME)

```sql
CREATE TABLE tonkho (
    ID_tonkho INT PRIMARY KEY IDENTITY(1,1),
    ten VARCHAR(100) NOT NULL,
    ID_sanpham INT NOT NULL,
    soluong INT DEFAULT 0,
    ngaycapnhat DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

---

## 3. Sales & Payment Group

### Giohang (Shopping Cart Table)
Shopping cart items
- **ID_giohang** (PK): Cart item ID (INT PRIMARY KEY)
- **uID** (FK): References TaiKhoan.uID
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **soluong**: Quantity (INT)
- **gia**: Price per item (FLOAT)
- **created_at**: Added to cart timestamp
- **updated_at**: Last update timestamp

```sql
CREATE TABLE giohang (
    ID_giohang INT PRIMARY KEY IDENTITY(1,1),
    uID INT NOT NULL,
    ID_sanpham INT NOT NULL,
    soluong INT DEFAULT 1,
    gia FLOAT NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (uID) REFERENCES taikhoan(uID),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

### Donhang (Order Table)
Customer orders
- **ID_donhang** (PK): Order ID (INT PRIMARY KEY)
- **uID** (FK): References TaiKhoan.uID
- **trangthai**: Order status (VARCHAR) - values: pending, confirmed, shipped, delivered, cancelled
- **soluong**: Quantity ordered (INT)
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **gia**: Order price (FLOAT)
- **thoigiantao**: Order creation timestamp
- **updated_at**: Last update timestamp

```sql
CREATE TABLE donhang (
    ID_donhang INT PRIMARY KEY IDENTITY(1,1),
    uID INT NOT NULL,
    trangthai VARCHAR(50) DEFAULT 'pending',
    soluong INT NOT NULL,
    ID_sanpham INT NOT NULL,
    gia FLOAT NOT NULL,
    thoigiantao DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (uID) REFERENCES taikhoan(uID),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

### PTThanhToan (Payment Method Table)
Payment information
- **ID_ThanhToan** (PK): Payment ID (INT PRIMARY KEY)
- **ID_giohang** (FK): References Giohang.ID_giohang (nullable)
- **ID_donhang** (FK): References Donhang.ID_donhang (nullable)
- **PhuongThucTT**: Payment method (VARCHAR) - values: Credit Card, E-wallet, Bank Transfer, Cash
- **trangthai**: Payment status (VARCHAR) - values: pending, completed, failed, cancelled
- **tonggia**: Total amount (FLOAT)
- **thoigiantao**: Payment creation timestamp
- **updated_at**: Last update timestamp

```sql
CREATE TABLE ptthanhToan (
    ID_ThanhToan INT PRIMARY KEY IDENTITY(1,1),
    ID_giohang INT,
    ID_donhang INT,
    PhuongThucTT VARCHAR(50) NOT NULL,
    trangthai VARCHAR(50) DEFAULT 'pending',
    tonggia FLOAT NOT NULL,
    thoigiantao DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_giohang) REFERENCES giohang(ID_giohang),
    FOREIGN KEY (ID_donhang) REFERENCES donhang(ID_donhang)
);
```

### Reviews (Product Review Table)
Customer product reviews
- **ID_review** (PK): Review ID (INT PRIMARY KEY)
- **uID** (FK): References TaiKhoan.uID
- **ID_sanpham** (FK): References SanPham.ID_sanpham
- **rating**: Rating score (INT) - range: 1-5
- **comment**: Review comment (TEXT)
- **thoigiantao**: Review creation timestamp
- **updated_at**: Last update timestamp

```sql
CREATE TABLE reviews (
    ID_review INT PRIMARY KEY IDENTITY(1,1),
    uID INT NOT NULL,
    ID_sanpham INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    thoigiantao DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (uID) REFERENCES taikhoan(uID),
    FOREIGN KEY (ID_sanpham) REFERENCES sanpham(ID_sanpham)
);
```

---

## Database Relationships

### Foreign Key Relationships

```
TaiKhoan (uID)
├── Logs (uID)
├── Giohang (uID)
├── Donhang (uID)
└── Reviews (uID)

DanhMuc (ID_danhmuc)
├── NhaCungCap (ID_danhmuc)
└── SanPham (ID_danhmuc)

NhaCungCap (ID_NhaCungCap)
└── SanPham (supplier_ID)

AnhSP (ID_HinhAnh)
└── SanPham (ID_HinhAnh)

SanPham (ID_sanpham)
├── ThongsoSP (ID_sanpham)
├── TonKho (ID_sanpham)
├── Giohang (ID_sanpham)
├── Donhang (ID_sanpham)
└── Reviews (ID_sanpham)

Giohang (ID_giohang)
└── PTThanhToan (ID_giohang)

Donhang (ID_donhang)
└── PTThanhToan (ID_donhang)
```

---

## Indexes

Recommended indexes for performance optimization:

```sql
-- User indexes
CREATE INDEX idx_taikhoan_email ON taikhoan(email);
CREATE INDEX idx_taikhoan_tenTK ON taikhoan(tenTK);

-- Product indexes
CREATE INDEX idx_sanpham_tenSP ON sanpham(tenSP);
CREATE INDEX idx_sanpham_ID_danhmuc ON sanpham(ID_danhmuc);
CREATE INDEX idx_sanpham_supplier_ID ON sanpham(supplier_ID);

-- Order indexes
CREATE INDEX idx_donhang_uID ON donhang(uID);
CREATE INDEX idx_donhang_trangthai ON donhang(trangthai);
CREATE INDEX idx_giohang_uID ON giohang(uID);

-- Reviews indexes
CREATE INDEX idx_reviews_ID_sanpham ON reviews(ID_sanpham);
CREATE INDEX idx_reviews_uID ON reviews(uID);

-- Logs index
CREATE INDEX idx_logs_uID ON logs(uID);
```

---

## Notes

- All tables include timestamps (created_at, updated_at) for audit trails
- Primary keys are identity/auto-increment
- Foreign keys enforce referential integrity
- Status fields use VARCHAR for flexibility
- Sensitive data (passwords) should be hashed before storage
- Implement proper transaction handling for order and payment operations
