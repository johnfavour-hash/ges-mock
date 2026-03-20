# Stores Directory Guide

This directory handles global state management using Zustand.

## Conventions

- **Naming**: `*.store.ts` (e.g., `user.store.ts`).
- **Persistence**: Use `persist` middleware for state that should survive refreshes (like Auth tokens).

## Rules

1. **Atomic Stores**: Prefer splitting stores by domain (Auth, User, UI) rather than one giant store.
2. **Selectors**: Although Zustand allows accessing the whole state, try to consume only what you need.
3. **Actions**: Define actions (functions to modify state) within the store itself.

## Example

```typescript
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
        }),
        { name: 'auth-storage' }
    )
);
```
