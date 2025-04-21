# Initially use local state - comment out the remote backend
terraform {
  # We'll configure remote backend later after the bucket exists
  # backend "s3" {
  #   # Will be configured after first apply
  # }
}

module "blog_storage" {
  source = "./modules/blog_storage"
  
  environment     = var.environment
  project_name    = var.project_name
  region          = var.region
  allowed_origins = var.allowed_origins
} 