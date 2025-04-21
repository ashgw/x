# Multi-environment outputs only
output "bucket_names" {
  description = "Map of environment to bucket name"
  value = {
    dev     = aws_s3_bucket.dev_bucket.bucket
    preview = aws_s3_bucket.preview_bucket.bucket
    prod    = aws_s3_bucket.prod_bucket.bucket
  }
}

output "bucket_arns" {
  description = "Map of environment to bucket ARN"
  value = {
    dev     = aws_s3_bucket.dev_bucket.arn
    preview = aws_s3_bucket.preview_bucket.arn
    prod    = aws_s3_bucket.prod_bucket.arn
  }
}

output "bucket_domain_names" {
  description = "Map of environment to bucket domain name"
  value = {
    dev     = aws_s3_bucket.dev_bucket.bucket_domain_name
    preview = aws_s3_bucket.preview_bucket.bucket_domain_name
    prod    = aws_s3_bucket.prod_bucket.bucket_domain_name
  }
}

output "role_arns" {
  description = "ARNs of the IAM roles"
  value = {
    dev     = aws_iam_role.dev_role.arn
    preview = aws_iam_role.preview_role.arn
    prod    = aws_iam_role.prod_role.arn
  }
}
