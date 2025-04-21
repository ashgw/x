# Development IAM Role - Full access to dev bucket
resource "aws_iam_role" "dev_role" {
  name = "s3-dev-full-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
        AWS     = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      }
    }]
  })
}

# Developer policy - full access to dev bucket only
resource "aws_iam_policy" "dev_policy" {
  name        = "s3-dev-full-access-policy"
  description = "Full access to development bucket"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = "s3:*",
        Effect   = "Allow",
        Resource = [
          aws_s3_bucket.dev_bucket.arn,
          "${aws_s3_bucket.dev_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "dev_role_policy_attachment" {
  role       = aws_iam_role.dev_role.name
  policy_arn = aws_iam_policy.dev_policy.arn
}

# Preview IAM Role - Limited access to preview bucket
resource "aws_iam_role" "preview_role" {
  name = "s3-preview-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = [
          "ec2.amazonaws.com",
          "codebuild.amazonaws.com"
        ]
      }
    }]
  })
}

# Preview policy - more controlled access
resource "aws_iam_policy" "preview_policy" {
  name        = "s3-preview-access-policy"
  description = "Controlled access to preview bucket"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject"
        ],
        Effect   = "Allow",
        Resource = [
          aws_s3_bucket.preview_bucket.arn,
          "${aws_s3_bucket.preview_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "preview_role_policy_attachment" {
  role       = aws_iam_role.preview_role.name
  policy_arn = aws_iam_policy.preview_policy.arn
}

# Production IAM Role - Very limited access, only for CI
resource "aws_iam_role" "prod_role" {
  name = "s3-prod-limited-access-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "codebuild.amazonaws.com"
      }
    }]
  })
}

# Production policy - very restricted
resource "aws_iam_policy" "prod_policy" {
  name        = "s3-prod-limited-access-policy"
  description = "Limited access to production bucket for CI only"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        Effect   = "Allow",
        Resource = [
          aws_s3_bucket.prod_bucket.arn,
          "${aws_s3_bucket.prod_bucket.arn}/*"
        ]
      },
      {
        Action = [
          "s3:DeleteObject"
        ],
        Effect   = "Deny",
        Resource = [
          "${aws_s3_bucket.prod_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "prod_role_policy_attachment" {
  role       = aws_iam_role.prod_role.name
  policy_arn = aws_iam_policy.prod_policy.arn
}

data "aws_caller_identity" "current" {} 