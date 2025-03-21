# Run

Run the BloggerApi backend project.
Make sure to run BloggerApi commands from BloggerApi solution directory.

``` sh
npm run dev
npm run devd # to target dockerized BloggerApi
```

# Docker

``` sh
npm run build
docker build -t blogger-react .
docker run --name blogger-react -p 80:80 -p 443:443  --rm -d blogger-react
```

# Snippets

await new Promise((resolve) => setTimeout(resolve, 5000));
