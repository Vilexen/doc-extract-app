# Invoice Extraction Platform

A production-quality micro-SaaS for Chartered Accountants with AI-powered invoice extraction.

## Overview

This platform provides AI-powered invoice and financial document extraction for Indian Chartered Accountants and accounting professionals. Users upload invoice images or PDFs, and the system processes them using OCR + AI, extracts structured accounting information, validates the extracted data, highlights anything uncertain, and presents everything in a beautiful editable interface.

## Features

- **Real OCR + AI Processing**: Uses multiple OCR engines (Amazon Textract, Google Vision AI, Tesseract) combined with AI models (LayoutLMv3, Donut, BERT/NER) and Claude for reasoning
- **Human-in-the-Loop Review**: Side-by-side comparison view with field-level editing and confidence scoring
- **Accounting Validation**: Mathematical validation (line items sum to subtotal, tax calculations), date validation, vendor validation, PO matching
- **Duplicate Detection**: Exact and near-duplicate detection using fuzzy matching algorithms
- **Batch Processing**: Process hundreds of invoices simultaneously with progress tracking
- **Premium UI**: Fluid animations, micro-interactions, responsive design, WCAG 2.1 AA accessibility
- **Export Functionality**: CSV, JSON, Excel, PDF formats with accounting system integrations
- **Vendor Management**: Central vendor database with performance tracking
- **Analytics Dashboard**: Real-time metrics, processing trends, vendor performance analysis
- **Secure & Compliant**: AES-256 encryption, TLS 1.2+, GDPR/CCPA compliant, role-based access control
- **Modular Architecture**: Microservices-based with Docker/Kubernetes deployment

## Technology Stack

### Frontend
- React 18 + TypeScript
- Redux Toolkit for state management
- Material-UI (MUI) v5 for UI components
- React Router v6 for navigation
- Webpack 5 for bundling
- Babel 7 for JSX/ES6+ transpilation

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT-based authentication
- Redis for caching
- Apache Kafka/RabbitMQ for message queuing
- AWS S3/Google Cloud Storage for file storage

### AI/OCR Pipeline
- Amazon Textract (primary OCR)
- Google Vision AI (secondary OCR)
- Tesseract OCR (open-source fallback)
- Azure Form Recognizer (specialized layouts)
- LayoutLMv3 for semantic understanding
- Donut for document-to-format conversion
- Fine-tuned BERT/NER models for field extraction
- Claude for complex reasoning and disambiguation

### DevOps
- Docker containers
- Kubernetes orchestration
- GitHub Actions CI/CD
- Prometheus/Grafana monitoring
- ELK stack (Elasticsearch, Logstash, Kibana) for logging
- Terraform for infrastructure as code

## Getting Started

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.0
- Redis >= 6.0
- (Optional) Docker >= 20.10.x
- (Optional) Docker Compose >= 2.0.0

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database (creates admin user and sample vendors)
npm run init-db

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

### Production Build
```bash
# Build frontend for production
npm run build

# Start backend in production mode
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh access token

### Invoice Management
- `POST /api/upload` - Upload invoice file
- `GET /api/invoices` - Get invoices with filtering and pagination
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/process` - Start processing invoice

### Vendor Management
- `GET /api/vendors` - Get vendors with filtering and pagination
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/trends` - Get analytics trends
- `GET /api/analytics/vendors` - Get vendor analytics

## Environment Variables

### Backend (.env)
```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/invoice_extraction

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# File Upload Configuration
MAX_FILE_SIZE=10485760 # 10MB
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/tiff

# OCR Configuration
OCR_ENGINE_PRIMARY=textract
OCR_ENGINE_SECONDARY=vision
OCR_CONFIDENCE_THRESHOLD=0.85

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS Configuration
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=invoice-extraction-platform
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing

### Backend Tests
```bash
# Run backend tests
npm test
```

### Frontend Tests
```bash
# Run frontend tests
npm test
```

## Deployment

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check status
kubectl get pods
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with ❤️ for Chartered Accountants and accounting professionals
- Special thanks to the open-source community for OCR/AI libraries
- Inspired by the need for intelligent document processing in finance