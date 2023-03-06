FROM golang:1.17.4 AS builder

WORKDIR /go/app

COPY . .

# COPY go.mod go.mod

# COPY go.sum go.sum

# RUN go mod download

RUN go mod tidy -go=1.16 && go mod tidy -go=1.17

RUN cd internal && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build main.go

FROM alpine:3.13
WORKDIR /app
# COPY --from=builder . .
COPY --from=builder /go/app/internal/main .
COPY --from=builder /go/app/lib/credentials/long-sonar-371616-80145143437f.json .

ENV TZ=Asia/Bangkok

# CMD ["./go/app/apisrv/main"]
CMD ["./main"]
