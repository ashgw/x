resource "aws_s3_bucket_lifecycle_configuration" "blog_content_lifecycle" {
  bucket                                 = var.bucket
  expected_bucket_owner                  = var.account_id
  transition_default_minimum_object_size = "all_storage_classes_128K"

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
} 