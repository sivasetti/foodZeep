# Engineering Decisions

## Overview

Documenting key architectural and engineering choices in FoodZeep. Each decision includes the problem, solution, rationale, and tradeoffs.

---

## Why Express (not NestJS)

**Problem:** Need a backend framework for REST API development.

**Decision:** Express.js 5

**Rationale:**
- Complete flexibility over project architecture
- Forces understanding of backend fundamentals
- No magic/opinionated conventions
- Easier to refactor later if needed
- Massive ecosystem and community support

**Tradeoffs:**
- ❌ More boilerplate code
- ❌ No built-in dependency injection
- ❌ Manual middleware setup
- ✅ Full control over architecture
- ✅ Better learning experience
- ✅ Simpler debugging

---

## Why MySQL

**Problem:** Need a relational database for transactional food ordering.

**Decision:** MySQL 8

**Rationale:**
- Strong transactional guarantees for checkout
- ACID compliance for order processing
- Mature and battle-tested
- Good tooling and community support
- Free and open-source

**Tradeoffs:**
- ❌ Less flexible than PostgreSQL for complex queries
- ❌ No built-in JSON document storage (compared to Postgres)
- ✅ Excellent performance for read-heavy workloads
- ✅ Wide hosting provider support
- ✅ Strong replication support

---

## Why Knex (for migrations only)

**Problem:** Need schema version control and migration management.

**Decision:** Knex.js migrations (not as ORM)

**Rationale:**
- Database-agnostic migration files
- Rollback support for safe deployments
- Version control for schema changes
- Keeps SQL explicit and understandable
- No ORM abstraction overhead

**Tradeoffs:**
- ❌ No query builder usage (raw SQL in models)
- ❌ No schema validation at runtime
- ✅ Full SQL control
- ✅ Simpler debugging
- ✅ No N+1 query problems

---

## Why JWT

**Problem:** Need stateless authentication for REST API.

**Decision:** JWT (JSON Web Tokens)

**Rationale:**
- Stateless - no server-side session storage
- Scalable across multiple servers
- Standard protocol
- Works well with mobile clients
- Easy to implement

**Tradeoffs:**
- ❌ Cannot revoke tokens before expiry
- ❌ Larger payload than session IDs
- ✅ No session storage required
- ✅ Horizontal scaling is trivial
- ✅ Works offline (for validation)

---

## Why CommonJS (not ESM)

**Problem:** Need module system for Node.js backend.

**Decision:** CommonJS (`require/module.exports`)

**Rationale:**
- Default Node.js module system
- No build step required
- Simpler debugging
- Better compatibility with older packages
- Team familiarity

**Tradeoffs:**
- ❌ No tree-shaking
- ❌ No top-level await
- ✅ No transpilation needed
- ✅ Synchronous require
- ✅ Wider package compatibility

---

## Why Raw SQL (not ORM)

**Problem:** Need database query layer.

**Decision:** Raw SQL via mysql2

**Rationale:**
- Full control over queries
- No ORM abstraction overhead
- Easier to optimize
- Better debugging
- No N+1 query problems

**Tradeoffs:**
- ❌ More boilerplate
- ❌ Manual query construction
- ❌ No type safety
- ✅ Performance transparency
- ✅ Full SQL power
- ✅ No migration surprises

---

## Why Joi (not Zod/Express-validator)

**Problem:** Need request validation.

**Decision:** Joi

**Rationale:**
- Mature and battle-tested
- Excellent error messages
- Schema-based validation
- Good documentation
- Works with any framework

**Tradeoffs:**
- ❌ Larger bundle size than Zod
- ❌ No TypeScript inference
- ✅ Better error messages
- ✅ More validation rules
- ✅ Widely used

---

## Why Multer (not Busboy/Formidable)

**Problem:** Need file upload handling.

**Decision:** Multer

**Rationale:**
- Official Express middleware
- Simple API
- Good integration with Express
- Handles multipart/form-data
- Configurable storage

**Tradeoffs:**
- ❌ Less flexible than Busboy
- ❌ Memory usage for large files
- ✅ Easy to use
- ✅ Express native
- ✅ Good documentation

---

## Why Modular Monolith (not Microservices)

**Problem:** Need architecture that balances simplicity and scalability.

**Decision:** Modular Monolith

**Rationale:**
- Simpler deployment during MVP
- Lower infrastructure costs
- Easier debugging
- Faster development
- Ready for future extraction

**Tradeoffs:**
- ❌ Tighter coupling than microservices
- ❌ Harder to scale independently
- ✅ Simpler operations
- ✅ Faster iteration
- ✅ Lower latency

---

## Why Transactions for Orders

**Problem:** Need atomic order placement with stock updates.

**Decision:** Database transactions via `runInTransaction()`

**Rationale:**
- Ensures data consistency
- Prevents race conditions
- Atomic stock updates
- Rollback on failure
- ACID compliance

**Tradeoffs:**
- ❌ Slightly slower (locking)
- ❌ More complex code
- ✅ Data integrity
- ✅ No partial orders
- ✅ Reliable stock management

---

## Why Role-Based (not Permission-Based)

**Problem:** Need authorization system.

**Decision:** Simple role-based access (buyer, seller, Admin)

**Rationale:**
- Simple to implement
- Easy to understand
- Sufficient for MVP
- Easy to extend later
- Clear business logic

**Tradeoffs:**
- ❌ Less granular than permissions
- ❌ Role explosion risk
- ✅ Simple to maintain
- ✅ Clear access rules
- ✅ Easy to audit

---

## Decision Log

| Date | Decision | Status |
|------|----------|--------|
| 2026-05 | Express 5 backend | Active |
| 2026-05 | MySQL database | Active |
| 2026-05 | JWT authentication | Active |
| 2026-05 | Knex migrations | Active |
| 2026-05 | Raw SQL queries | Active |
| 2026-05 | Modular monolith | Active |
| 2026-05 | CommonJS modules | Active |
| 2026-05 | Joi validation | Active |
| 2026-05 | Multer uploads | Active |
| 2026-05 | Role-based auth | Active |
