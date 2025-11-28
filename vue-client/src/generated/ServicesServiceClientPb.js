/**
 * @fileoverview gRPC-Web generated client stub for rpc_tutorial
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */


import * as grpcWeb from 'grpc-web';

import * as services_pb from './services_pb';


export class GreeterClient {
  client_;
  hostname_;
  credentials_;
  options_;

  constructor (hostname,
               credentials, 
               options) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorSayHello = new grpcWeb.MethodDescriptor(
    '/rpc_tutorial.Greeter/SayHello',
    grpcWeb.MethodType.UNARY,
    services_pb.HelloRequest,
    services_pb.HelloReply,
    (request) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  sayHello(
    request,
    metadata) {
    return this.client_.unaryCall(
    this.hostname_ +
      '/rpc_tutorial.Greeter/SayHello',
    request,
    metadata || {},
    this.methodDescriptorSayHello);
  }

  methodDescriptorSayHelloStream = new grpcWeb.MethodDescriptor(
    '/rpc_tutorial.Greeter/SayHelloStream',
    grpcWeb.MethodType.SERVER_STREAMING,
    services_pb.HelloRequest,
    services_pb.HelloReply,
    (request) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  sayHelloStream(
    request,
    metadata) {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/rpc_tutorial.Greeter/SayHelloStream',
      request,
      metadata || {},
      this.methodDescriptorSayHelloStream);
  }

  methodDescriptorAggregateHello = new grpcWeb.MethodDescriptor(
    '/rpc_tutorial.Greeter/AggregateHello',
    grpcWeb.MethodType.UNARY,
    services_pb.HelloRequest,
    services_pb.HelloReply,
    (request) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  aggregateHello(
    request,
    metadata) {
    return this.client_.unaryCall(
    this.hostname_ +
      '/rpc_tutorial.Greeter/AggregateHello',
    request,
    metadata || {},
    this.methodDescriptorAggregateHello);
  }

}

export class WeatherClient {
  client_;
  hostname_;
  credentials_;
  options_;

  constructor (hostname,
               credentials, 
               options) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorGetWeather = new grpcWeb.MethodDescriptor(
    '/rpc_tutorial.Weather/GetWeather',
    grpcWeb.MethodType.UNARY,
    services_pb.WeatherRequest,
    services_pb.WeatherReply,
    (request) => {
      return request.serializeBinary();
    },
    services_pb.WeatherReply.deserializeBinary
  );

  getWeather(
    request,
    metadata) {
    return this.client_.unaryCall(
    this.hostname_ +
      '/rpc_tutorial.Weather/GetWeather',
    request,
    metadata || {},
    this.methodDescriptorGetWeather);
  }

}