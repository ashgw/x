
provider "aws" {
  region = var.aws_region
}

module "images_s3_bucket" {
  source = "./public-content/images"
}

module "ecr" {
  source = "./container-registry"
}

