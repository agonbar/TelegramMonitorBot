FROM golang:alpine AS builder
RUN apk update && apk add --no-cache git

WORKDIR /go/src/agonbar/telegrammonitorbot/
COPY . .

# Install all dependencys and build to $GOROOT/bin/
RUN go get -d -v
RUN go install .

# We don't need all the build trash to execute, so new layer
FROM alpine

# For generating keys
RUN apk add --no-cache ca-certificates

# Set our dependencys
COPY --from=builder /go/bin/telegrammonitorbot /go/bin/telegrammonitorbot
COPY ./config.json /config.json

# Execute
CMD ["/go/bin/telegrammonitorbot"]