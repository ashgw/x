# Create buckets for all environments at once
module "s3_bucket" {
  for_each = toset(var.environments)
  
  source = "./modules/storage"
  
  environment      = each.key
  project_name     = var.project_name
  region           = var.region
  allowed_origins  = var.allowed_origins
}