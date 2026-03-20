# Types Directory Guide

This directory holds shared TypeScript definitions.

## Conventions

- **Naming**: `*.type.ts` (e.g., `auth.type.ts`, `user.type.ts`).

## Rules

1. **Shared Interfaces**: Put interfaces used by more than one file here (e.g., API response shapes, global data structures).
2. **Re-exporting**: You can re-export inferred types from schemas here if it makes sense contextually, but prefer importing directly from `@schemas` if it's strictly validation-related.
3. **Avoid Enums**: Prefer union types (`'ADMIN' | 'USER'`) or `as const` objects over TypeScript `enum`.
