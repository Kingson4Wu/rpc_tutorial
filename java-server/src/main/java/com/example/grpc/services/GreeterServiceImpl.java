package com.example.grpc.services;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

@GrpcService
public class GreeterServiceImpl extends GreeterGrpc.GreeterImplBase {

    private static final Logger log = LoggerFactory.getLogger(GreeterServiceImpl.class);

    @Override
    public void sayHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        log.info("Received SayHello request: {}", request.getName());
        HelloReply reply = HelloReply.newBuilder()
                .setMessage("Hello, " + request.getName() + " from Java gRPC Server!")
                .build();
        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }
    
    @Override
    public void aggregateHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        log.info("Received AggregateHello request on Java server: {}", request.getName());
        
        // 1. Get greeting from this Java server
        String javaGreeting = "Hello, " + request.getName() + " from Java!";
        
        // 2. Create gRPC client to call Python server
        ManagedChannel channel = ManagedChannelBuilder.forTarget("python-server:50051")
                .usePlaintext()
                .build();
        
        try {
            GreeterGrpc.GreeterBlockingStub stub = GreeterGrpc.newBlockingStub(channel);
            
            // 3. Call Python server's SayHello method
            HelloRequest pythonRequest = HelloRequest.newBuilder()
                    .setName(request.getName())
                    .build();
            
            HelloReply pythonResponse = stub.sayHello(pythonRequest);
            String pythonGreeting = pythonResponse.getMessage();
            
            // 4. Combine responses
            String aggregatedMessage = String.format(
                "[Aggregated Response] Java says: '%s' || Python says: '%s'", 
                javaGreeting, 
                pythonGreeting
            );
            
            HelloReply reply = HelloReply.newBuilder()
                    .setMessage(aggregatedMessage)
                    .build();
                    
            responseObserver.onNext(reply);
            responseObserver.onCompleted();
            
        } catch (StatusRuntimeException e) {
            log.error("Failed to call Python server: {}", e.getStatus());
            
            // Fallback response if Python server is not available
            String fallbackMessage = String.format(
                "[Aggregated Response] Java says: 'Hello, %s from Java!' || Python server unavailable: %s", 
                request.getName(), 
                e.getStatus()
            );
            
            HelloReply reply = HelloReply.newBuilder()
                    .setMessage(fallbackMessage)
                    .build();
                    
            responseObserver.onNext(reply);
            responseObserver.onCompleted();
        } finally {
            try {
                channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("Channel shutdown interrupted", e);
            }
        }
    }

    @Override
    public void sayHelloStream(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        log.info("Received SayHelloStream request: {}", request.getName());
        for (int i = 0; i < 5; i++) {
            String message = String.format("Stream Hello %d, %s from Java gRPC Server!", (i + 1), request.getName());
            log.info("Sending stream message: {}", message);
            HelloReply reply = HelloReply.newBuilder().setMessage(message).build();
            responseObserver.onNext(reply);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                responseObserver.onError(e);
                return;
            }
        }
        responseObserver.onCompleted();
    }
}
