
variable "bucket_names" {
  type    = list(string)
  default = [ "ashgw-blog-public-general", "ashgw-blog-public-images"] 
}



variable "bucket_owner" {
  type = string

  default = "i-own-ashgw-blog-public-content"
}


