"# Activiti-Process-AI-Model" 

### Project Overview: Activiti AI Process Suite
This project is a comprehensive Enterprise Business Process Management (BPMN) Platform that combines visual process modeling, artificial intelligence, and real-time analytics into a single cloud-native application.

### Core Modules
- AI-Powered BPMN Designer
  
  - A professional-grade modeling canvas powered by bpmn-js .
  - Natural Language to BPMN : Users can describe a business process in plain English (e.g., "A 3-step vacation approval with manager and HR review" ), and the system generates a valid BPMN 2.0 XML diagram automatically.
  - One-Click Deployment : Models are deployed directly from the browser to the live Activiti process engine.
- Process Orchestration Engine
  
  - Powered by Activiti 8 and Spring Boot 3.3.4 .
  - Manages the entire lifecycle of business processes, including execution, state persistence, and task management.
  - Built with a secure, permissive API layer for seamless frontend integration.
- Real-Time Analytics Dashboard
  
  - Provides a high-level overview of all running process instances.
  - Features dynamic data visualization using recharts to monitor active, completed, and suspended processes.
  - Displays the enterprise technology stack powering the engine (Spring, Postgres, Kafka, etc.).
### Technical Architecture
- Backend (Java)
  
  - Framework : Spring Boot 3.3.x (Jakarta EE 10).
  - Engine : Activiti 8 Core.
  - Security : Spring Security 6 (Custom CORS and CSRF configuration).
  - Persistence : PostgreSQL (for production) and H2 (for local development).
- Frontend (JavaScript)
  
  - Library : React 18.
  - Modeling : bpmn-js Modeler.
  - Icons : react-icons (Silicon & Lucide sets).
  - Charts : recharts for SVG-based analytics.
- DevOps & Cloud
  
  - Containerization : Multi-stage Docker build integrating React into the Spring Boot JAR.
  - Hosting : Render (Cloud Web Service).
  - Database : Supabase & Render PostgreSQL (Managed SQL).
  - CI/CD : Automatic builds triggered via GitHub pushes.
### Key Features
- Unified Deployment : The frontend and backend are served from a single Docker container, eliminating CORS issues and reducing hosting costs.
- Enterprise-Ready : Uses industry-standard BPMN 2.0 namespaces and schema validation.
- Scalable : Designed to connect to high-availability PostgreSQL instances for persistent workflow persistence.
- AI-Driven : Reduces the barrier to entry for business users to create complex workflows without technical knowledge-to-process automation by automating XML generation.
### How to Use
1. Model : Draw your process manually or type a description for the AI.
2. Deploy : Hit "Deploy to Activiti" to push the blueprint to the cloud.
3. Monitor : Switch to the "Dashboard" tab to see your new process running in real-time.
