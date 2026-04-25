"""Khoi phuc database

Revision ID: 02b2832f531a
Revises: 
Create Date: 2026-04-26 05:01:46.550166

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '02b2832f531a'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. TẠO CÁC BẢNG ĐỘC LẬP (KHÔNG CÓ KHÓA NGOẠI HOẶC LÀ CHA)
    op.create_table('danhmuc',
    sa.Column('ID_danhmuc', sa.Integer(), nullable=False),
    sa.Column('tenDanhMuc', sa.String(), nullable=True),
    sa.Column('mota', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('ID_danhmuc')
    )
    op.create_index(op.f('ix_danhmuc_ID_danhmuc'), 'danhmuc', ['ID_danhmuc'], unique=False)
    op.create_index(op.f('ix_danhmuc_tenDanhMuc'), 'danhmuc', ['tenDanhMuc'], unique=True)

    op.create_table('taikhoan',
    sa.Column('uID', sa.Integer(), nullable=False),
    sa.Column('tenTK', sa.String(), nullable=True),
    sa.Column('matkhau', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('is_staff', sa.Boolean(), nullable=True),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('uID')
    )
    op.create_index(op.f('ix_taikhoan_email'), 'taikhoan', ['email'], unique=True)
    op.create_index(op.f('ix_taikhoan_tenTK'), 'taikhoan', ['tenTK'], unique=True)
    op.create_index(op.f('ix_taikhoan_uID'), 'taikhoan', ['uID'], unique=False)

    # 2. TẠO NHÀ CUNG CẤP (PHỤ THUỘC DANH MỤC)
    op.create_table('nhacungcap',
    sa.Column('ID_NhaCungCap', sa.Integer(), nullable=False),
    sa.Column('tenNhaCungCap', sa.String(), nullable=True),
    sa.Column('ID_danhmuc', sa.Integer(), nullable=True),
    sa.Column('sdt', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_danhmuc'], ['danhmuc.ID_danhmuc'], ),
    sa.PrimaryKeyConstraint('ID_NhaCungCap')
    )
    op.create_index(op.f('ix_nhacungcap_ID_NhaCungCap'), 'nhacungcap', ['ID_NhaCungCap'], unique=False)
    op.create_index(op.f('ix_nhacungcap_tenNhaCungCap'), 'nhacungcap', ['tenNhaCungCap'], unique=False)

    # 3. TẠO SẢN PHẨM (PHỤ THUỘC DANH MỤC VÀ NHÀ CUNG CẤP)
    # Lưu ý: Mình bỏ ForeignKey ID_HinhAnh ở đây tạm thời vì sẽ tạo bảng anhsp sau
    op.create_table('sanpham',
    sa.Column('ID_sanpham', sa.Integer(), nullable=False),
    sa.Column('tenSP', sa.String(), nullable=True),
    sa.Column('mota', sa.Text(), nullable=True),
    sa.Column('gia', sa.Float(), nullable=True),
    sa.Column('ID_danhmuc', sa.Integer(), nullable=True),
    sa.Column('supplier_ID', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_danhmuc'], ['danhmuc.ID_danhmuc'], ),
    sa.ForeignKeyConstraint(['supplier_ID'], ['nhacungcap.ID_NhaCungCap'], ),
    sa.PrimaryKeyConstraint('ID_sanpham')
    )
    op.create_index(op.f('ix_sanpham_ID_sanpham'), 'sanpham', ['ID_sanpham'], unique=False)
    op.create_index(op.f('ix_sanpham_tenSP'), 'sanpham', ['tenSP'], unique=True)

    # 4. TẠO CÁC BẢNG PHỤ THUỘC VÀO SẢN PHẨM VÀ TÀI KHOẢN
    op.create_table('anhsp',
    sa.Column('ID_HinhAnh', sa.Integer(), nullable=False),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('HinhAnh_url', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.PrimaryKeyConstraint('ID_HinhAnh')
    )
    op.create_index(op.f('ix_anhsp_ID_HinhAnh'), 'anhsp', ['ID_HinhAnh'], unique=False)

    op.create_table('donhang',
    sa.Column('ID_donhang', sa.Integer(), nullable=False),
    sa.Column('uID', sa.Integer(), nullable=True),
    sa.Column('trangthai', sa.String(), nullable=True),
    sa.Column('soluong', sa.Integer(), nullable=True),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('gia', sa.Float(), nullable=True),
    sa.Column('thoigiantao', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.ForeignKeyConstraint(['uID'], ['taikhoan.uID'], ),
    sa.PrimaryKeyConstraint('ID_donhang')
    )
    op.create_index(op.f('ix_donhang_ID_donhang'), 'donhang', ['ID_donhang'], unique=False)

    op.create_table('giohang',
    sa.Column('ID_giohang', sa.Integer(), nullable=False),
    sa.Column('uID', sa.Integer(), nullable=True),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('soluong', sa.Integer(), nullable=True),
    sa.Column('gia', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.ForeignKeyConstraint(['uID'], ['taikhoan.uID'], ),
    sa.PrimaryKeyConstraint('ID_giohang')
    )
    op.create_index(op.f('ix_giohang_ID_giohang'), 'giohang', ['ID_giohang'], unique=False)

    op.create_table('logs',
    sa.Column('id_log', sa.Integer(), nullable=False),
    sa.Column('uID', sa.Integer(), nullable=True),
    sa.Column('action', sa.String(), nullable=True),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['uID'], ['taikhoan.uID'], ),
    sa.PrimaryKeyConstraint('id_log')
    )
    op.create_index(op.f('ix_logs_id_log'), 'logs', ['id_log'], unique=False)

    op.create_table('reviews',
    sa.Column('ID_review', sa.Integer(), nullable=False),
    sa.Column('uID', sa.Integer(), nullable=True),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('rating', sa.Integer(), nullable=True),
    sa.Column('comment', sa.Text(), nullable=True),
    sa.Column('thoigiantao', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.ForeignKeyConstraint(['uID'], ['taikhoan.uID'], ),
    sa.PrimaryKeyConstraint('ID_review')
    )
    op.create_index(op.f('ix_reviews_ID_review'), 'reviews', ['ID_review'], unique=False)

    op.create_table('thongsospthongso',
    sa.Column('ID_sp_ts', sa.Integer(), nullable=False),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('Dienap', sa.String(), nullable=True),
    sa.Column('HieuSuat', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.PrimaryKeyConstraint('ID_sp_ts')
    )
    op.create_index(op.f('ix_thongsospthongso_ID_sp_ts'), 'thongsospthongso', ['ID_sp_ts'], unique=False)

    op.create_table('tonkho',
    sa.Column('ID_tonkho', sa.Integer(), nullable=False),
    sa.Column('ten', sa.String(), nullable=True),
    sa.Column('ID_sanpham', sa.Integer(), nullable=True),
    sa.Column('soluong', sa.Integer(), nullable=True),
    sa.Column('ngaycapnhat', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_sanpham'], ['sanpham.ID_sanpham'], ),
    sa.PrimaryKeyConstraint('ID_tonkho')
    )
    op.create_index(op.f('ix_tonkho_ID_tonkho'), 'tonkho', ['ID_tonkho'], unique=False)

    op.create_table('ptthanhToan',
    sa.Column('ID_ThanhToan', sa.Integer(), nullable=False),
    sa.Column('ID_giohang', sa.Integer(), nullable=True),
    sa.Column('ID_donhang', sa.Integer(), nullable=True),
    sa.Column('PhuongThucTT', sa.String(), nullable=True),
    sa.Column('trangthai', sa.String(), nullable=True),
    sa.Column('tonggia', sa.Float(), nullable=True),
    sa.Column('thoigiantao', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['ID_donhang'], ['donhang.ID_donhang'], ),
    sa.ForeignKeyConstraint(['ID_giohang'], ['giohang.ID_giohang'], ),
    sa.PrimaryKeyConstraint('ID_ThanhToan')
    )
    op.create_index(op.f('ix_ptthanhToan_ID_ThanhToan'), 'ptthanhToan', ['ID_ThanhToan'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_ptthanhToan_ID_ThanhToan'), table_name='ptthanhToan')
    op.drop_table('ptthanhToan')
    op.drop_index(op.f('ix_tonkho_ID_tonkho'), table_name='tonkho')
    op.drop_table('tonkho')
    op.drop_index(op.f('ix_thongsospthongso_ID_sp_ts'), table_name='thongsospthongso')
    op.drop_table('thongsospthongso')
    op.drop_index(op.f('ix_reviews_ID_review'), table_name='reviews')
    op.drop_table('reviews')
    op.drop_index(op.f('ix_nhacungcap_tenNhaCungCap'), table_name='nhacungcap')
    op.drop_index(op.f('ix_nhacungcap_ID_NhaCungCap'), table_name='nhacungcap')
    op.drop_table('nhacungcap')
    op.drop_index(op.f('ix_logs_id_log'), table_name='logs')
    op.drop_table('logs')
    op.drop_index(op.f('ix_giohang_ID_giohang'), table_name='giohang')
    op.drop_table('giohang')
    op.drop_index(op.f('ix_donhang_ID_donhang'), table_name='donhang')
    op.drop_table('donhang')
    op.drop_index(op.f('ix_taikhoan_uID'), table_name='taikhoan')
    op.drop_index(op.f('ix_taikhoan_tenTK'), table_name='taikhoan')
    op.drop_index(op.f('ix_taikhoan_email'), table_name='taikhoan')
    op.drop_table('taikhoan')
    op.drop_index(op.f('ix_sanpham_tenSP'), table_name='sanpham')
    op.drop_index(op.f('ix_sanpham_ID_sanpham'), table_name='sanpham')
    op.drop_table('sanpham')
    op.drop_index(op.f('ix_danhmuc_tenDanhMuc'), table_name='danhmuc')
    op.drop_index(op.f('ix_danhmuc_ID_danhmuc'), table_name='danhmuc')
    op.drop_table('danhmuc')
    op.drop_index(op.f('ix_anhsp_ID_HinhAnh'), table_name='anhsp')
    op.drop_table('anhsp')