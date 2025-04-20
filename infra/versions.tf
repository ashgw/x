terraform {
  required_providers {
    # no need anymore 
    # aws = {
    #   source  = "hashicorp/aws"
    #   version = "~> 4.0"
    # }
    neon = {
      source = "kislerdm/neon"
      version = "~> 0.2"
    }
  }
  required_version = ">= 1.3.0"
}

provider "neon" {
  api_key = var.neon_api_key
}
