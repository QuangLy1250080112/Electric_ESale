# backend/app/models/__init__.py
from .user import TaiKhoan, Logs
from .product import DanhMuc, NhaCungCap, SanPham, TonKho, ThongsoSP, AnhSP
from .order import Giohang, Donhang, PTThanhToan, Reviews  # Kiểm tra lỗi chính tả ở đây
from .news import TinTuc, BinhLuanTinTuc
from .settings import ShopSettings