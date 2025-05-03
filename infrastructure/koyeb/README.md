# Koyeb Infrastructure

This directory contains Terraform configuration for deploying and managing the blog app on Koyeb.

## Setup

Set your Koyeb API token as an environment variable:

```bash
export KOYEB_TOKEN="your-koyeb-token"
```

Alternatively, the token is stored in the `terraform.tfvars` file.

## Usage

Initialize Terraform:

```bash
terraform init
```

Plan the changes:

```bash
terraform plan -out tf.plan
```

Apply the changes:

```bash
terraform apply tf.plan
```

## Resources Created

- A Koyeb App named "blog"
- A Koyeb Service named "blog" running the Docker image "ashgw/blog:latest" (published on dockerhub for now)
- Routes and ports configured for the service

## Variables

All variables can be customized in `terraform.tfvars` or passed as environment variables prefixed with `TF_VAR_`.
