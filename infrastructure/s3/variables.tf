variable "environment" {
  description = "Environment name (e.g., prod, staging, dev)"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "blog-content"
}

variable "region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "allowed_origins" {
  description = "List of origins allowed to access the bucket"
  type        = list(string)
}

variable "environments" {
  description = "List of environments to create buckets for"
  type        = list(string)
  default     = ["dev", "prod", "preview"]
} 