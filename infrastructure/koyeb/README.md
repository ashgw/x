# Koyeb Infrastructure

This directory contains Terraform configuration for deploying and managing the blog app on Koyeb.

## Current Deployment

The Terraform configuration deploys:

- A Koyeb app named "blog-terraform"
- A service that runs the "ashgw/blog:latest" Docker image
- Environment variables configuration
- Port configuration (3001)
- Routes configuration (/ → port 3001)
- Instance type (micro)

## Usage

### Initial Setup

1. Set your Koyeb API token as an environment variable:

```bash
export KOYEB_TOKEN="your-koyeb-token"
```

2. Initialize Terraform:

```bash
terraform init
```

### Deploy or Update

Apply the configuration:

```bash
terraform apply
```

Or apply without confirmation:

```bash
terraform apply -auto-approve
```

### View Resources

View the created resources and their IDs:

```bash
terraform output
```

### Clean Up

To destroy the resources:

```bash
terraform destroy
```

## Relationship to GitHub Actions

This Terraform configuration is separate from the GitHub Actions workflow that deploys to the main "blog" app. The GitHub workflow uses the Koyeb CLI to deploy to the production instance, while this Terraform configuration manages a separate "blog-terraform" instance for infrastructure testing.

## Resources Created

- A Koyeb App named "blog"
- A Koyeb Service named "blog" running the Docker image "ashgw/blog:latest" (published on dockerhub for now)
- Routes and ports configured for the service

## Variables

All variables can be customized in `terraform.tfvars` or passed as environment variables prefixed with `TF_VAR_`.
