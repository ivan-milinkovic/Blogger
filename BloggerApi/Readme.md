# Run

dotnet run --project BloggerApi

ivan@test
123

# OpenApi

http://localhost:5292/swagger/index.html

generated open api json: localhost:5292/openapi/v1.json

# Curl

curl http://localhost:5292/api/posts -u 'ivan:123' -v

curl http://localhost:5292/api/posts/1 -u 'ivan:123' -v

curl http://localhost:5292/api/posts -u 'ivan:123' -X POST -d '{"Title":"My First Post", "Content": "Some interesting stuff"}' -H "Content-Type: application/json" -v

curl http://localhost:5292/api/posts/2 -u 'ivan:123' -X PUT -d '{"Title":"My Second Post", "Content": "Some interesting stuff, edits"}' -H "Content-Type: application/json" -v

curl http://localhost:5292/api/posts/4 -u 'ivan:123' -X DELETE

# Migrations

dotnet ef migrations add AddingAppIdentityUser --project BloggerApi --context AppIdentityDbContext
dotnet ef migrations add AddingAppIdentityUser --project BloggerApi --context BlogsDbContext

# Docs

Log levels:
https://learn.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line#log-level
