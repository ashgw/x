variable "ecr_force_delete" {
  description = "Forces deletion of Docker images before resource is destroyed"
  default     = true
  type        = bool
}


variable "repo_namespace" {
  default     = "ashgw-rg"
  type        = string
}

variable "image_name" {
  type = string
  default = "main-site"
}

variable "image_mutability" {
  default = "MUTABLE"
  type = string
}