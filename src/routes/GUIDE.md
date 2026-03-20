# Routes Directory Guide

This directory manages the application's routing configuration.

## Conventions

- **Naming**: `*.route.tsx` (e.g., `auth.route.tsx`).
- **Index**: `index.route.tsx` is the main entry point that aggregates all other route files.

## Rules

1. **Modularization**: Break routes down by feature module (Auth, Dashboard, User) rather than having one giant route file.
2. **Lazy Loading**: Use `React.lazy` for route components to improve performance.
3. **Layout Wrapping**: Define layout wrappers (e.g., `<Route element={<RootLayout />}>`) here to apply layouts to groups of routes.
