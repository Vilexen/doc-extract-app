variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "invoice-extraction-platform"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "backend_image" {
  description = "Docker image for backend service"
  type        = string
  default     = "invoice-extraction-platform/backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend service"
  type        = string
  default     = "invoice-extraction-platform/frontend:latest"
}

variable "desired_count" {
  description = "Desired number of tasks for each service"
  type        = number
  default     = 2
}

variable "container_port" {
  description = "Container port for the application"
  type        = number
  default     = 5000
}

variable "frontend_container_port" {
  description = "Container port for the frontend service"
  type        = number
  default     = 80
}