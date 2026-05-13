# Cloud-Native E-Commerce Platform

A complete microservices-based e-commerce platform built with Node.js, React, MongoDB, Docker, Kubernetes, and Serverless Functions.

## Architecture

- **User Service** (Port 3001)
- **Product Service** (Port 3002) - Seeds data on startup
- **Cart Service** (Port 3003)
- **Order Service** (Port 3004)
- **Payment Service** (Port 3005) - Triggers serverless webhook
- **API Gateway** (Port 8080) - Proxies to microservices
- **Serverless Webhook** (Port 5001) - Simulates a Firebase Function for post-payment actions
- **Frontend** (Port 3000 local / 80 Docker) - React SPA
- **Database** - MongoDB (Database per service)

## Local Setup (Docker Compose)

1. Make sure you have Docker and Docker Compose installed.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - Frontend: `http://localhost:3000`
   - API Gateway: `http://localhost:8080`

## Kubernetes Deployment

1. Ensure you have a running Kubernetes cluster (e.g., Minikube, Docker Desktop) and `kubectl` configured.
2. Apply the manifests from the `k8s/` directory:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/ingress.yaml
   ```
3. Map the ingress host to your local machine:
   - Add `127.0.0.1 cloudnative-ecommerce.local` to your `/etc/hosts` file (or `C:\Windows\System32\drivers\etc\hosts` on Windows).
4. Access the application via `http://cloudnative-ecommerce.local`

## Serverless Function Integration

The payment service simulates processing a payment. On success, it sends an HTTP POST request to a webhook. In a production environment, this would be a GCP Cloud Function or AWS Lambda. For this demo, it is mocked using a Node Express wrapper around a Firebase Function structure inside the `serverless/` folder.

- **Trigger:** Handled automatically when a user clicks "Pay Now" on the Checkout page and payment succeeds.
- **Implementation:** Real Firebase Function code is provided in `serverless/index.js`, alongside an Express wrapper for local Docker Compose testing.

## CI/CD Pipeline

The `.github/workflows/main.yml` file contains a GitHub Actions pipeline that automatically:
- Builds Docker images for all services.
- Pushes images to Docker Hub.
- Applies Kubernetes manifests (requires secrets setup).
