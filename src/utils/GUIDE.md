# Utils Directory Guide

This directory contains pure utility functions and helpers.

## Conventions

- **Naming**: `*.util.ts` (e.g., `date.util.ts`, `format.util.ts`).
- **Scope**: Generic, domain-agnostic helpers.

## Rules

1. **Pure Functions**: Utilities should be pure functions whenever possible (output depends only on input, no side effects).
2. **No Components**: Do not define React components here.
3. **No State**: Utilities should not access global store state directly. Pass necessary data as arguments.
