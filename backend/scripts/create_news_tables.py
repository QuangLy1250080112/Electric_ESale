import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.core.database import engine, Base
from app.models.news import TinTuc, BinhLuanTinTuc

print("Creating news tables...")
TinTuc.metadata.create_all(bind=engine)
BinhLuanTinTuc.metadata.create_all(bind=engine)
print("Done!")
