# E-commerce API Documentation

## 📝 คำอธิบาย
API สำหรับระบบร้านค้าออนไลน์ที่พัฒนาด้วย Node.js, Express, Prisma และ MySQL/PostgreSQL รองรับฟีเจอร์ครบครัน ตั้งแต่การจัดการสินค้า การสั่งซื้อ การชำระเงิน และระบบผู้ดูแล

## 🚀 เทคโนโลยีที่ใช้
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Framework
- **Prisma** - ORM Database
- **MySQL/PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Stripe** - Payment Processing
- **Cloudinary** - Image Management
- **CORS** - Cross-Origin Resource Sharing

## 📦 การติดตั้ง

### 1. Clone Repository
```bash
git clone <repository-url>
cd ecommerce-api
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` และเพิ่มตัวแปรต่อไปนี้:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
# หรือสำหรับ PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="your_direct_database_url"

JWT_SECRET="your_jwt_secret_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
```

### 4. Migration Database
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. รันโปรเจค
```bash
npm start
```

เซิร์ฟเวอร์จะทำงานที่ `http://localhost:5000`

## 🗃️ โครงสร้างฐานข้อมูล

### หลักฐานข้อมูล
- **User** - ข้อมูลผู้ใช้งาน
- **Product** - ข้อมูลสินค้า  
- **Category** - หมวดหมู่สินค้า
- **Image** - รูปภาพสินค้า
- **Cart** - ตะกร้าสินค้า
- **ProductOnCart** - สินค้าในตะกร้า
- **Order** - คำสั่งซื้อ
- **ProductOnOrder** - สินค้าในคำสั่งซื้อ

## 🔐 Authentication
API ใช้ JWT Token สำหรับการยืนยันตัวตน ส่ง Token ใน Header:
```
Authorization: Bearer <your_jwt_token>
```

### บทบาทผู้ใช้
- **user** - ผู้ใช้ทั่วไป
- **admin** - ผู้ดูแลระบบ

## 📋 API Endpoints

### 🔑 Authentication (`/api`)

#### สมัครสมาชิก
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### เข้าสู่ระบบ
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "password123"
}
```

#### ตรวจสอบผู้ใช้ปัจจุบัน
```http
POST /current-user
Authorization: Bearer <token>
```

#### ตรวจสอบผู้ดูแล
```http
POST /current-admin
Authorization: Bearer <admin_token>
```

### 👥 User Management (`/api`)

#### ดูรายชื่อผู้ใช้ (Admin เท่านั้น)
```http
GET /users
Authorization: Bearer <admin_token>
```

#### เปลี่ยนสถานะผู้ใช้ (Admin เท่านั้น)  
```http
POST /change-status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "id": 1,
  "enabled": true
}
```

#### เปลี่ยนบทบาทผู้ใช้ (Admin เท่านั้น)
```http
POST /change-role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "id": 1,
  "role": "admin"
}
```

### 📦 Product Management (`/api`)

#### สร้างสินค้า
```http
POST /product
Content-Type: application/json

{
  "title": "ชื่อสินค้า",
  "description": "รายละเอียดสินค้า",
  "price": 1500.00,
  "quantity": 10,
  "categoryId": 1,
  "images": [
    {
      "asset_id": "asset_id",
      "public_id": "public_id", 
      "url": "image_url",
      "secure_url": "secure_image_url"
    }
  ]
}
```

#### ดูสินค้าทั้งหมด
```http
GET /products/{count}
```

#### ดูสินค้าตาม ID
```http
GET /product/{id}
```

#### อัปเดตสินค้า
```http
PUT /product/{id}
Content-Type: application/json

{
  "title": "ชื่อสินค้าใหม่",
  "description": "รายละเอียดใหม่",
  "price": 2000.00,
  "quantity": 15,
  "categoryId": 2,
  "images": [...]
}
```

#### ลบสินค้า
```http
DELETE /product/{id}
```

#### ค้นหาสินค้า
```http
POST /search/filters
Content-Type: application/json

{
  "query": "คำค้นหา",
  "category": [1, 2, 3],
  "price": [100, 5000]
}
```

#### ดูสินค้าตามเงื่อนไข
```http
POST /productby
Content-Type: application/json

{
  "sort": "price",
  "order": "asc",
  "limit": 10
}
```

### 🏷️ Category Management (`/api`)

#### สร้างหมวดหมู่ (Admin เท่านั้น)
```http
POST /category
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "ชื่อหมวดหมู่"
}
```

#### ดูหมวดหมู่ทั้งหมด
```http
GET /category
```

#### ลบหมวดหมู่ (Admin เท่านั้น)
```http
DELETE /category/{id}
Authorization: Bearer <admin_token>
```

### 🛒 Cart Management (`/api`)

#### เพิ่มสินค้าไปยังตะกร้า
```http
POST /user/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "cart": [
    {
      "id": 1,
      "count": 2,
      "price": 1500.00
    }
  ]
}
```

#### ดูตะกร้าสินค้า
```http
GET /user/cart
Authorization: Bearer <token>
```

#### ล้างตะกร้าสินค้า
```http
DELETE /user/cart
Authorization: Bearer <token>
```

### 📍 Address Management (`/api`)

#### บันทึกที่อยู่
```http
POST /user/address
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "123 ถนนสุขุมวิท กรุงเทพฯ 10110"
}
```

### 💳 Payment & Orders (`/api`)

#### สร้าง Payment Intent (Stripe)
```http
POST /user/create-payment-intent
Authorization: Bearer <token>
```

#### บันทึกคำสั่งซื้อ
```http
POST /user/order
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntent": {
    "id": "pi_xxx",
    "amount": 150000,
    "status": "succeeded",
    "currency": "thb"
  }
}
```

#### ดูคำสั่งซื้อของผู้ใช้
```http
GET /user/order
Authorization: Bearer <token>
```

### 👨‍💼 Admin Orders (`/api`)

#### ดูคำสั่งซื้อทั้งหมด (Admin เท่านั้น)
```http
GET /admin/orders
Authorization: Bearer <admin_token>
```

#### เปลี่ยนสถานะคำสั่งซื้อ (Admin เท่านั้น)
```http
PUT /admin/order-status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "orderId": 1,
  "orderStatus": "Processing"
}
```

### 🖼️ Image Management (`/api`)

#### อัปโหลดรูปภาพ (Admin เท่านั้น)
```http
POST /images
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "image": "base64_image_string"
}
```

#### ลบรูปภาพ (Admin เท่านั้น)
```http
POST /removeimages
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "public_id": "image_public_id"
}
```

## 📊 สถานะคำสั่งซื้อ
- `"Not Process"` - ยังไม่ดำเนินการ
- `"Processing"` - กำลังดำเนินการ
- `"Shipped"` - จัดส่งแล้ว
- `"Delivered"` - ส่งมอบแล้ว
- `"Cancelled"` - ยกเลิก

## ⚠️ Error Responses
API จะส่งกลับข้อผิดพลาดในรูปแบบ JSON:
```json
{
  "error": "คำอธิบายข้อผิดพลาด"
}
```

### Status Codes ที่ใช้
- `200` - สำเร็จ
- `400` - Bad Request  
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🚀 Deploy บน Vercel
โปรเจคพร้อม deploy บน Vercel โดยใช้ไฟล์ `vercel.json` ที่มีอยู่

```bash
npm install -g vercel
vercel --prod
```

## 📝 หมายเหตุ
- ตรวจสอบให้แน่ใจว่าได้ตั้งค่า Environment Variables ครบถ้วน
- Database จะใช้ MySQL เป็นค่าเริ่มต้น แต่สามารถเปลี่ยนเป็น PostgreSQL ได้
- การชำระเงินใช้ Stripe ในโหมด Test Mode
- รูปภาพจัดเก็บผ่าน Cloudinary
