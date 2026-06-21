# Mini E-Commerce API

A production-style Node.js REST API built with Express.js, PostgreSQL, Prisma ORM, and Groq.

The application manages:

* Customers
* Products
* Orders
* Inventory
* AI-powered Natural Language SQL Queries

---

## Features

### Customer Management

* Create customer
* Get all customers
* Get customer by ID
* Update customer
* Delete customer

### Product Management

* Create product
* Get products with pagination
* Filter by category
* Filter in-stock products
* Get product by ID
* Update product
* Delete product

### Order Management

* Create order
* Automatic inventory deduction
* Order status workflow
* Cancel orders
* Inventory restoration on cancellation
* Get order details

### AI Query Module

Ask questions in plain English:

Examples:

* Show all products
* Show out of stock products
* Show products in Electronics category

Security measures:

* Only SELECT queries allowed
* Table whitelist protection
* LIMIT enforcement
* SQL validation layer

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Joi Validation
* Winston Logger
* Groq  API
* Node Test Runner

---

## Prerequisites

Before running the project make sure you have:

* Node.js 22+
* PostgreSQL 15+
* npm

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd mini-ecommerce
```
## Verifying PostgreSQL Installation

Before proceeding with the database setup, ensure that PostgreSQL is installed and running on your machine. You can verify it using your terminal:

### 1. Check CLI Tool Version
Run the following command to check if the PostgreSQL client CLI (`psql`) is available:
```bash
psql --version

2. Verify Database Connection & Service Status
Ensure the PostgreSQL server service is up and running by attempting a connection:

macOS / Linux / Windows:

Bash
psql -U postgres -c "SELECT version();"
(You will be prompted to enter your PostgreSQL root password)

Alternatively, check service status directly:

macOS (Homebrew): brew services list
Linux (systemd): sudo systemctl status postgresql
Windows: Open services.msc and verify that the postgresql-x64 service status is Running.

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE mini_ecommerce;
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/mini_ecommerce

GROQ_API_KEY=your_groq_api_key
```

---

## Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed sample data:

```bash
npm run seed
```

The seed script creates:

* 10 customers
* 10 products
* Multiple product categories:

  * Electronics
  * Clothing
  * Books

---

## Running Application

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

Server will start on:

```text
http://localhost:8080
```

---

## Running Tests

Execute all tests:

```bash
node --test
```

---

---

## Postman Collection Import (Quick Testing)

To make reviewing and testing the API seamless, a pre-configured Postman Collection file containing all endpoints (with sample request bodies) is included in the root directory.

### How to use it:
1. Locate the file named `postman/mini-ecommerce.postman_collection.json` in the root of this project.
2. Open **Postman**.
3. Click the **Import** button in the top-left sidebar workspace.
4. Drag and drop the `mini-ecommerce.postman_collection.json` file into the upload area, or choose **Select Files** to find it.
5. Click **Import** to confirm.

The collection will create a folder structure matching the API modules (`Customer`, `Products`, `Orders`, `AI Query Module`) with valid sample data ready to fire instantly!

---
API Definations
All supported api  definations yaml file are added in api-definations folder. 
---
## AI Query Security

The AI query module includes several safety layers:

* SELECT statements only
* No INSERT
* No UPDATE
* No DELETE
* No DROP
* No ALTER
* Table whitelist validation
* Automatic LIMIT enforcement
* SQL syntax validation

---

## Assumptions

* Product categories are controlled through application validation.
* Orders can only move through allowed status transitions.
* Products referenced by orders cannot be deleted.
* Inventory is automatically updated during order creation and cancellation.

---

## Future Improvements

* Authentication & Authorization
* Docker Support
* OpenAPI / Swagger Documentation
* CI/CD Pipeline
* Role Based Access Control

---

## Author

Shubam Pednekar
