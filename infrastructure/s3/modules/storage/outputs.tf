output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.content_bucket.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.content_bucket.arn
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "iam_user_name" {
  description = "The name of the IAM user with access to the bucket"
  value       = aws_iam_user.bucket_user.name
}

output "access_key_id" {
  description = "The access key ID for the IAM user"
  value       = aws_iam_access_key.user_key.id
  sensitive   = false
}

output "access_key_secret" {
  description = "The secret access key for the IAM user"
  value       = aws_iam_access_key.user_key.secret
  sensitive   = true
} 