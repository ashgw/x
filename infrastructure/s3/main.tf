module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.5.0"

  bucket = var.project_name
  acl    = "private"

  cors_rule = [{
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = var.allowed_origins
  }]
} 