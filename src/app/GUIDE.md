# App Directory Guide

This directory contains the main application structure, including pages and layouts.

## Directory Structure

```
src/app/
├── layouts/       # Shared layout wrappers
└── pages/         # Route component definitions
```

## Conventions

### Pages (`src/app/pages`)
- **Naming**: Use `page.tsx` for the main component of a route.
- **Organization**: Group pages by feature or route hierarchy (e.g., `auth/login/page.tsx`, `dashboard/overview/page.tsx`).
- **Exports**: Use `default export` for the page component.

### Layouts (`src/app/layouts`)
- **Naming**: Use `layout.tsx`.
- **Purpose**: Wrap pages with common UI elements (headers, sidebars, toast containers).
- **Navigation**: Use `Outlet` from `react-router` to render child routes.

## Rules

1. **No Business Logic**: Keep pages lightweight. Delegate data fetching and complex logic to custom hooks (`src/hooks`) or stores (`src/stores`).
2. **Composition**: Compose pages using components from `src/components`.
3. **Routing**: Define routes in `src/routes`, not directly in the page files (unless using file-system routing which we are NOT using here).
