# Hybrid Text Engine

A modular AI orchestration engine built with **Next.js**, **TypeScript**, and **Clean Architecture**. This project demonstrates a scalable approach to integrating LLMs (Large Language Models) into web applications using a self-correcting **Critic Pattern**.

## Project Overview

This project implements a small, extensible text-generation engine designed to support multiple content domains (e.g., job applications, marketplaces, resume-to-JD comparison).
Future development will include additional providers and a broader mode library.

## 🌟 Key Innovations
 
* **Self-Correcting Critic Loop**: The model scores its own output and explains what is weak. If the score is below a threshold (80/100), the engine runs a refinement pass: the original task, the previous answer and the critique go back to the model. It repeats up to 2 times, keeps the best result, and falls back to the previous answer if a refinement cannot be parsed. Only modes where the score measures text quality opt in (Job Application, Marketplace); Job Comparison does not, because its score is a match percentage.
* **Domain-Driven Engine Modes**: Uses a Registry Pattern to handle distinct content domains (Job Applications, Marketplaces, and Job/Resume Comparisons) through a consistent `EngineMode` interface.
* **Provider Agnostic**: A pluggable `EngineRunner` interface. Switch between OpenAI, Google Gemini, or Groq without touching core business logic.
 
---

## 🏗️ Technical Architecture

The engine is built on a "Decoupled Orchestration" model:

1.  **Registry & Routing**: A centralized `MODE_REGISTRY` maps incoming requests to specialized `EngineMode` handlers.
2.  **The Prompt Builder**: Each mode transforms structured data into JSON-based instructions for the LLM.
3.  **Structured Formatting**: AI responses are parsed and normalized into a consistent `EngineOutput` format, including a dedicated `analysis` object for transparency and scoring.

---

## 📊 Implemented Modes

| Mode | Functionality | "Unique Sauce" |
| :--- | :--- | :--- |
| **Job Application** | Cover letters & resume summaries | Self-critique of tone and skill alignment, with a refinement pass. |
| **Marketplace** | Product titles, descriptions & SEO tags | Extraction of selling points and SEO-oriented copy. |
| **Job Comparison** | Job description vs. resume analysis | Match-percentage scoring with ✅/❌ gap reporting. |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: OpenAI (`gpt-3.5-turbo`), Google Gemini (`gemini-1.5-flash`), and Groq (`llama-3.3-70b-versatile`) via direct REST calls
- **Testing**: [Jest](https://jestjs.io/) for logic and API-boundary testing

---

## 🚦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure providers (optional)
```bash
cp env.example .env.local
```
Add the key for the provider you want to use (`OPENAI_API_KEY`, `GEMINI_API_KEY` or `GROQ_API_KEY`). Without a valid key the engine falls back to a `FakeRunner` with canned responses, so the app and the tests run with no API key. The Gemini model can be changed with `GEMINI_MODEL`; check Google's deprecations page, since older model names get retired.

### 3. Run
```bash
npm run dev
```

### 4. Running Tests
```bash
npm test
```
The tests use a fake runner and mocked HTTP, so they do not call any real LLM.

## Known limitations

- The critique comes from the same model call that generates the text, so it is a self-assessment and not an independent judge.
- Provider integrations are covered by mocked tests only.

## Author

Barbara Palumbo
Backend & Full-Stack Software Developer
Clean Architecture, Observability & AI Enthusiast

[LinkedIn](https://www.linkedin.com/in/barbara-palumbo-b3356a18b)

## License

This project is licensed under the [MIT License](LICENSE).