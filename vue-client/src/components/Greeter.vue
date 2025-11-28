<template>
  <div class="greeter">
    <h1>gRPC-Web and REST API Client (Dual Access)</h1>
    
    <!-- Environment selector -->
    <div class="env-selector">
      <h3>Select Environment:</h3>
      <label>
        <input type="radio" v-model="environment" value="local" />
        Local (Direct to Services)
      </label>
      <label>
        <input type="radio" v-model="environment" value="container" />
        Container (Through Envoy/Gateway)
      </label>
    </div>

    <!-- Access Method Selector -->
    <div class="access-selector">
      <h3>Select Access Method:</h3>
      <label>
        <input type="radio" v-model="accessMethod" value="grpc-web" />
        gRPC-Web via Envoy
      </label>
      <label>
        <input type="radio" v-model="accessMethod" value="rest" />
        REST/JSON via gRPC-Gateway
      </label>
    </div>

    <!-- Greeter Service -->
    <div class="service-card">
      <h2>Greeter Service</h2>
      <input type="text" v-model="name" placeholder="Enter your name">
      <br>
      <button @click="callSayHello">Say Hello (Unary)</button>
      <button @click="callAggregateHello">Aggregate Hello (Backend-to-Backend)</button>
      <button @click="callSayHelloStream">Say Hello (Stream)</button>
      <p v-if="helloResponse"><b>Unary Response:</b> {{ helloResponse }}</p>
      <div v-if="streamResponses.length">
        <b>Stream Responses:</b>
        <ul>
          <li v-for="(res, index) in streamResponses" :key="index">{{ res }}</li>
        </ul>
      </div>
    </div>

    <!-- Weather Service -->
    <div class="service-card">
      <h2>Weather Service</h2>
      <input type="text" v-model="city" placeholder="Enter a city">
      <br>
      <button @click="callGetWeather">Get Weather</button>
      <div v-if="weatherResponse">
        <p><b>Weather in {{ city }}:</b></p>
        <ul>
          <li>Temperature: {{ weatherResponse.temperature }}°C</li>
          <li>Humidity: {{ weatherResponse.humidity }}%</li>
          <li>Condition: {{ weatherConditionToString(weatherResponse.condition) }}</li>
          <li>Description: {{ weatherResponse.description }}</li>
        </ul>
      </div>
    </div>

    <p class="status"><b>Status:</b> {{ status }}</p>

  </div>
</template>

<script>
// Import generated Protobuf messages and gRPC clients (for gRPC-Web)
import { HelloRequest, WeatherRequest, WeatherCondition } from '../generated/services_pb.js';
import { GreeterClient, WeatherClient } from '../generated/ServicesServiceClientPb.js';

export default {
  name: 'GreeterComponent',
  data() {
    return {
      name: 'World',
      city: 'Tokyo',
      helloResponse: '',
      weatherResponse: null,
      streamResponses: [],
      status: 'Ready',
      accessMethod: 'grpc-web', // Default to gRPC-Web
      environment: 'local', // Default to local environment
    };
  },
  computed: {
    // Dynamically determine the gRPC-Web endpoint based on environment
    grpcEndpoint() {
      if (this.environment === 'container') {
        // In container environment, connect to envoy service
        return 'http://localhost:8081'; // envoy proxy in docker-compose
      } else {
        // In local environment, connect directly to the service
        return 'http://localhost:8081'; // for local envoy proxy
      }
    },
    // Dynamically determine the REST endpoint based on environment
    restEndpoint() {
      if (this.environment === 'container') {
        // In container environment, connect to gateway service
        return 'http://localhost:8080'; // gateway in docker-compose
      } else {
        // In local environment, connect directly to the service
        return 'http://localhost:8080'; // local gateway
      }
    }
  },
  methods: {
    // Create gRPC clients dynamically based on environment
    getGrpcGreeterClient() {
      return new GreeterClient(this.grpcEndpoint);
    },
    getGrpcWeatherClient() {
      return new WeatherClient(this.grpcEndpoint);
    },
    
    // --- Greeter Methods ---
    callSayHello() {
      this.status = `Sending SayHello request via ${this.accessMethod.toUpperCase()} in ${this.environment} environment...`;
      
      if (this.accessMethod === 'grpc-web') {
        const request = new HelloRequest();
        request.setName(this.name);
        console.log('grpc-web1');

        this.getGrpcGreeterClient().sayHello(request, {})
          .then(response => {
            console.log('grpc-web success', response);
            this.status = 'Unary call successful via gRPC-Web.';
            this.helloResponse = response.getMessage();
          })
          .catch(err => {
            console.log('grpc-web error', err);
            this.status = `Error: ${err.message}`;
            this.helloResponse = `Error: ${err.code} ${err.message}`;
          });
      } else { // REST API
        const payload = { name: this.name };
        
        fetch(`${this.restEndpoint}/v1/greeter/say_hello`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            this.status = 'Unary call successful via REST.';
            this.helloResponse = data.message;
          })
        .catch(error => {
          this.status = `REST Error: ${error.message}`;
          this.helloResponse = `Error: ${error.message}`;
        });
      }
    },

    callAggregateHello() {
      this.status = `Sending AggregateHello request via ${this.accessMethod.toUpperCase()} in ${this.environment} environment...`;
      
      if (this.accessMethod === 'grpc-web') {
        const request = new HelloRequest();
        request.setName(this.name);
        
        this.getGrpcGreeterClient().aggregateHello(request, {})
          .then(response => {
            this.status = 'Aggregate call successful via gRPC-Web.';
            this.helloResponse = response.getMessage();
          })
          .catch(err => {
            this.status = `Error: ${err.message}`;
            this.helloResponse = `Error: ${err.code} ${err.message}`;
          });
      } else { // REST API - AggregateHello is also mapped to REST in .proto
        const payload = { name: this.name };
        
        fetch(`${this.restEndpoint}/v1/greeter/aggregate_hello`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          this.status = 'Aggregate call successful via REST.';
          this.helloResponse = data.message;
        })
        .catch(error => {
          this.status = `REST Aggregate Error: ${error.message}`;
          this.helloResponse = `Error: ${error.message}`;
        });
      }
    },

    callSayHelloStream() {
      if (this.accessMethod === 'grpc-web') {
        this.streamResponses = [];
        this.status = 'Starting stream via gRPC-Web...';
        const request = new HelloRequest();
        request.setName(this.name);

        const stream = this.getGrpcGreeterClient().sayHelloStream(request, {});
        
        stream.on('data', (response) => {
          this.streamResponses.push(response.getMessage());
        });

        stream.on('status', (status) => {
          console.log('Stream status:', status);
          if (status.code !== 0) {
              this.status = `Stream error: ${status.details}`;
          }
        });
        
        stream.on('end', () => {
          this.status = 'Stream ended.';
        });
      } else {
        // Stream is not supported via REST API, show a message
        this.status = 'Stream requests are not supported via REST API. Use gRPC-Web.';
      }
    },

    // --- Weather Methods ---
    callGetWeather() {
      this.status = `Fetching weather for ${this.city} via ${this.accessMethod.toUpperCase()} in ${this.environment} environment...`;
      
      if (this.accessMethod === 'grpc-web') {
        const request = new WeatherRequest();
        request.setCity(this.city);

        this.getGrpcWeatherClient().getWeather(request, {})
          .then(response => {
            this.status = 'Weather fetched successfully via gRPC-Web.';
            this.weatherResponse = {
              temperature: response.getTemperature(),
              humidity: response.getHumidity(),
              condition: response.getCondition(),
              description: response.getDescription(),
            };
          })
          .catch(err => {
            this.status = `Error: ${err.message}`;
            this.weatherResponse = null;
          });
      } else { // REST API
        // Using GET request for weather service
        fetch(`${this.restEndpoint}/v1/weather/${this.city}`)
        .then(response => response.json())
        .then(data => {
          this.status = 'Weather fetched successfully via REST.';
          this.weatherResponse = {
            temperature: data.temperature,
            humidity: data.humidity,
            condition: data.condition,
            description: data.description,
          };
        })
        .catch(error => {
          this.status = `REST Weather Error: ${error.message}`;
          this.weatherResponse = null;
        });
      }
    },
    weatherConditionToString(condition) {
        switch(condition) {
            case WeatherCondition.SUNNY: return 'Sunny';
            case WeatherCondition.CLOUDY: return 'Cloudy';
            case WeatherCondition.RAINY: return 'Rainy';
            case WeatherCondition.STORMY: return 'Stormy';
            default: return 'Unknown';
        }
    }
  }
};
</script>

<style scoped>
.greeter {
  max-width: 800px;
  margin: auto;
}
.service-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}
input {
  padding: 8px;
  margin: 10px;
}
button {
  padding: 8px 12px;
  margin: 5px;
  cursor: pointer;
}
.status {
  margin-top: 20px;
  font-style: italic;
  color: #555;
}
ul {
  list-style-type: none;
  padding: 0;
}
.access-selector {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.env-selector {
  background-color: #e8f4f8;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.access-selector label,
.env-selector label {
  margin-right: 15px;
  cursor: pointer;
}
</style>