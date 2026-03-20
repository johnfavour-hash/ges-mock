# Hooks Directory Guide

This directory contains custom React hooks, primarily for data fetching and reusable logic.

## Conventions

- **Naming**: `*.hook.ts` (e.g., `auth.hook.ts`).
- **Export Pattern**: Use a grouping object for related hooks (e.g., `export const AuthHook = { ... }`).

## Rules

1. **React Query Wrappers**: Encapsulate `useQuery` and `useMutation` calls here. Do not make raw query calls in components.
2. **Service Integration**: Hooks should call functions from `@services`, which in turn call Axios.
3. **Type Safety**: Explicitly type the query data, error, variables, and context types.

## Example

```typescript
export const AuthHook = {
    useLogin: (options?: UseMutationOptions<...>) => useMutation({
        mutationFn: (payload) => AuthService.login(payload),
        ...options
    })
}
```
