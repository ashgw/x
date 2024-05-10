resource "aws_ecr_repository" "ecr" {
  name  = "${lower(var.repo_namespace)}/${var.image_name}"
  force_delete = var.ecr_force_delete
  image_tag_mutability = var.image_mutability
  image_scanning_configuration {
    scan_on_push = true
  }
}
