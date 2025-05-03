# Blog App Docker Setup

This directory contains Docker configuration for running the blog app in a containerized environment.

## Files

- `Dockerfile`: Multi-stage build process for the blog app
- `docker-compose.yml`: Compose configuration for running the containerized blog app
- `.dockerignore`: List of files/directories to exclude from the Docker build context

## Usage Instructions

### Building the Docker Image

From the root of the repository:

```bash
# Build the image
docker build -t ashgw-blog -f deployment/blog/Dockerfile .
```

### Running with Docker

```bash
# Run the container
docker run -p 3001:3001 ashgw-blog
```

### Running with Docker Compose

From the `deployment/blog` directory:

```bash
# Start the service
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the service
docker-compose down
```

## Environment Variables

The default configuration uses:

- Node.js version 20
- Port 3001

To override these values:

```bash
# Using Docker build args
docker build --build-arg NODE_VERSION=18 --build-arg PORT=4000 -t ashgw-blog -f deployment/blog/Dockerfile .
```

Or edit the environment section in `docker-compose.yml`.
