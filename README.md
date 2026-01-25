# Hybrid Text Engine

Modular text-generation engine built with Next.js and TypeScript.

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

- **Job Application Mode**
  Generates both:
  - a tailored cover letter
  - a structured resume / CV section

The architecture is intentionally designed to allow additional modes
to be added with minimal changes to the core engine.

