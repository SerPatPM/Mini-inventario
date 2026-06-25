# Etapa 1: compila el proyecto con Maven (genera el .jar dentro del build)
FROM eclipse-temurin:25-jdk AS build
LABEL stage="build"
WORKDIR /app

COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw package -DskipTests -B

# Etapa 2: imagen final, solo lleva el .jar ya compilado (más ligera)
FROM eclipse-temurin:25-jre AS runtime
LABEL authors="Artur Dommy"
WORKDIR /

COPY --from=build /app/target/MiniInventario-0.0.1-SNAPSHOT.jar app_miniinventario.jar

EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/app_miniinventario.jar"]
