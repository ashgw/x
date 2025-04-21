output "bucket_name" {
  value       = module.blog_storage.bucket_name
  description = "Name of the created S3 bucket"
}

output "cloudfront_domain_name" {
  value       = module.blog_storage.cloudfront_domain_name
  description = "Domain name of the CloudFront distribution"
}

output "iam_user_name" {
  value       = module.blog_storage.iam_user_name
  description = "Name of the IAM user with bucket access"
}

output "access_key_id" {
  value       = module.blog_storage.access_key_id
  description = "Access key ID for the IAM user"
  sensitive   = true
}

output "access_key_secret" {
  value       = module.blog_storage.access_key_secret
  description = "Secret access key for the IAM user"
  sensitive   = true
}

output "bucket_ids" {
  description = "The IDs of the buckets"
  value       = { for env, bucket in module.s3_bucket : env => bucket.bucket_id }
}

output "bucket_arns" {
  description = "The ARNs of the buckets"
  value       = { for env, bucket in module.s3_bucket : env => bucket.bucket_arn }
}

output "bucket_domain_names" {
  description = "The domain names of the buckets"
  value       = { for env, bucket in module.s3_bucket : env => bucket.bucket_domain_name }
} 