"""
Orders endpoints (Donhang, Reviews)
- Create order (checkout)
- Get user orders
- Get all orders (admin)
- Reviews CRUD with image upload
"""

import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.order import Donhang, Reviews
from app.models.product import SanPham
from app.models.user import TaiKhoan
from app.schemas.order import (
    DonhangCreate,
    DonhangResponse,
    CheckoutRequest,
    ReviewCreate,
    ReviewResponse,
)

router = APIRouter()


@router.get("", tags=["Orders"])
async def get_my_orders(db: Session = Depends(get_db), current_user: TaiKhoan = Depends(get_current_user)):
    """
    Get current user's completed orders with product info
    """
    orders = (
        db.query(Donhang)
        .filter(Donhang.uID == current_user.uID)
        .order_by(desc(Donhang.thoigiantao))
        .all()
    )

    result = []
    for o in orders:
        # Get product info (with images relationship for HinhAnh_url property)
        product = db.query(SanPham).filter(SanPham.ID_sanpham == o.ID_sanpham).first()

        # Check if user has reviewed this product
        review = db.query(Reviews).filter(
            Reviews.uID == current_user.uID,
            Reviews.ID_sanpham == o.ID_sanpham
        ).first()

        result.append({
            "ID_donhang": o.ID_donhang,
            "uID": o.uID,
            "ID_sanpham": o.ID_sanpham,
            "soluong": o.soluong,
            "gia": o.gia,
            "trangthai": o.trangthai,
            "thoigiantao": o.thoigiantao.isoformat() if o.thoigiantao else None,
            "updated_at": o.updated_at.isoformat() if o.updated_at else None,
            "tenSP": product.tenSP if product else None,
            "HinhAnh_url": product.HinhAnh_url if product else None,
            "has_review": review is not None,
            "review_rating": review.rating if review else None,
        })
    return result


@router.get("/all", tags=["Orders"])
async def get_all_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """
    Get all orders (admin only) with pagination
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")

    total = db.query(Donhang).filter(Donhang.trangthai == "completed").count()
    offset = (page - 1) * per_page

    orders = (
        db.query(Donhang)
        .filter(Donhang.trangthai == "completed")
        .order_by(desc(Donhang.thoigiantao))
        .offset(offset)
        .limit(per_page)
        .all()
    )

    result = []
    for o in orders:
        product = db.query(SanPham).filter(SanPham.ID_sanpham == o.ID_sanpham).first()
        user = db.query(TaiKhoan).filter(TaiKhoan.uID == o.uID).first()
        result.append({
            "ID_donhang": o.ID_donhang,
            "uID": o.uID,
            "tenTK": user.tenTK if user else "N/A",
            "ID_sanpham": o.ID_sanpham,
            "tenSP": product.tenSP if product else "N/A",
            "HinhAnh_url": product.HinhAnh_url if product else None,
            "soluong": o.soluong,
            "gia": o.gia,
            "tong_tien": o.gia * o.soluong if o.gia and o.soluong else 0,
            "trangthai": o.trangthai,
            "thoigiantao": o.thoigiantao.isoformat() if o.thoigiantao else None,
        })

    return {
        "orders": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.post("/checkout", tags=["Orders"])
async def checkout(
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """
    Checkout: create orders and deduct stock for each item
    """
    created_orders = []

    for item in checkout_data.items:
        # Verify product exists and has enough stock
        product = db.query(SanPham).filter(SanPham.ID_sanpham == item.ID_sanpham).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Không tìm thấy sản phẩm ID {item.ID_sanpham}",
            )

        current_stock = product.soluong or 0
        if current_stock < item.soluong:
            raise HTTPException(
                status_code=400,
                detail=f"Sản phẩm '{product.tenSP}' không đủ số lượng trong kho (còn {current_stock})",
            )

        # Deduct stock
        product.soluong = current_stock - item.soluong

        # Create order record
        order = Donhang(
            uID=current_user.uID,
            ID_sanpham=item.ID_sanpham,
            soluong=item.soluong,
            gia=item.gia,
            trangthai="completed",
        )
        db.add(order)
        created_orders.append(order)

    db.commit()

    return {
        "message": f"Đã tạo {len(created_orders)} đơn hàng thành công",
        "order_count": len(created_orders),
    }


# =================== REVIEWS ===================


@router.get("/reviews/can-review/{ID_sanpham}", tags=["Reviews"])
async def can_review_product(
    ID_sanpham: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """
    Check if user can review a product (must have purchased, not yet reviewed)
    """
    has_purchased = db.query(Donhang).filter(
        Donhang.uID == current_user.uID,
        Donhang.ID_sanpham == ID_sanpham,
        Donhang.trangthai == "completed",
    ).first() is not None

    has_reviewed = db.query(Reviews).filter(
        Reviews.uID == current_user.uID,
        Reviews.ID_sanpham == ID_sanpham,
    ).first() is not None

    return {
        "can_review": has_purchased and not has_reviewed,
        "has_purchased": has_purchased,
        "has_reviewed": has_reviewed,
    }


@router.get("/reviews/{ID_sanpham}", tags=["Reviews"])
async def get_product_reviews(ID_sanpham: int, db: Session = Depends(get_db)):
    """
    Get all reviews for a product
    """
    reviews = (
        db.query(Reviews)
        .filter(Reviews.ID_sanpham == ID_sanpham)
        .order_by(desc(Reviews.thoigiantao))
        .all()
    )

    result = []
    for r in reviews:
        user = db.query(TaiKhoan).filter(TaiKhoan.uID == r.uID).first()
        result.append({
            "ID_review": r.ID_review,
            "uID": r.uID,
            "ID_sanpham": r.ID_sanpham,
            "rating": r.rating,
            "comment": r.comment,
            "image_url": r.image_url,
            "thoigiantao": r.thoigiantao.isoformat() if r.thoigiantao else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            "tenTK": user.tenTK if user else "Ẩn danh",
        })

    return result


@router.post("/reviews", tags=["Reviews"])
async def create_review(
    ID_sanpham: int = Form(...),
    rating: int = Form(...),
    comment: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """
    Create a review for a product (must have purchased it)
    Supports multiple image uploads
    """
    # Check if user has purchased this product
    order = db.query(Donhang).filter(
        Donhang.uID == current_user.uID,
        Donhang.ID_sanpham == ID_sanpham,
        Donhang.trangthai == "completed",
    ).first()

    if not order:
        raise HTTPException(
            status_code=400,
            detail="Bạn cần mua sản phẩm này trước khi đánh giá",
        )

    # Check if already reviewed
    existing = db.query(Reviews).filter(
        Reviews.uID == current_user.uID,
        Reviews.ID_sanpham == ID_sanpham,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Bạn đã đánh giá sản phẩm này rồi")

    # Handle image uploads
    image_urls = []
    if images:
        base_dir = os.path.dirname(
            os.path.dirname(
                os.path.dirname(
                    os.path.dirname(
                        os.path.dirname(
                            os.path.dirname(os.path.abspath(__file__))
                        )
                    )
                )
            )
        )
        upload_dir = os.path.join(base_dir, "frontend", "public", "images", "reviews")
        os.makedirs(upload_dir, exist_ok=True)

        for img_file in images:
            if img_file.filename:  # Skip empty file inputs
                ext = os.path.splitext(img_file.filename)[1]
                fname = f"{uuid.uuid4()}{ext}"
                fpath = os.path.join(upload_dir, fname)
                with open(fpath, "wb") as buf:
                    shutil.copyfileobj(img_file.file, buf)
                image_urls.append(f"/images/reviews/{fname}")

    # Store image URLs as comma-separated string
    image_url_str = ",".join(image_urls) if image_urls else None

    review = Reviews(
        uID=current_user.uID,
        ID_sanpham=ID_sanpham,
        rating=rating,
        comment=comment,
        image_url=image_url_str,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "ID_review": review.ID_review,
        "rating": review.rating,
        "comment": review.comment,
        "image_url": review.image_url,
        "message": "Đánh giá thành công",
    }


@router.delete("/reviews/{ID_review}", tags=["Reviews"])
async def delete_review(
    ID_review: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user),
):
    """
    Delete a review (owner or admin)
    """
    review = db.query(Reviews).filter(Reviews.ID_review == ID_review).first()
    if not review:
        raise HTTPException(status_code=404, detail="Không tìm thấy đánh giá")

    if review.uID != current_user.uID and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Không có quyền xóa đánh giá này")

    db.delete(review)
    db.commit()
    return {"message": "Đã xóa đánh giá"}
