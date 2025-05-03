From root

```bash
# Build the image
docker build -t ashgw-blog -f deployment/blog/Dockerfile .
```

For the preview image run

```bash
docker build --build-arg IS_PREVIEW=true -t ashgw-blog -f deployment/blog/Dockerfile .

```

```bash
# Run the container
docker run -p 3001:3001 ashgw-blog
```

From the `deployment/blog` directory:

```bash
# Start the service
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the service
docker-compose down
```

```bash
docker build --build-arg NODE_VERSION=18 --build-arg PORT=4000 -t ashgw-blog -f deployment/blog/Dockerfile .
```
