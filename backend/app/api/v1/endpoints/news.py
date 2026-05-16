import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.news import TinTuc, BinhLuanTinTuc
from app.models.user import TaiKhoan
from app.schemas.news import TinTucCreate, TinTucUpdate, TinTucResponse, BinhLuanTinTucCreate, BinhLuanTinTucResponse
from app.core.security import get_current_user

router = APIRouter()

UPLOAD_DIR = "../frontend/public/images/news"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[TinTucResponse])
def get_all_news(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return db.query(TinTuc).order_by(desc(TinTuc.ngay_dang)).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=TinTucResponse)
def get_news(id: int, db: Session = Depends(get_db)):
    news = db.query(TinTuc).filter(TinTuc.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@router.post("/", response_model=TinTucResponse)
def create_news(
    tieu_de: str = Form(""),
    mo_ta_ngan: str = Form(""),
    noi_dung: str = Form(""),
    anh_dai_dien: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user)
):
    if not current_user.is_admin and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    # save image
    file_name = anh_dai_dien.filename
    file_path = os.path.join(UPLOAD_DIR, file_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(anh_dai_dien.file, buffer)

    image_url = f"/images/news/{file_name}"

    new_article = TinTuc(
        tieu_de=tieu_de,
        mo_ta_ngan=mo_ta_ngan,
        noi_dung=noi_dung,
        anh_dai_dien=image_url,
        nguoi_viet_id=current_user.uID
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article

@router.put("/{id}", response_model=TinTucResponse)
def update_news(
    id: int,
    tieu_de: str = Form(None),
    mo_ta_ngan: str = Form(None),
    noi_dung: str = Form(None),
    anh_dai_dien: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user)
):
    if not current_user.is_admin and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    news = db.query(TinTuc).filter(TinTuc.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    if tieu_de is not None:
        news.tieu_de = tieu_de
    if mo_ta_ngan is not None:
        news.mo_ta_ngan = mo_ta_ngan
    if noi_dung is not None:
        news.noi_dung = noi_dung
    if anh_dai_dien:
        # delete old image
        if news.anh_dai_dien:
            old_file_name = os.path.basename(news.anh_dai_dien)
            old_image_path = os.path.join(UPLOAD_DIR, old_file_name)
            if os.path.exists(old_image_path):
                try:
                    os.remove(old_image_path)
                except Exception:
                    pass
            
        file_name = anh_dai_dien.filename
        file_path = os.path.join(UPLOAD_DIR, file_name)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(anh_dai_dien.file, buffer)
        news.anh_dai_dien = f"/images/news/{file_name}"

    db.commit()
    db.refresh(news)
    return news

@router.delete("/{id}")
def delete_news(id: int, db: Session = Depends(get_db), current_user: TaiKhoan = Depends(get_current_user)):
    if not current_user.is_admin and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    news = db.query(TinTuc).filter(TinTuc.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    # delete image
    if news.anh_dai_dien:
        old_file_name = os.path.basename(news.anh_dai_dien)
        old_image_path = os.path.join(UPLOAD_DIR, old_file_name)
        if os.path.exists(old_image_path):
            try:
                os.remove(old_image_path)
            except Exception:
                pass
        
    db.delete(news)
    db.commit()
    return {"message": "News deleted"}


@router.post("/{id}/comments", response_model=BinhLuanTinTucResponse)
def create_comment(
    id: int,
    comment: BinhLuanTinTucCreate,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user)
):
    news = db.query(TinTuc).filter(TinTuc.id == id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    
    new_comment = BinhLuanTinTuc(
        tin_tuc_id=id,
        nguoi_dung_id=current_user.uID,
        noi_dung=comment.noi_dung
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: TaiKhoan = Depends(get_current_user)
):
    if not current_user.is_admin and not current_user.is_staff:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comment = db.query(BinhLuanTinTuc).filter(BinhLuanTinTuc.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}
