# S3 Setup

This Terraform module sets up a private S3 bucket infrastructure for ashgw.me blog content with CloudFront distribution.

The setup creates a single S3 bucket with three folders (image/, audio/, and mdx/) to store different types of content.

Access to the bucket is strictly controlled through a dedicated IAM user (which is me) with limited permissions specific to this bucket only => if credentials are compromised, other AWS resources remain unaffected.

The S3 bucket itself blocks all public access and serves content exclusively through CloudFront for improved performance, security, and global availability.

The bucket name is automatically obfuscated with a random suffix to prevent targeting, and all resources are tagged appropriately for cost tracking.

CloudFront is configured with different caching strategies for each content type - longer caching for images, moderate for audio, and shorter for MDX files to balance performance with update frequency, since many blogs I have don't have images.

Server-side encryption is enabled by default for all storage, and versioning keeps track of content changes with a lifecycle policy to remove old versions after 30 days.

The infrastructure uses environment variables and terraform.tfvars for configuration.

To use this setup, initialize Terraform, apply the configuration, and then use the outputted IAM credentials in the app to upload content. Just make sure you have your credentials under `~/.aws/credentials`

The CloudFront distribution provides a domain name that can be used to access the content securely.

If you want to copy this, you can just yank it for you and it will work. Have a look at my [S3-MCP](https://github.com/ashgw/s3-mcp) server if you want to do it simpler with an MCP client.
