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