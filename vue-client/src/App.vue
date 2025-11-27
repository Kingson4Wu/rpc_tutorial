<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <Greeter msg="Welcome to Your gRPC-Vue Client App"/>
</template>

<script>
import Greeter from './components/Greeter.vue'

export default {
  name: 'App',
  components: {
    Greeter
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
