provider "aws" {
  region = var.region
}

module "blog_storage" {
  source = "./modules/storage"
  
  environment      = var.environment  # This is used as the current environment
  project_name     = var.project_name
  region           = var.region
  allowed_origins  = var.allowed_origins
}

# If you want to create all environments at once, uncomment this:
/*
module "multi_environment_storage" {
  for_each = toset(var.environments)
  
  source = "./modules/storage"
  
  environment      = each.key
  project_name     = var.project_name
  region           = var.region
  allowed_origins  = var.allowed_origins
}
*/ 