"""
Suppliers endpoints (NhaCungCap)
- CRUD operations for suppliers
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.product import NhaCungCap
from app.schemas.product import NhaCungCapCreate, NhaCungCapUpdate, NhaCungCapResponse

router = APIRouter()


@router.get("", response_model=List[NhaCungCapResponse], tags=["Suppliers"])
async def get_suppliers(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all suppliers, optionally filtered by name search
    """
    query = db.query(NhaCungCap)
    if search:
        query = query.filter(NhaCungCap.tenNhaCungCap.ilike(f"%{search}%"))
    return query.all()


@router.get("/{ID_NhaCungCap}", response_model=NhaCungCapResponse, tags=["Suppliers"])
async def get_supplier(ID_NhaCungCap: int, db: Session = Depends(get_db)):
    """
    Get supplier by ID
    """
    supplier = db.query(NhaCungCap).filter(NhaCungCap.ID_NhaCungCap == ID_NhaCungCap).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà cung cấp")
    return supplier


@router.post("", response_model=NhaCungCapResponse, tags=["Suppliers"])
async def create_supplier(supplier_in: NhaCungCapCreate, db: Session = Depends(get_db)):
    """
    Create new supplier
    """
    db_supplier = NhaCungCap(**supplier_in.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier


@router.put("/{ID_NhaCungCap}", response_model=NhaCungCapResponse, tags=["Suppliers"])
async def update_supplier(
    ID_NhaCungCap: int,
    supplier_in: NhaCungCapUpdate,
    db: Session = Depends(get_db)
):
    """
    Update supplier
    """
    supplier = db.query(NhaCungCap).filter(NhaCungCap.ID_NhaCungCap == ID_NhaCungCap).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà cung cấp")

    for field, value in supplier_in.dict(exclude_unset=True).items():
        setattr(supplier, field, value)

    db.commit()
    db.refresh(supplier)
    return supplier


@router.delete("/{ID_NhaCungCap}", tags=["Suppliers"])
async def delete_supplier(ID_NhaCungCap: int, db: Session = Depends(get_db)):
    """
    Delete supplier
    """
    supplier = db.query(NhaCungCap).filter(NhaCungCap.ID_NhaCungCap == ID_NhaCungCap).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Không tìm thấy nhà cung cấp")

    db.delete(supplier)
    db.commit()
    return {"message": "Đã xóa nhà cung cấp thành công"}
