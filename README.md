# Conver Cart Application

This repository contains the full-stack Conver Cart application with backend and frontend services.

---

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Node.js installed (for frontend)

##### .env.example

>WC_BASE_URL=https://wp-multisite.convertcart.com
>WC_CONSUMER_KEY=ck_af82ae325fbee1c13f31eb26148f4dea473b
>WC_CONSUMER_SECRET=cs_2d8cc467c5b91a80f5ed18dd3c282ee8299c912
>MONGO_URI=mongodb+srv://rajdips834:22@cluster0.hsk06o3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

>PORT=3000




### Backend Setup
1. Ensure Docker and Docker Compose are installed on your system.
2. Place your environment variables in a `.env` file 
3. Start the backend server using Docker Compose:

>docker-compose up


The backend API will be running at `http://localhost:PORT` (default port specified in `.env`).

### Frontend Setup
1. Navigate to the frontend directory:

> cd frontend
> npm i


> npm run dev

Rename `.env.example` to `.env` and fill in the appropriate values.

---

## Description of Ingestion Logic

The backend service includes an ingestion logic that connects to WooCommerce to fetch product data. It periodically syncs product listings including title, price, stock status, and category. The data is then compared with pre existing data from local DB and only the new data is added
Key steps of ingestion:

- Authentication with WooCommerce using API credentials.
- Fetching product data in batches.
- Filtering of pre-existing data
- Storage of data in MongoDB collections.
- Logging ingestion status and error reporting.

---

## Sample Input for Segmentation

Segmentation queries can be provided as query string filters with support for comparison operators. Example input for filtering: price > 5000, category = Smartphones, stock_status = instock

SegmentationAPI: https://conver-cart.vercel.app/products/segments/evaluate
Segmentation payload: {filter: "price > 5000,category = Smartphones,stock_status = instock"}


This query returns products priced above 5000, in the Smartphones category, and currently in stock.

---

## Live Demos

- Backend API: [https://conver-cart.vercel.app](https://conver-cart.vercel.app)
- Frontend App: [https://conver-cart-fwwk.vercel.app](https://conver-cart-fwwk.vercel.app)



