import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = "http://localhost:8000/api/v1"

print("=== Testing Reviews Feature ===\n")

# 1. Login
r = requests.post(f"{BASE}/auth/login", json={"tenTK": "admin", "matkhau": "123"})
assert r.status_code == 200, f"Login failed: {r.text}"
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("[OK] Login successful")

# 2. Get product reviews (public)
r = requests.get(f"{BASE}/orders/reviews/1")
assert r.status_code == 200, f"Get reviews failed: {r.text}"
print(f"[OK] Get reviews for product 1: {len(r.json())} reviews")

# 3. Can-review check (auth required)
r = requests.get(f"{BASE}/orders/reviews/can-review/1", headers=headers)
assert r.status_code == 200, f"Can-review failed: {r.text}"
data = r.json()
print(f"[OK] Can-review product 1: can_review={data['can_review']}, has_purchased={data['has_purchased']}, has_reviewed={data['has_reviewed']}")

# 4. User's orders
r = requests.get(f"{BASE}/orders", headers=headers)
assert r.status_code == 200, f"Get orders failed: {r.text}"
orders = r.json()
print(f"[OK] User orders: {len(orders)} orders")
for o in orders:
    print(f"  - Order #{o['ID_donhang']}: {o['tenSP']} (reviewed: {o['has_review']}, rating: {o['review_rating']})")

print("\n=== All tests passed! ===")
