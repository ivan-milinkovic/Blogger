# Run

`dotnet run --project BloggerApi`

Credentials:
ivan@test
123

# OpenApi

http://localhost:5292/swagger/index.html

Generated open api json: `localhost:5292/openapi/v1.json`

# Curl

Mind the port:


``` sh
curl localhost:5292/login \
-X POST -d '{"email":"ivan@test", "password":"123"}' \
-H 'Content-Type: application/json'
```

``` sh
curl http://localhost:5292/api/posts -H 'Authorization: Bearer ...'

curl http://localhost:5292/api/posts/1 -H 'Authorization: Bearer ...'

curl http://localhost:5292/api/posts -X POST -d '{"Title":"My First Post", "Content": "Some interesting stuff"}' -H 'Authorization: Bearer ...'

curl http://localhost:5292/api/posts/2 -X PUT -d '{"Title":"My Second Post", "Content": "Some interesting stuff, edits"}' -H "Content-Type: application/json" -H 'Authorization: Bearer ...'

curl http://localhost:5292/api/posts/4 -X DELETE -H 'Authorization: Bearer ...'
```

# Migrations

``` sh
dotnet ef migrations add AddingAppIdentityUser --project BloggerApi --context AppIdentityDbContext

dotnet ef migrations add AddingAppIdentityUser --project BloggerApi --context BlogsDbContext
```

# Docker

From the solution directory:
``` sh
docker build -t blogger-api ./BloggerApi 
```
Dockerfile is written to reference files from its own location.

``` sh
docker run -p 8000:8080 -d --rm blogger-api
```

# Docs

Log levels:
https://learn.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line#log-level
