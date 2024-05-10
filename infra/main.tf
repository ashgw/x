
provider "aws" {
  region = var.aws_region
}

module "public_content" {
  source = "./content/public"
}

module "ecr" {
  source = "./container-registry"
}

