# Schemas Directory Guide

This directory contains Zod schemas for validation.

## Conventions

- **Naming**: `*.schema.ts` (e.g., `login.schema.ts`).
- **Structure**: Group schemas by feature / domain logic.

## Rules

1. **Validation**: Use Zod for all validation schemas.
2. **Inference**: Export the inferred type from the schema for use in forms and components.
   ```typescript
   export const userSchema = z.object({ ... });
   export type UserSchema = z.infer<typeof userSchema>;
   ```
3. **Usage**: These schemas should be used by `react-hook-form` via resolvers in `src/forms` or for API response validation in `src/hooks`.
