### (from root)

```bash
# Build the image
docker build -t ashgw-blog -f deployment/blog/Dockerfile .
```

For the preview image run

```bash
docker build --build-arg IS_PREVIEW=true -t ashgw-blog -f deployment/blog/Dockerfile .

```

Other

```bash
docker build --build-arg NODE_VERSION=18 --build-arg PORT=4000 -t ashgw-blog -f deployment/blog/Dockerfile .
```
