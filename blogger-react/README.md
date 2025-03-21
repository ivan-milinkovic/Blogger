# Run

npm run dev

Run the backend located in another project: ../BloggerApi

# Docker

``` sh
docker build -t blogger-react .
docker run --name blogger-react -p 80:80 -p 443:443  --rm -d blogger-react
```

# Snippets

await new Promise((resolve) => setTimeout(resolve, 5000));
