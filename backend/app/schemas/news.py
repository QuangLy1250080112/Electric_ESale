from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TinTucBase(BaseModel):
    anh_dai_dien: str
    tieu_de: str
    mo_ta_ngan: str
    noi_dung: str

class TinTucCreate(TinTucBase):
    pass

class TinTucUpdate(BaseModel):
    anh_dai_dien: Optional[str] = None
    tieu_de: Optional[str] = None
    mo_ta_ngan: Optional[str] = None
    noi_dung: Optional[str] = None

class UserInfo(BaseModel):
    uID: int
    tenTK: str
    class Config:
        from_attributes = True

class BinhLuanTinTucBase(BaseModel):
    noi_dung: str

class BinhLuanTinTucCreate(BinhLuanTinTucBase):
    pass

class BinhLuanTinTucResponse(BinhLuanTinTucBase):
    id: int
    tin_tuc_id: int
    nguoi_dung_id: int
    ngay_binh_luan: datetime
    nguoi_dung: UserInfo

    class Config:
        from_attributes = True

class TinTucResponse(TinTucBase):
    id: int
    nguoi_viet_id: int
    ngay_dang: datetime
    updated_at: datetime
    nguoi_viet: UserInfo
    binh_luan: List[BinhLuanTinTucResponse] = []

    class Config:
        from_attributes = True
