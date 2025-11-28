/**
 * @fileoverview gRPC-Web generated client stub for rpc_tutorial
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as services_pb from './services_pb';


export class GreeterClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
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
    (request: services_pb.HelloRequest) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  sayHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null): Promise<services_pb.HelloReply>;

  sayHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: services_pb.HelloReply) => void): grpcWeb.ClientReadableStream<services_pb.HelloReply>;

  sayHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: services_pb.HelloReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/rpc_tutorial.Greeter/SayHello',
        request,
        metadata || {},
        this.methodDescriptorSayHello,
        callback);
    }
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
    (request: services_pb.HelloRequest) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  sayHelloStream(
    request: services_pb.HelloRequest,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<services_pb.HelloReply> {
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
    (request: services_pb.HelloRequest) => {
      return request.serializeBinary();
    },
    services_pb.HelloReply.deserializeBinary
  );

  aggregateHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null): Promise<services_pb.HelloReply>;

  aggregateHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: services_pb.HelloReply) => void): grpcWeb.ClientReadableStream<services_pb.HelloReply>;

  aggregateHello(
    request: services_pb.HelloRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: services_pb.HelloReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/rpc_tutorial.Greeter/AggregateHello',
        request,
        metadata || {},
        this.methodDescriptorAggregateHello,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/rpc_tutorial.Greeter/AggregateHello',
    request,
    metadata || {},
    this.methodDescriptorAggregateHello);
  }

}

export class WeatherClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
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
    (request: services_pb.WeatherRequest) => {
      return request.serializeBinary();
    },
    services_pb.WeatherReply.deserializeBinary
  );

  getWeather(
    request: services_pb.WeatherRequest,
    metadata: grpcWeb.Metadata | null): Promise<services_pb.WeatherReply>;

  getWeather(
    request: services_pb.WeatherRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: services_pb.WeatherReply) => void): grpcWeb.ClientReadableStream<services_pb.WeatherReply>;

  getWeather(
    request: services_pb.WeatherRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: services_pb.WeatherReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/rpc_tutorial.Weather/GetWeather',
        request,
        metadata || {},
        this.methodDescriptorGetWeather,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/rpc_tutorial.Weather/GetWeather',
    request,
    metadata || {},
    this.methodDescriptorGetWeather);
  }

}
