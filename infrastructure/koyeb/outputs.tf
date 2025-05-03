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
