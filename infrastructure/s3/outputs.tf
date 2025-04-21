output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = module.blog_storage.bucket_name
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = module.blog_storage.cloudfront_domain_name
}

output "iam_user_name" {
  description = "The name of the IAM user with access to the bucket"
  value       = module.blog_storage.iam_user_name
}

output "access_key_id" {
  description = "The access key ID for the IAM user"
  value       = module.blog_storage.access_key_id
  sensitive   = false
}

output "access_key_secret" {
  description = "The secret access key for the IAM user"
  value       = module.blog_storage.access_key_secret
  sensitive   = true
}

# Multi-environment outputs
output "bucket_ids" {
  description = "Map of environment to bucket ID"
  value       = { for env, bucket in module.s3_bucket : env => bucket.bucket_name }
}

output "bucket_arns" {
  description = "Map of environment to bucket ARN"
  value       = { for env, bucket in module.s3_bucket : env => bucket.bucket_arn }
}

output "bucket_domain_names" {
  description = "Map of environment to bucket domain name"
  value       = { for env, bucket in module.s3_bucket : env => bucket.cloudfront_domain_name }
}

output "iam_user_names" {
  description = "Map of environment to IAM user name"
  value       = { for env, bucket in module.s3_bucket : env => bucket.iam_user_name }
}

output "access_key_ids" {
  description = "Map of environment to access key ID"
  value       = { for env, bucket in module.s3_bucket : env => bucket.access_key_id }
  sensitive   = false
}

output "access_key_secrets" {
  description = "Map of environment to access key secret"
  value       = { for env, bucket in module.s3_bucket : env => bucket.access_key_secret }
  sensitive   = true
} 