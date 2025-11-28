```
grpcurl -plaintext \
  -import-path ./proto \
  -proto services.proto \
  -d '{"name":"Kingson"}' \
  localhost:50051 \
  rpc_tutorial.Greeter.SayHello

{
  "message": "Hello, Kingson from Python gRPC Server!"
}
```


```
grpcurl -plaintext \
  -import-path ./proto \
  -proto services.proto \
  -d '{"name":"Kingson"}' \
  localhost:50052 \
  rpc_tutorial.Greeter.SayHelloStream

{
  "message": "Stream Hello 1, Kingson from Python gRPC Server!"
}
{
  "message": "Stream Hello 2, Kingson from Python gRPC Server!"
}
{
  "message": "Stream Hello 3, Kingson from Python gRPC Server!"
}
{
  "message": "Stream Hello 4, Kingson from Python gRPC Server!"
}
{
  "message": "Stream Hello 5, Kingson from Python gRPC Server!"
}
```

```
grpcurl -plaintext \
  -import-path ./proto \
  -proto services.proto \
  -d '{"name":"Kingson"}' \
  localhost:50051 \
  rpc_tutorial.Greeter.AggregateHello

{
  "message": "[Aggregated Response] Python says: 'Hello, Kingson from Python!' || Java says: 'Hello, Kingson from Java gRPC Server!'"
}
```

```
grpcurl -plaintext \
  -import-path ./proto \
  -proto services.proto \
  -d '{"name":"Kingson"}' \
  localhost:50052 \
  rpc_tutorial.Greeter.AggregateHello

{
  "message": "[Aggregated Response] Java says: 'Hello, Kingson from Java!' || Python says: 'Hello, Kingson from Python gRPC Server!'"
}
```

```
grpcurl -plaintext \
  -import-path ./proto \
  -proto services.proto \
  -d '{"city":"Guangzhou"}' \
  localhost:50051 \
  rpc_tutorial.Weather.GetWeather
```

# envoy

```
curl -i -X POST http://localhost:8081/rpc_tutorial.Greeter/SayHello \
  -H "Content-Type: application/grpc-web+json" \
  -H "Accept: application/grpc-web+json" \
  -d '{"name":"Kingson"}'

HTTP/1.1 200 OK
content-type: application/grpc
grpc-status: 2
grpc-message: Missing :te header
x-envoy-upstream-service-time: 105
date: Fri, 28 Nov 2025 01:58:23 GMT
server: envoy
content-length: 0

echo 'name: "Kingson"' > req.textproto
protoc -I proto \
  --encode=rpc_tutorial.HelloRequest proto/services.proto < req.textproto > req.bin

python3 -c '
import sys, struct
payload = open("req.bin","rb").read()
with open("frame.bin","wb") as f:
    f.write(b"\x00")                    # data frame
    f.write(struct.pack(">I", len(payload))) # 4 bytes big-endian length
    f.write(payload)
'
curl -s http://localhost:8081/rpc_tutorial.Greeter/SayHello \
  -H "Content-Type: application/grpc-web+proto" \
  -H "X-Grpc-Web: 1" \
  -H "X-User-Agent: grpc-web-javascript/0.1" \
  --data-binary "@frame.bin" \
  --output resp.bin

dd if=resp.bin of=resp_pb.bin bs=1 skip=5
protoc -I proto -I ../googleapis \
  --decode=rpc_tutorial.HelloReply proto/services.proto < resp_pb.bin
# 读取第一个 frame header，得到长度
payload_len=$(xxd -p -l 4 -s 1 resp.bin | tr -d '\n' | awk '{printf "%d\n", "0x"$0}')
# 提取 DATA frame payload
dd if=resp.bin of=resp_pb.bin bs=1 skip=5 count=$payload_len
protoc -I proto -I ../googleapis --decode=rpc_tutorial.HelloReply proto/services.proto < resp_pb.bin
message: "Hello, Kingson from Python gRPC Server!"

git clone https://github.com/googleapis/googleapis.git


```

# gateway

```
curl -i -X POST http://localhost:8080/v1/greeter/say_hello \
  -H "Content-Type: application/json" \
  -d '{"name": "Kingson"}'

HTTP/1.1 200 OK
Content-Type: application/json
Grpc-Metadata-Content-Type: application/grpc
Grpc-Metadata-Grpc-Accept-Encoding: identity, deflate, gzip
Date: Fri, 28 Nov 2025 02:32:02 GMT
Content-Length: 53

{"message":"Hello, Kingson from Python gRPC Server!"}
```

```
curl -i -X POST http://localhost:8080/v1/greeter/aggregate_hello \
  -H "Content-Type: application/json" \
  -d '{"name": "Kingson"}'

HTTP/1.1 200 OK
Content-Type: application/json
Grpc-Metadata-Content-Type: application/grpc
Grpc-Metadata-Grpc-Accept-Encoding: identity, deflate, gzip
Date: Fri, 28 Nov 2025 02:32:34 GMT
Content-Length: 132

{"message":"[Aggregated Response] Python says: 'Hello, Kingson from Python!' || Java says: 'Hello, Kingson from Java gRPC Server!'"}

```
```
curl -i http://localhost:8080/v1/weather/Beijing

HTTP/1.1 200 OK
Content-Type: application/json
Grpc-Metadata-Content-Type: application/grpc
Grpc-Metadata-Grpc-Accept-Encoding: gzip
Date: Fri, 28 Nov 2025 02:33:59 GMT
Content-Length: 114

{"temperature":-8.11353, "humidity":80, "condition":"RAINY", "description":"Simulated weather for Beijing: RAINY"}

```