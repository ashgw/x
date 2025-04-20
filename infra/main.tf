provider "aws" {
  region = var.aws_region
}

module "public_content" {
  source = "./content/public"
}

# this is gone not used anymore, can delete dawg
module "ecr" {
  source = "./container-registry"
}

resource "neon_project" "main" {
  name = var.project_name
  region_id = "aws-us-east-2"
}

# Production branch (main)
resource "neon_branch" "production" {
  project_id = neon_project.main.id
  name       = "main"
}

# Development branch
resource "neon_branch" "development" {
  project_id = neon_project.main.id
  name       = "dev"
  parent_id  = neon_branch.production.id
}

# Preview branch template (can be cloned for PR previews)
resource "neon_branch" "preview" {
  project_id = neon_project.main.id
  name       = "preview"
  parent_id  = neon_branch.production.id
}

# Create databases for each branch
resource "neon_database" "prod_db" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.production.id
  name       = "prod_db"
}

resource "neon_database" "dev_db" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.development.id
  name       = "dev_db"
}

resource "neon_database" "preview_db" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.preview.id
  name       = "preview_db"
}

# Output connection strings
output "production_connection_string" {
  value     = neon_branch.production.database_connection_string
  sensitive = true
}

output "development_connection_string" {
  value     = neon_branch.development.database_connection_string
  sensitive = true
}

output "preview_connection_string" {
  value     = neon_branch.preview.database_connection_string
  sensitive = true
}

