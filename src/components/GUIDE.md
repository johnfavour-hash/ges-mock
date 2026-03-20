# Components Directory Guide

This directory houses all reusable UI components.

## Directory Structure

```
src/components/
├── ui/            # Atomic, primitive components (Buttons, Inputs, Dialogs)
└── shared/        # Composite, reusable business components (Forms, Tables)
```

## Conventions

### UI Components (`src/components/ui`)
- **Source**: Typically generated or adapted from a UI library (e.g., Chakra UI snippets, shadcn/ui).
- **Modification**: Avoid modifying these unless necessary for global design system changes.

### Shared Components (`src/components/shared`)
- **Naming**: PascalCase (e.g., `UserProfileCard.tsx`).
- **Scope**: Components used in multiple pages or layouts.

## Rules

1. **Presentational Only**: Components should receive data via props. Avoid direct API calls or specialized state management within components (use hooks instead).
2. **Prop Drilling**: Use context or composition to avoid excessive prop drilling.
3. **Styling**: strictly follow the project's theming system. Do not use hardcoded colors or magic numbers.
