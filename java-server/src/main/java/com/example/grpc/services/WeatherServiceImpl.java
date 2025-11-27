package com.example.grpc.services;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;

@GrpcService
public class WeatherServiceImpl extends WeatherGrpc.WeatherImplBase {

    private static final Logger log = LoggerFactory.getLogger(WeatherServiceImpl.class);
    private final Random random = new Random();

    @Override
    public void getWeather(WeatherRequest request, StreamObserver<WeatherReply> responseObserver) {
        log.info("Received GetWeather request for city: {}", request.getCity());

        String city = request.getCity();
        float temp = -10 + (35 - (-10)) * random.nextFloat();
        int humidity = 30 + random.nextInt(61);

        WeatherCondition[] conditions = WeatherCondition.values();
        WeatherCondition condition = conditions[random.nextInt(conditions.length-1)]; // Avoid UNRECOGNIZED

        String description = String.format("Simulated weather for %s: %s", city, condition.name());

        WeatherReply reply = WeatherReply.newBuilder()
                .setTemperature(temp)
                .setHumidity(humidity)
                .setCondition(condition)
                .setDescription(description)
                .build();

        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }
}
