# no need for this anymores
# provider "aws" {
#   region = var.aws_region
# }

# no need for this anymore
# module "public_content" {
#   source = "./content/public"
# }

# # this is gone not used anymore, can delete dawg
# module "ecr" {
#   source = "./container-registry"
# }

# Create the main project
resource "neon_project" "main" {
  name = var.project_name
  region_id = "aws-us-east-2"
}

# Development branch
resource "neon_branch" "development" {
  project_id = neon_project.main.id
  name       = "dev"
  parent_id  = neon_project.main.default_branch_id
}

# Preview branch template
resource "neon_branch" "preview" {
  project_id = neon_project.main.id
  name       = "preview"
  parent_id  = neon_project.main.default_branch_id
}

# Create endpoints for each branch
resource "neon_endpoint" "development" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.development.id
  type       = "read_write"
}

resource "neon_endpoint" "preview" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.preview.id
  type       = "read_write"
}

# Create databases for each branch
resource "neon_database" "prod_db" {
  project_id = neon_project.main.id
  branch_id  = neon_project.main.default_branch_id
  name       = "prod_db"
  owner_name = neon_project.main.database_user
}

resource "neon_database" "dev_db" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.development.id
  name       = "dev_db"
  owner_name = neon_project.main.database_user

  depends_on = [neon_endpoint.development]
}

resource "neon_database" "preview_db" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.preview.id
  name       = "preview_db"
  owner_name = neon_project.main.database_user

  depends_on = [neon_endpoint.preview]
}

# Output connection details
output "project_id" {
  value = neon_project.main.id
}

output "production_branch_id" {
  value = neon_project.main.default_branch_id
}

output "development_branch_id" {
  value = neon_branch.development.id
}

output "preview_branch_id" {
  value = neon_branch.preview.id
}

# Output the connection details
output "database_user" {
  value = neon_project.main.database_user
}

output "connection_uri" {
  value     = neon_project.main.connection_uri
  sensitive = true
}

