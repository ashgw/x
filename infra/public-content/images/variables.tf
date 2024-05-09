variable "bucket_name" {
  type    = string
  default = "ashgw-blog-public-images"
}

variable "bucket_owner" {
  type = string

  default = "i-own-ashgw-blog-public-images"
}

variable "aws_region" {
  type = string
  default = "us-east-2"
}
