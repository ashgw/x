output "domain" {
  description = "Domain name of the bucket"
  value       = aws_s3_bucket.public_bucket.website_domain
}