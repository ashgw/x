# no need for this anymore
# variable "aws_region" {
#   type    = string
#   default = "us-east-2"
# }

variable "neon_api_key" {
  description = "Neon API key"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Name of the Neon project"
  type        = string
  default     = "ashgw-project"
}