
variable "bucket_names" {
  type    = list(string)
  default = [ "ashgw-blog-public"] # no need for the images bucket for now
}



variable "bucket_owner" {
  type = string
  default = "i-own-ashgw-blog-public-content"
}


