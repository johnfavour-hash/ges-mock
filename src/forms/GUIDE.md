# Forms Directory Guide

This directory encapsulates form logic, separating it from the UI.

## Conventions

- **Naming**: `*.form.ts` (e.g., `login.form.ts`).
- **Hook Pattern**: Export a custom hook (e.g., `useLoginForm`) that returns the `react-hook-form` methods.

## Structure

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@schemas/auth/login.schema";

const useLoginForm = () => {
    return useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: { ... }
    });
}
export default useLoginForm;
```

## Rules

1. **Separation of Concerns**: The `.form.ts` file handles schema validation integration and default values. The `.tsx` component handles the UI and submission logic.
2. **Schemas**: Always use Zod schemas imported from `@schemas` for validation.
