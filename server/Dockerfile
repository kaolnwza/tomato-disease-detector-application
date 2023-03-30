FROM golang:1.17.4 AS builder


WORKDIR /go/app

COPY . .

# COPY go.mod go.mod

# COPY go.sum go.sum

# RUN go mod download

RUN go mod tidy -go=1.16 && go mod tidy -go=1.17

RUN cd cmd && GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build main.go

FROM alpine:3.13
WORKDIR /app
# COPY --from=builder . .
COPY --from=builder /go/app/cmd/main .
COPY --from=builder /go/app/lib/credentials/able-stock-380702-6a1a9faa2adc.json .

ENV TZ=Asia/Bangkok

# CMD ["./go/app/apisrv/main"]
CMD ["./main"]
