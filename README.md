# 🛒 Secure E-Commerce Platform

A secure, full-stack e-commerce application built with Next.js (Frontend) and Node.js (Backend).

## 🚀 Deployment Guide (Oracle Free Tier 1GB VPS)

This project is containerized with a **Unified Dockerfile** to run both Frontend and Backend in a single container.

### ⚠️ Critical Memory Warning
Building Next.js requires **>1GB RAM**. Do **NOT** run `docker build` directly on your free-tier VPS, or it will crash.
**Solution:** Build the image on your local computer, then upload it.

---

### Step 1: Build Image (On Your PC)

Run this command in the project root.
*Replace `YOUR_VPS_IP` with your server's public IP.*

```bash
# Standard Build (Windows/Linux x86)
docker build -t app --build-arg NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:5000 .

# 🍎 Mac Users (M1/M2/M3) - IMPORTANT:
# You must build for AMD64 to run on standard Oracle VPS
docker build --platform linux/amd64 -t app --build-arg NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:5000 .
```

### Step 2: Save & Transfer

Save the built image to a file and upload it to your VPS.

```bash
# 1. Save image
docker save -o app.tar app

# 2. Upload (Replace 'ubuntu' with your VPS username, e.g., 'opc')
scp app.tar ubuntu@YOUR_VPS_IP:~/
```

### Step 3: Run on VPS

SSH into your server and execute:

```bash
# 1. Load the image
docker load -i app.tar

# 2. Run the Container
# Replace DATABASE_URL with your Oracle/Postgres connection string.
# Replace JWT_SECRET with a strong random string.
docker run -d \
  --name ecommerce-app \
  --restart always \
  -p 3000:3000 \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db_name" \
  -e JWT_SECRET="change-this-to-a-secure-secret" \
  app
```

### Step 4: Database Setup

After the app is running, initialize the database schema.

```bash
docker exec -it ecommerce-app sh -c "cd backend && npx prisma migrate deploy && npx prisma db seed"
```

---

## 🛡️ Oracle Cloud Firewall (Security List)

If you cannot access the site, ensure you have opened the ports in Oracle Cloud Console:
1.  Go to **Networking** -> **Virtual Cloud Networks**.
2.  Click your VCN -> **Security Lists** -> **Default Security List**.
3.  Add **Ingress Rule**:
    *   **Source CIDR**: `0.0.0.0/0`
    *   **Destination Port Range**: `3000,5000`
    *   **Protocol**: TCP

---

## 🛠️ Local Development

To run the project locally without Docker:

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

*   Frontend: `http://localhost:3000`
*   Backend: `http://localhost:5000`

---

## 🧪 Testing Docker Locally (Linux)

To test the container on your own machine before deploying:

1.  **Stop existing servers**: Close any terminals running `npm run dev`.
2.  **Build**:
    ```bash
    docker build -t test-app --build-arg NEXT_PUBLIC_API_URL=http://localhost:5000 .
    ```
3.  **Run**:
    ```bash
    # Use 'host' network to access your local database seamlessly
    docker run --rm --network host --env-file backend/.env test-app
    ```
    *   App will be at `http://localhost:3000`.

