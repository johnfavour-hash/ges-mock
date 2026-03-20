# Services Directory Guide

This directory acts as the API abstraction layer.

## Conventions

- **Naming**: `*.service.ts` (e.g., `auth.service.ts`).
- **Structure**: Export a simple object identifying the service with methods.

## Example

```typescript
export const AuthService = {
    login: async (payload: LoginData) => {
        const { data } = await axiosClient.post("/auth/login", payload);
        return data; // Return only the data, not the full axios response object
    }
}
```

## Rules

1. **Stateless**: Services must be stateless functions. Do not store tokens or user data here (pass them as arguments or access current state from store if strictly necessary, but prefer passing args).
2. **Axios Client**: Always use `axiosClient` from `@configs/axios.config` to ensure interceptors work.
3. **No UI Logic**: Do not trigger UI updates (toasts, redirects) here unless handled by the global interceptor. Let the calling hook handle specific UI feedback if needed.
