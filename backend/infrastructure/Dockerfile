# Build from the backend module root:
#   docker build -f infrastructure/Dockerfile -t clinica-api .
#
# Runtime expects DATABASE_URL and optionally PORT (default 8080).

FROM golang:1.22-alpine AS build

WORKDIR /src

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/api

FROM alpine:3.20

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=build /out/server .

ENV PORT=8080
EXPOSE 8080

USER nobody:nobody

CMD ["./server"]
