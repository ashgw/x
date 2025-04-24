variable "project_name" {
  description = "Base name for the project"
  type        = string
}

variable "region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
}

variable "environment_configs" {
  description = "Configuration for each environment"
  type = map(object({
    suffix               = string
    random_suffix_length = number
    deletion_protection  = bool
    versioning_enabled   = bool
  }))
  default = {
    dev = {
      suffix               = "dev"
      random_suffix_length = 8
      deletion_protection  = false
      versioning_enabled   = false
    }
    preview = {
      suffix               = "preview"
      random_suffix_length = 8
      deletion_protection  = true
      versioning_enabled   = true
    }
    prod = {
      suffix               = "prod"
      random_suffix_length = 12
      deletion_protection  = true
      versioning_enabled   = true
    }
  }
} 