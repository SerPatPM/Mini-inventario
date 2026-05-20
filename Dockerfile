FROM ubuntu:latest
LABEL authors="Artur Dommy"
ARG JAR-FILE=target/MiniInventario-0.0.1-SNAPSHOT.jar
COPY ${JAR-FILE} app_miniinventario.jar
ENTRYPOINT ["top", "-b"]
