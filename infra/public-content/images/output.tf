output "bucket_url" {
  value = "https://${var.bucket_name}.s3.${var.aws_region}.amazonaws.com"
}
