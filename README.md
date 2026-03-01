# Hybrid Text Engine

A modular, high-performance AI orchestration engine built with **Next.js**, **TypeScript**, and **Clean Architecture**. This project demonstrates a scalable approach to integrating LLMs (Large Language Models) into web applications using a self-correcting **Critic Pattern**. 

## Project Overview

This project implements a small, extensible text-generation engine designed to support multiple content domains (e.g., job applications, marketplaces). 
Future development will include **AI-powered content generation** via pluggable providers, enabling smarter and more dynamic outputs.

## 🌟 Key Innovations

* **Self-Correcting Critic Loop**: Unlike basic wrappers, this engine forces the AI to critique its own work. If a generation score falls below a threshold (e.g., 80/100), the engine automatically triggers a second "refinement" pass to improve quality.
* **Domain-Driven Engine Modes**: Uses a Registry Pattern to handle distinct content domains (Job Applications, Marketplaces, and ATS Comparisons) while maintaining total type safety.
* **Discriminated Union Architecture**: Every input and output is strictly typed, preventing runtime errors and ensuring that the API boundary always returns predictable, structured data.
* **Provider Agnostic**: Features a pluggable `EngineRunner` interface. Easily switch between OpenAI, Anthropic, or local LLMs without touching the core business logic.

---

## 🏗️ Technical Architecture

The engine is built on a "Decoupled Orchestration" model:

1.  **Registry & Routing**: A centralized `MODE_REGISTRY` maps incoming requests to specialized `EngineMode` handlers.
2.  **The Prompt Builder**: Each mode transforms structured data into optimized, high-context JSON-based instructions for the LLM.
3.  **Structured Formatting**: AI responses are parsed and normalized into a consistent `EngineOutput` format, including a dedicated `analysis` object for transparency.

---

## 📊 Implemented Modes

| Mode | Functionality | "Unique Sauce" |
| :--- | :--- | :--- |
| **Job Application** | Cover Letters & Resume Summaries | Self-critique of tone and skill alignment. |
| **Marketplace** | Product titles, descriptions & SEO tags | Automatic extraction of selling points and SEO optimization. |
| **Job Comparison** | Job Description vs. Resume analysis | Semantic gap analysis with ✅/❌ match reporting. |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **AI Integration**: OpenAI SDK (GPT-4o / GPT-3.5-Turbo)
- **Testing**: [Jest](https://jestjs.io/) / Vitest for deterministic logic and API boundary testing.

---

## 🚦 Getting Started

### 1. Installation
```bash
npm install
```

## Running Tests
The engine includes a robust test suite covering logic, parsing, and the critic loop.

```bash
npm test
```


## Author

Barbara Palumbo 
Backend & Full-Stack Software Developer 
Clean Architecture, Observability & AI Enthusiast  

[LinkedIn](https://www.linkedin.com/in/barbara-palumbo-b3356a18b)


## License

This project is licensed under the [MIT License](LICENSE).
