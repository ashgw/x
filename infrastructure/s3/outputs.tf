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