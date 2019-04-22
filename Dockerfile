FROM golang:alpine AS builder
RUN apk update && apk add --no-cache git

WORKDIR $GOPATH/src/agonbar/telegrammonitorbot/
COPY . .

RUN go get -d -v
RUN go install .

#FROM scratch
#COPY --from=builder /go/bin/telegrammonitorbot /go/bin/telegrammonitorbot
CMD ["/go/bin/telegrammonitorbot"]