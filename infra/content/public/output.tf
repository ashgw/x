output "bucket_domains" {
  description = "Domain names of the buckets"
  value = [
    for bucket_name, bucket in aws_s3_bucket.buckets : {
      name     = bucket_name
      domain   = bucket.website_domain != null ? bucket.website_domain : null
    } if bucket.website_domain != null
  ]
}
