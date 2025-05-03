terraform {
  required_providers {
    koyeb = {
      source  = "koyeb/koyeb"
      version = "~> 0.1.2"
    }
  }
  required_version = ">= 1.3.0"
}

provider "koyeb" {
  # Token will be sourced from KOYEB_TOKEN environment variable
}
