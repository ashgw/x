# Multi-environment outputs only
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
