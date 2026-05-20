FROM eclipse-temurin:17-jdk-alpine
LABEL authors="Artur Dommy"
ARG JAR_FILE=target/MiniInventario-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app_miniinventario.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/app_miniinventario.jar"]
