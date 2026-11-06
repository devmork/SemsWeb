---
name: api-doc
description: Auto-generate API documentation from TanStack Router routes and Axios service calls
disable-model-invocation: false
---

# API Documentation Skill

Generates API documentation from the codebase's route definitions and service layer.

## What it does

Scans `src/routes/` for TanStack Router route definitions and `src/features/*/service/` for Axios service methods, then produces markdown documentation covering:

- Endpoints (method + path)
- Route parameters and query params
- Request/response shapes (inferred from TypeScript types)
- Service method signatures

## Usage

`/api-doc` — generates `docs/API.md` from the current source tree

## Example output

```markdown
# API Reference

## Routes

| Method | Path | Params | Component |
|--------|------|--------|-----------|
| GET | /evaluation-session/:sessionId | sessionId | EvaluationTakingView |

## Services

### evaluationService
- `getEvaluations(sessionId: string) → Promise<Evaluation[]>`
- `submitEvaluation(data: EvaluationPayload) → Promise<void>`
```
