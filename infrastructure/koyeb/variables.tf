variable "koyeb_token" {
  description = "Koyeb API token"
  type        = string
  sensitive   = true
}

variable "app_name" {
  description = "Name of the Koyeb app"
  type        = string
  default     = "blog"
}

variable "service_name" {
  description = "Name of the Koyeb service"
  type        = string
  default     = "blog"
}

variable "docker_image" {
  description = "Docker image to deploy"
  type        = string
  default     = "ashgw/blog:latest"
}

variable "port" {
  description = "Port the service listens on"
  type        = number
  default     = 3001
}

variable "environment_variables" {
  description = "Environment variables for the service"
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "instance_type" {
  description = "Koyeb instance type"
  type        = string
  default     = "micro"
}

variable "region" {
  description = "Koyeb deployment region"
  type        = string
  default     = "fra"
}
