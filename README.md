# TokoKita — Fullstack E-Commerce PKL

Aplikasi toko online fullstack untuk kebutuhan PKL.

---

## Struktur Project

```
Project-Toko Jualan/
├── backend/          ← Express.js API
├── frontend/         ← React + Vite + Tailwind
├── insomnia_collection.json
└── README.md
```

---

## SETUP BACKEND

### 1. Masuk folder backend
```
cd backend
```

### 2. Install dependency
```
npm install
```

### 3. Setup .env
Edit file `.env` sesuai database MySQL kamu:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=        ← isi password MySQL kamu
DB_NAME=toko_jualan
JWT_SECRET=toko_jualan_secret_key_2024
JWT_EXPIRES_IN=7d
```

### 4. Buat database MySQL
Buka MySQL dan jalankan:
```sql
CREATE DATABASE toko_jualan;
```

### 5. Jalankan seeder (auto sync + isi data dummy)
```
npm run seed
```

Output yang benar:
```
Database di-reset...
Users dibuat
Categories dibuat
Products dibuat
Orders & OrderItems dibuat
Payments dibuat
Reviews dibuat

✅ Seeder berhasil!
Admin: admin@gmail.com / password
User : user@gmail.com / password
```

### 6. Jalankan server
```
npm run dev
```

Server berjalan di: `http://localhost:5000`

Test dengan: `http://localhost:5000/api` → harus muncul:
```json
{ "success": true, "message": "Toko Jualan API berjalan" }
```

---

## SETUP FRONTEND

### 1. Masuk folder frontend
```
cd frontend
```

### 2. Install dependency
```
npm install
```

### 3. Jalankan frontend
```
npm run dev
```

Frontend berjalan di: `http://localhost:3000`

---

## AKUN LOGIN

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@gmail.com   | password |
| User  | user@gmail.com    | password |

---

## INSOMNIA

### Import Collection
1. Buka Insomnia
2. Klik **Import** → pilih file `insomnia_collection.json`
3. Environment sudah tersedia dengan `base_url` dan `token`

### Cara pakai JWT Token
1. Jalankan request **Login**
2. Copy nilai `token` dari response
3. Buka **Environment** → paste token ke field `token`
4. Semua request dengan `Bearer {{ token }}` otomatis terisi

### Urutan Testing
1. Register / Login → copy token
2. Get All Categories
3. Create Category (admin)
4. Create Product (admin)
5. Create Order (user)
6. Upload Payment (user) — gunakan form-data
7. Verify Payment (admin)
8. Create Review (user) — hanya jika order completed
9. Get Dashboard Stats (admin)
10. Export Excel (admin)
11. Export PDF (admin)

---

## API ENDPOINTS

### Auth
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| POST | /api/auth/register | - | Daftar akun |
| POST | /api/auth/login | - | Login |
| POST | /api/auth/logout | Bearer | Logout |
| GET | /api/auth/profile | Bearer | Profil |
| PUT | /api/auth/profile | Bearer | Update profil |
| PUT | /api/auth/change-password | Bearer | Ganti password |

### Categories
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| GET | /api/categories | - | List semua kategori |
| GET | /api/categories/:id | - | Detail kategori |
| POST | /api/categories | Admin | Buat kategori |
| PUT | /api/categories/:id | Admin | Update kategori |
| DELETE | /api/categories/:id | Admin | Hapus kategori |

### Products
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| GET | /api/products | - | List produk (support query: category_id, status, search) |
| GET | /api/products/:slug | - | Detail produk + reviews |
| POST | /api/products | Admin | Buat produk (multipart/form-data) |
| PUT | /api/products/:id | Admin | Update produk |
| DELETE | /api/products/:id | Admin | Hapus produk |

### Orders
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| POST | /api/orders | User | Buat order |
| GET | /api/orders/my | User | Order milik sendiri |
| GET | /api/orders/:id | User/Admin | Detail order |
| GET | /api/orders | Admin | Semua order |
| PUT | /api/orders/:id/status | Admin | Update status order |

### Payments
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| POST | /api/payments/order/:order_id | User | Upload bukti bayar |
| GET | /api/payments | Admin | Semua payment |
| PUT | /api/payments/:id/verify | Admin | Verifikasi payment |

### Reviews
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| POST | /api/reviews | User | Buat review (order harus completed) |
| GET | /api/reviews/product/:product_id | - | Review produk |
| GET | /api/reviews | Admin | Semua review |
| DELETE | /api/reviews/:id | Admin | Hapus review |

### Dashboard & Export
| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| GET | /api/dashboard | Admin | Statistik dashboard |
| GET | /api/export/excel | Admin | Download Excel |
| GET | /api/export/pdf | Admin | Download PDF |

---

## HALAMAN FRONTEND

### User
- `/` — Landing page (hero, fitur, produk)
- `/products` — Daftar produk dengan filter
- `/products/:slug` — Detail produk + ulasan
- `/cart` — Keranjang belanja
- `/checkout` — Checkout
- `/orders` — Pesanan saya
- `/orders/:id` — Detail pesanan + upload bayar + review
- `/profile` — Edit profil & ganti password
- `/login` — Login
- `/register` — Daftar

### Admin (prefix `/admin`)
- `/admin` — Dashboard statistik + chart
- `/admin/categories` — CRUD kategori
- `/admin/products` — CRUD produk + upload gambar
- `/admin/orders` — Kelola & update status order
- `/admin/payments` — Verifikasi pembayaran
- `/admin/reviews` — Kelola review
- `/admin/export` — Export Excel & PDF

---

## TECH STACK

**Backend**: Express.js, Sequelize ORM, MySQL, JWT, Multer, XLSX, PDFKit  
**Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, Recharts
