variable "environment" {
  description = "Environment name (e.g., prod, staging, dev)"
  type        = string
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