FROM node:18-alpine AS builder

WORKDIR /app

# Install protoc for protobuf generation plus the needed google imports
RUN apk add --no-cache \
    curl \
    unzip \
    protobuf \
    protobuf-dev

# Install node packages including grpc-web plugin
COPY vue-client/package.json .
RUN npm install

# Install the protoc-gen-grpc-web plugin via npm globally
RUN npm install -g protoc-gen-grpc-web

COPY vue-client/. .

# Copy proto files and generate JavaScript protobuf files
RUN mkdir -p src/generated
COPY proto ./proto
# Use only grpc-web plugin to generate both messages and client stubs
RUN protoc -I=/usr/include -I=./proto --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:./src/generated ./proto/services.proto

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8082

CMD ["nginx", "-g", "daemon off;"]
