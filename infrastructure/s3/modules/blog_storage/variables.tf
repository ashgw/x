variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "region" {
  description = "AWS region for resources"
  type        = string
}

variable "allowed_origins" {
  description = "List of origins allowed to access the bucket"
  type        = list(string)
}

locals {
  # Obfuscate the bucket name by adding a hash
  bucket_name = "${var.environment}-${var.project_name}-${random_id.bucket_suffix.hex}"
  
  folders = [
    "image/",
    "audio/",
    "mdx/"
  ]
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
} 