output "bucket_name" {
  value       = aws_s3_bucket.blog_content.id
  description = "Name of the created S3 bucket"
}

output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.blog_cdn.domain_name
  description = "Domain name of the CloudFront distribution"
}

output "iam_user_name" {
  value       = aws_iam_user.blog_uploader.name
  description = "Name of the IAM user with bucket access"
}

output "access_key_id" {
  value       = aws_iam_access_key.blog_uploader.id
  description = "Access key ID for the IAM user"
  sensitive   = true
}

output "access_key_secret" {
  value       = aws_iam_access_key.blog_uploader.secret
  description = "Secret access key for the IAM user"
  sensitive   = true
} 