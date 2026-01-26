# Hybrid Text Engine

Modular text-generation engine built with Next.js and TypeScript.

## Project Overview

This project implements a small, extensible text-generation engine designed to support multiple content domains (e.g., job applications, marketplaces). 
Future development will include **AI-powered content generation** via pluggable providers, enabling smarter and more dynamic outputs.

## Project Status

Work in progress. Core architecture and modular EngineMode system are in place. 
Planned improvements include:

- AI provider integration for automated content generation
- Additional content modes for new domains
- Enhanced input validation and output normalization


## Features
- Engine-based architecture
- Multiple content modes
- Server-side API boundary
- Extensible for AI providers

## Tech Stack
- Next.js (App Router)
- TypeScript
- Node.js

## Architecture Overview

This project implements a small, extensible text-generation engine designed
to support multiple content domains (e.g. job applications, marketplaces).

### Core Concepts

- **EngineMode**
  Each domain is implemented as an `EngineMode` responsible for:
  - building a prompt from structured input
  - formatting the raw output into a domain-specific result

- **Engine Core**
  The core engine is mode-agnostic and only coordinates:
  - input validation
  - mode execution
  - output normalization

- **Type Safety**
  All engine inputs and outputs are fully typed using TypeScript generics,
  ensuring compile-time safety when adding new modes.

### Current Modes

**Job Application Mode** – Generates tailored cover letters and structured resume/CV sections.  
Future modes will leverage **AI models** to provide richer, context-aware content for other domains.

## Author

Barbara Palumbo 
Backend & Full-Stack Software Developer 
Clean Architecture, Observability & AI Enthusiast  

[LinkedIn](https://www.linkedin.com/in/barbara-palumbo-b3356a18b)


## License

This project is licensed under the [MIT License](LICENSE).
