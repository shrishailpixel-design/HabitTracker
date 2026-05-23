FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs

COPY . .

RUN cd frontend && npm install && npm run build
RUN mkdir -p wwwroot && cp -r frontend/dist/* wwwroot/
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .
RUN mkdir -p /app/data
EXPOSE 5000
CMD ["./Project.Api"]
