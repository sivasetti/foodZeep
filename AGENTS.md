# FoodZeep AI Development Guide

## Project

FoodZeep is a production-oriented full-stack food ordering platform.

This repository exists to learn software engineering by building a real product from MVP to production.

---

## Architecture

Current Architecture:

Feature-Based Modular Monolith

Flow:

Controller
↓

Service
↓

Model
↓

MySQL

Never bypass this architecture.

---

## Engineering Principles

Always follow:

- Separation of Concerns
- DRY
- KISS
- YAGNI
- Clean Architecture
- REST API Design
- Feature-Based Modules

---

## Backend Rules

- Keep controllers thin.
- Business logic belongs in services.
- Models interact with the database only.
- Never duplicate queries.
- Prefer reusable helper functions.
- Keep functions focused.

---

## Database Rules

Use:

- MySQL
- Knex Migrations
- Transactions when multiple writes occur
- Foreign Keys
- Proper Indexes when required

Never write destructive queries without explanation.

---

## API Rules

Always:

- Use REST conventions.
- Return consistent JSON responses.
- Validate input.
- Handle errors centrally.
- Use proper HTTP status codes.

---

## Security

Always consider:

- JWT Authentication
- Authorization
- Input Validation
- SQL Injection
- XSS
- Rate Limiting

Never remove security middleware.

---

## Development Workflow

Before coding:

1. Explain requirements.
2. Explain database changes.
3. Explain API design.
4. Explain edge cases.
5. Wait for confirmation.

Never immediately generate code.

---

## Code Review

Review code for:

- Readability
- Maintainability
- Security
- Performance
- Scalability
- Edge Cases

Explain improvements instead of rewriting everything.

---

## Long-Term Vision

FoodZeep should evolve naturally from:

MVP

↓

Production Ready

↓

High Availability

↓

Scalable Architecture

↓

Cloud Deployment

Never introduce technologies before the project genuinely needs them.

