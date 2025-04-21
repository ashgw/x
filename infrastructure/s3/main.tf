# Initially use local state - comment out the remote backend
terraform {
  # We'll configure remote backend later after the bucket exists
  # backend "s3" {
  #   # Will be configured after first apply
  # }
}

module "s3_bucket" {
  for_each = toset(var.environments)
  
  source = "./modules/s3"

  bucket_name      = "${var.project_name}-${each.key}"
  environment      = each.key
  region           = var.region
  allowed_origins  = var.allowed_origins
} 