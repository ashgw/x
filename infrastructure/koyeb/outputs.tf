output "app_id" {
  description = "The ID of the Koyeb app"
  value       = koyeb_app.blog.id
}

output "service_id" {
  description = "The ID of the Koyeb service"
  value       = koyeb_service.blog.id
}

output "app_name" {
  description = "The name of the deployed app"
  value       = koyeb_app.blog.name
}

output "terraform_managed" {
  description = "Note that this app is managed by Terraform and is different from the main blog app"
  value       = "This is a Terraform-managed version of the blog app. The app name was changed to avoid conflicts with existing apps that may be pending deletion in Koyeb."
}
