# Backend Source Code Setup

The backend source code is provided in the concatenated text document. Follow these steps to set it up:

## Option 1: Manual Setup (Recommended)

1. Copy the backend code from the provided document into the appropriate directories

2. The directory structure should be:
```
backend/src/main/java/com/hero/leadnurturing/
├── config/
│   ├── DataInitializer.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtUtil.java
│   ├── PasswordConfig.java
│   └── SecurityConfig.java
├── controller/
│   ├── AuthController.java
│   ├── ChatController.java
│   ├── DashboardController.java
│   ├── LeadController.java
│   └── UploadController.java
├── dto/
│   ├── ApiResponse.java
│   ├── DashboardStatsDTO.java
│   ├── LeadResponseDTO.java
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── UploadResponseDTO.java
├── entity/
│   ├── ChatMessage.java
│   ├── Lead.java
│   ├── LeadModification.java
│   ├── LeadStatus.java
│   ├── User.java
│   └── UserRole.java
├── exception/
│   ├── CustomException.java
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── ChatMessageRepository.java
│   ├── LeadModificationRepository.java
│   ├── LeadRepository.java
│   └── UserRepository.java
├── service/
│   ├── ChatService.java
│   ├── CustomUserDetailsService.java
│   ├── DashboardService.java
│   ├── FileUploadService.java
│   ├── LeadService.java
│   └── UserService.java
└── LeadnurturingApplication.java
```

3. Create `src/main/resources/application.properties` with the content from the document

4. Create `src/test/java/com/hero/leadnurturing/LeadnurturingApplicationTests.java`

## Option 2: Use Your IDE

Most modern IDEs (IntelliJ IDEA, Eclipse, VS Code) can create the structure for you:

1. Open the backend folder as a Maven project
2. Create the package structure: `com.hero.leadnurturing`
3. Create subdirectories: config, controller, dto, entity, exception, repository, service
4. Copy-paste each class from the document

## Option 3: Use Provided Script (if applicable)

If you're on a Unix-like system, you can use the extraction script (if provided).

## Verification

After setting up:

1. Run Maven validate:
```bash
./mvnw validate
```

2. Compile the project:
```bash
./mvnw compile
```

3. Run the application:
```bash
./mvnw spring-boot:run
```

If everything is set up correctly, you should see:
```
Started LeadnurturingApplication in X.XXX seconds
```

## Common Issues

**"Package does not exist"**
- Verify all files are in the correct directory
- Check that package declarations match directory structure

**"Cannot find symbol"**
- Make sure all dependencies are in pom.xml
- Run `./mvnw clean install`

**"Port 9090 already in use"**
- Change the port in application.properties:
  ```properties
  server.port=8080
  ```

For the complete source code, refer to the concatenated document provided.
