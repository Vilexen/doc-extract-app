aws_region = "us-east-1"
project_name = "invoice-extraction-platform"
vpc_cidr = "10.0.0.0/16"
backend_image = "invoice-extraction-platform/backend:latest"
frontend_image = "invoice-extraction-platform/frontend:latest"
desired_count = 2
container_port = 5000
frontend_container_port = 80