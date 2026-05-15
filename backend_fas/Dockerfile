#Stage1: Build application -> ra .jar
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
# Copy pom.xml trước để cache dependencies (tránh download lại khi chỉ đổi code)
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy source và build
COPY src src
RUN mvn clean package -DskipTests
# Stage 2: Runtime image (nhỏ gọn hơn)
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy jar từ builder
COPY --from=builder /app/target/*.jar app.jar
#EXPOSE post
EXPOSE 8081
#RUN
ENTRYPOINT [ "java", "-jar", "app.jar"]