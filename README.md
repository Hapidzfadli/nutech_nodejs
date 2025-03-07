# Dokumentasi API NuTech PPOB

API ini dibangun untuk memenuhi kebutuhan aplikasi PPOB (Payment Point Online Bank) dengan berbagai fitur seperti registrasi, login, profil pengguna, saldo, layanan pembayaran, dan transaksi.

## Teknologi

- Node.js
- Express.js
- MySQL
- JWT Authentication
- Docker

## Struktur Database

Database terdiri dari 4 tabel utama:

- `users`: Menyimpan data pengguna dan saldo
- `services`: Layanan pembayaran yang tersedia
- `transactions`: Riwayat transaksi pengguna
- `banners`: Banner promosi aplikasi

## Endpoints API

### Modul Membership

#### 1. Registrasi

- **URL**: `/registration`
- **Method**: `POST`
- **Auth**: Publik (Tidak memerlukan token)
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "password123"
  }
  ```
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Registrasi berhasil silahkan login",
    "data": null
  }
  ```

#### 2. Login

- **URL**: `/login`
- **Method**: `POST`
- **Auth**: Publik
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Login Sukses",
    "data": {
      "token": "eyJhbGciOiJS..."
    }
  }
  ```

#### 3. Profil Pengguna

- **URL**: `/profile`
- **Method**: `GET`
- **Auth**: Privat (Memerlukan token)
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile_image": "https://yoururlapi.com/profile.jpeg"
    }
  }
  ```

#### 4. Update Profil

- **URL**: `/profile/update`
- **Method**: `PUT`
- **Auth**: Privat
- **Body**:
  ```json
  {
    "first_name": "John Edited",
    "last_name": "Doe Edited"
  }
  ```
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Update Pofile berhasil",
    "data": {
      "email": "user@example.com",
      "first_name": "John Edited",
      "last_name": "Doe Edited",
      "profile_image": "https://yoururlapi.com/profile.jpeg"
    }
  }
  ```

#### 5. Update Foto Profil

- **URL**: `/profile/image`
- **Method**: `PUT`
- **Auth**: Privat
- **Body**: Form-data dengan field `file` (gambar JPEG/PNG)
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Update Profile Image berhasil",
    "data": {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile_image": "https://yoururlapi.com/profile-updated.jpeg"
    }
  }
  ```

### Modul Informasi

#### 1. Banner

- **URL**: `/banner`
- **Method**: `GET`
- **Auth**: Publik
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": [
      {
        "banner_name": "Banner 1",
        "banner_image": "https://nutech-integrasi.app/dummy.jpg",
        "description": "Lerem Ipsum Dolor sit amet"
      },
      ...
    ]
  }
  ```

#### 2. Layanan

- **URL**: `/services`
- **Method**: `GET`
- **Auth**: Privat
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Sukses",
    "data": [
      {
        "service_code": "PAJAK",
        "service_name": "Pajak PBB",
        "service_icon": "https://nutech-integrasi.app/dummy.jpg",
        "service_tariff": 40000
      },
      ...
    ]
  }
  ```

### Modul Transaksi

#### 1. Cek Saldo

- **URL**: `/balance`
- **Method**: `GET`
- **Auth**: Privat
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Get Balance Berhasil",
    "data": {
      "balance": 100000
    }
  }
  ```

#### 2. Top Up Saldo

- **URL**: `/topup`
- **Method**: `POST`
- **Auth**: Privat
- **Body**:
  ```json
  {
    "top_up_amount": 50000
  }
  ```
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Top Up Balance berhasil",
    "data": {
      "balance": 150000
    }
  }
  ```

#### 3. Transaksi Pembayaran

- **URL**: `/transaction`
- **Method**: `POST`
- **Auth**: Privat
- **Body**:
  ```json
  {
    "service_code": "PULSA"
  }
  ```
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Transaksi berhasil",
    "data": {
      "invoice_number": "INV20250306-001",
      "service_code": "PULSA",
      "service_name": "Pulsa",
      "transaction_type": "PAYMENT",
      "total_amount": 40000,
      "created_on": "2025-03-06T10:10:10.000Z"
    }
  }
  ```

#### 4. Riwayat Transaksi

- **URL**: `/transaction/history?offset=0&limit=10`
- **Method**: `GET`
- **Auth**: Privat
- **Query Params**:
  - `offset`: Mulai dari data ke-berapa (opsional)
  - `limit`: Batas jumlah data (opsional)
- **Response Sukses**:
  ```json
  {
    "status": 0,
    "message": "Get History Berhasil",
    "data": {
      "offset": 0,
      "limit": 10,
      "records": [
        {
          "invoice_number": "INV20250306-001",
          "transaction_type": "PAYMENT",
          "description": "Pulsa",
          "total_amount": 40000,
          "created_on": "2025-03-06T10:10:10.000Z"
        },
        ...
      ]
    }
  }
  ```

## Kode Status

- `0`: Sukses
- `102`: Parameter tidak valid
- `103`: Username atau password salah
- `108`: Token tidak valid atau kadaluwarsa
- `999`: Internal Server Error

## Deployment

Aplikasi ini menggunakan Docker dan Docker Compose untuk deployment. Konfigurasi Nginx sebagai reverse proxy untuk subdomain nutech-test.hapidzfadli.com.

Langkah-langkah deployment:

1. Clone repositori
2. Konfigurasikan file .env
3. Jalankan `docker-compose up -d`
4. Akses API melalui subdomain

## Pengembangan

API ini dibangun menggunakan arsitektur layering:

- Controllers: Menangani request dan response HTTP
- Services: Berisi logika bisnis
- Config: Konfigurasi database dan lingkungan
- Middlewares: Autentikasi dan validasi
- Utils: Fungsi-fungsi pembantu
