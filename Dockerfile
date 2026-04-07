# --- Stage 1: Build the React Frontend ---
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
# These paths are relative to the project root (BPMN/)
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build the Spring Boot Backend ---
FROM eclipse-temurin:17-jdk AS backend-build
WORKDIR /app/backend
# Copy the backend folder contents
COPY backend/ ./
# Copy the built frontend into Spring Boot's static resources
COPY --from=frontend-build /app/frontend/build /app/backend/src/main/resources/static
RUN ./gradlew bootJar -x test

# --- Stage 3: Run the final application ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Find the built JAR (using wildcard to be safe)
COPY --from=backend-build /app/backend/build/libs/*.jar app.jar
EXPOSE 8080

# Environment variables for Render
ENV PORT=8080
# Use 512MB RAM limit for Render Free Tier
ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]