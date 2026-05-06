import requests

url = "http://localhost:8000/api/v1/products"
payload = {
    "tenSP": "iPhone 15 Pro",
    "mota": "Test description",
    "gia": 25000000,
    "ID_danhmuc": 1,
    "supplier_ID": 1
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
