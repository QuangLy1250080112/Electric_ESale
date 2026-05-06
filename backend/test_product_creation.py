import unittest
from app.core.database import SessionLocal
from app.models.product import SanPham, DanhMuc, NhaCungCap

class TestProductCreation(unittest.TestCase):
    def setUp(self):
        self.db = SessionLocal()
        # Clean up if needed, but we expect it to be empty or controlled
        
    def tearDown(self):
        self.db.close()

    def test_create_product_without_supplier(self):
        # This should fail due to foreign key constraint
        product = SanPham(
            tenSP="Test Product",
            mota="Test Description",
            gia=1000.0,
            ID_danhmuc=1, # Assume category 1 exists (it does)
            supplier_ID=1 # Assume supplier 1 DOES NOT exist
        )
        self.db.add(product)
        try:
            self.db.commit()
            print("Successfully committed (Unexpected if FK is enforced)")
        except Exception as e:
            print(f"Caught expected exception: {e}")
            self.db.rollback()

if __name__ == "__main__":
    unittest.main()
