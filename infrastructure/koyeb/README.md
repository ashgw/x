# Koyeb Infrastructure

This directory contains Terraform configuration for deploying and managing the blog app on Koyeb.

### Initial Setup

1. Set your Koyeb API token as an environment variable:

```bash
export KOYEB_TOKEN="your-koyeb-token"
```

2. Run `tf`

## Environments

This Terraform configuration now provisions two separate Koyeb applications:

- **Production** (`blog`):
  - Resources: `koyeb_app.blog` & `koyeb_service.blog`
- **Preview** (`blog-preview`):
  - Resources: `koyeb_app.blog_preview` & `koyeb_service.blog_preview`
  - Uses the same settings, but the service name is suffixed with `-preview`

To deploy both environments:

```bash
terraform plan
terraform apply
```

After a successful apply you'll have both the `blog` (prod) and `blog-preview` (preview) apps running in Koyeb.
