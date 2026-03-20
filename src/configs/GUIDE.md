# Configs Directory Guide

This directory contains global configuration files for the application.

## Conventions

- **Naming**: `*.config.ts` (e.g., `axios.config.ts`, `theme.config.ts`, `env.config.ts`).
- **Exports**: Use named exports or default exports consistently within a file.

## Specific Configs

- **`env.config.ts`**: Centralized access to environment variables.
  - **Rule**: NEVER access `import.meta.env` directly in components. Always import from `@configs/env.config`.
  
- **`axios.config.ts`**: Axios instance configuration.
  - **Rule**: Use the exported `axiosClient` for all HTTP requests to ensure interceptors (auth, error handling) are applied.

- **`providers.config.tsx`**: Global providers wrapper.
  - **Rule**: Add new global context providers (QueryClientProvider, ThemeProvider) here.

## Rules

1. **Centralization**: All global settings must live here.
2. **Immutability**: Configuration objects should generally be treated as read-only runtime constants.
