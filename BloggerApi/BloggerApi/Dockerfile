# build step
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /BloggerApiSource
COPY . .
RUN dotnet restore BloggerApi.csproj
RUN dotnet build BloggerApi.csproj -c $BUILD_CONFIGURATION -o /BloggerApiBuild
RUN dotnet publish BloggerApi.csproj -c $BUILD_CONFIGURATION -o /BloggerApiPublish -p:UseAppHost=false

# asp image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /BloggerApi
COPY --from=build /BloggerApiPublish .
ENTRYPOINT ["dotnet", "BloggerApi.dll"]
