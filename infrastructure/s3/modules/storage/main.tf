resource "aws_s3_bucket" "content_bucket" {
  bucket = "${var.project_name}-${var.environment}"
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Set up the bucket policy for CORS
resource "aws_s3_bucket_cors_configuration" "bucket_cors" {
  bucket = aws_s3_bucket.content_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Create IAM user for bucket access
resource "aws_iam_user" "bucket_user" {
  name = "${var.project_name}-${var.environment}-user"
}

# Create access keys for the IAM user
resource "aws_iam_access_key" "user_key" {
  user = aws_iam_user.bucket_user.name
}

# Create CloudFront distribution for the bucket
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.content_bucket.bucket_regional_domain_name
    origin_id   = "${var.project_name}-${var.environment}-origin"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.project_name}-${var.environment}-origin"

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
} 