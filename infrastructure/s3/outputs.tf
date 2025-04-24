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

# IAM user access keys
output "dev_user_access" {
  description = "Development bucket user access credentials"
  value = {
    user_name        = aws_iam_user.dev_user.name
    access_key_id    = aws_iam_access_key.dev_user_key.id
    bucket_name      = aws_s3_bucket.dev_bucket.bucket
    bucket_domain    = aws_s3_bucket.dev_bucket.bucket_domain_name
  }
}

output "preview_user_access" {
  description = "Preview bucket user access credentials"
  value = {
    user_name        = aws_iam_user.preview_user.name
    access_key_id    = aws_iam_access_key.preview_user_key.id
    bucket_name      = aws_s3_bucket.preview_bucket.bucket
    bucket_domain    = aws_s3_bucket.preview_bucket.bucket_domain_name
  }
}

output "prod_user_access" {
  description = "Production bucket user access credentials"
  value = {
    user_name        = aws_iam_user.prod_user.name
    access_key_id    = aws_iam_access_key.prod_user_key.id
    bucket_name      = aws_s3_bucket.prod_bucket.bucket
    bucket_domain    = aws_s3_bucket.prod_bucket.bucket_domain_name
  }
}

# Secret access keys - these are sensitive and won't print in console
output "dev_user_secret" {
  description = "Development bucket user secret access key"
  value       = aws_iam_access_key.dev_user_key.secret
  sensitive   = true
}

output "preview_user_secret" {
  description = "Preview bucket user secret access key"
  value       = aws_iam_access_key.preview_user_key.secret
  sensitive   = true
}

output "prod_user_secret" {
  description = "Production bucket user secret access key"
  value       = aws_iam_access_key.prod_user_key.secret
  sensitive   = true
}

# Role ARNs
output "role_arns" {
  description = "ARNs of the IAM roles"
  value = {
    dev     = aws_iam_role.dev_role.arn
    preview = aws_iam_role.preview_role.arn
    prod    = aws_iam_role.prod_role.arn
  }
}
