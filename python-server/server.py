import grpc
from concurrent import futures
import time
import random

import services_pb2
import services_pb2_grpc

# --- Client Stub for Backend-to-Backend Communication ---
def get_java_server_greeting(name):
    # Connect to the Java gRPC server
    # The address 'java-server:50052' is the hostname and port defined in docker-compose.yml
    with grpc.insecure_channel('java-server:50052') as channel:
        stub = services_pb2_grpc.GreeterStub(channel)
        try:
            # Call the SayHello method on the Java server
            request = services_pb2.HelloRequest(name=name)
            response = stub.SayHello(request, timeout=5) # 5-second timeout
            return response.message
        except grpc.RpcError as e:
            print(f"Could not connect to Java server: {e.details()}")
            return f"Error contacting Java server: {e.code().name}"


class GreeterService(services_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        print(f"Received SayHello request: {request.name}")
        return services_pb2.HelloReply(message=f"Hello, {request.name} from Python gRPC Server!")

    def SayHelloStream(self, request, context):
        print(f"Received SayHelloStream request: {request.name}")
        for i in range(5):
            message = f"Stream Hello {i+1}, {request.name} from Python gRPC Server!"
            print(f"Sending stream message: {message}")
            yield services_pb2.HelloReply(message=message)
            time.sleep(1)
            
    def AggregateHello(self, request, context):
        print(f"Received AggregateHello request: {request.name}")
        
        # 1. Get greeting from this Python server
        python_greeting = f"Hello, {request.name} from Python!"
        
        # 2. Get greeting from the Java server
        java_greeting = get_java_server_greeting(request.name)
        
        # 3. Combine them
        aggregated_message = f"[Aggregated Response] Python says: '{python_greeting}' || Java says: '{java_greeting}'"
        
        return services_pb2.HelloReply(message=aggregated_message)


class WeatherService(services_pb2_grpc.WeatherServicer):
    def GetWeather(self, request, context):
        print(f"Received GetWeather request for city: {request.city}")
        
        # Simulate fetching weather data
        city = request.city
        temp = round(random.uniform(-10, 35), 1)
        humidity = random.randint(30, 90)
        conditions = [
            services_pb2.SUNNY,
            services_pb2.CLOUDY,
            services_pb2.RAINY,
            services_pb2.STORMY
        ]
        condition = random.choice(conditions)
        
        description = f"Simulated weather for {city}: {services_pb2.WeatherCondition.Name(condition)}"

        return services_pb2.WeatherReply(
            temperature=temp,
            humidity=humidity,
            condition=condition,
            description=description
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add both services to the server
    services_pb2_grpc.add_GreeterServicer_to_server(GreeterService(), server)
    services_pb2_grpc.add_WeatherServicer_to_server(WeatherService(), server)
    
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Python gRPC server running on port 50051, serving Greeter and Weather services.")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()