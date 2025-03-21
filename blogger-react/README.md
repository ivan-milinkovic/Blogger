# Run

Run the BloggerApi backend project.
Make sure to run BloggerApi commands from BloggerApi solution directory.

``` sh
npm run dev
npm run devd # to target dockerized BloggerApi
```

# Docker

Start the Docker application.

``` sh
docker build -t blogger-react .
docker run --name blogger-react -p 80:80 -p 443:443  --rm -d blogger-react
```

Check `vite.config.ts` for build output directory.

`default.conf` is copied and overwrites the default nginx server config inside image/container at `/etc/nginx/conf.d/default.conf`
to allow loading and reloading of React routes (e.g. `localhost/login`) and prevent nginx from returning 404 Not Found.

# Snippets

await new Promise((resolve) => setTimeout(resolve, 1000));
