FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml for dependency caching
COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose the gRPC port
EXPOSE 50052

# Run the application
CMD ["java", "-jar", "target/java-server-0.0.1-SNAPSHOT.jar"]
