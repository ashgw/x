
resource "aws_s3_bucket" "buckets" {
  for_each = { for idx, name in var.bucket_names : idx => name }

  bucket = each.value
}

resource "aws_s3_bucket_cors_configuration" "buckets" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_acl" "buckets" {
  for_each = aws_s3_bucket.buckets

  bucket     = each.value.id
  acl        = "public-read"
  depends_on = [aws_s3_bucket_ownership_controls.s3_bucket_acl_ownership]
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_acl_ownership" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id
    rule {
    object_ownership = "BucketOwnerPreferred"
  }
  depends_on = [aws_s3_bucket_public_access_block.example]
}

resource "aws_iam_user" "bucket_owner" {
  name = var.bucket_owner
}

resource "aws_s3_bucket_public_access_block" "example" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_policy" "prod" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicListBucket"
        Effect    = "Allow"
        Principal = "*"
        Action    = [
          "s3:ListBucket"
        ]
        Resource  = [
          "${each.value.arn}",
        ]
      },
      {
        Sid       = "PublicGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = [
          "s3:GetObject"
        ]
        Resource  = [
          "${each.value.arn}/*",
        ]
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.example]
}
