FROM ubuntu:22.04
RUN apt update
RUN apt upgrade -y
RUN apt install openjdk-17-jre-headless -y
RUN mkdir /opt/tomcat
WORKDIR /tmp
ADD https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.41/bin/apache-tomcat-10.1.41.tar.gz .
RUN tar -xzvf apache-tomcat-10*tar.gz -C /opt/tomcat --strip-components=1
COPY ./*.war /opt/tomcat/webapps
EXPOSE 8080
CMD ["/opt/tomcat/bin/catalina.sh", "run"]