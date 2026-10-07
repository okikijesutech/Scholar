# Engineering Standards & Guidelines

## Core Directive: Cambium-Driven Architectural Workflow
This project enforces **Cambium** (`https://github.com/okikijesutech/cambium`) for continuous architectural health, drift prevention, and modular design.

### Mandatory Workflow Steps:

1. **Pre-Change Assessment**:
   - Before executing non-trivial refactorings or adding complex modules, run:
     ```bash
     npm run cambium:scan
     ```
   - Identify whether targeted files are approaching complexity outliers (cyclomatic complexity > 30, lines > 400, or high fan-in).

2. **Modular Architecture & Anti-Drift Guardrails**:
   - **Single Responsibility Principle (SRP)**: Do not create god-modules. Separate business logic, templates, serialization, API clients, and presentation components into distinct files.
   - **Complexity Limits**: Keep single-file cyclomatic complexity under 30.
   - **Line Count Limits**: Keep individual source files under 400 lines wherever possible.
   - **Type Centralization**: Do not redefine parameter interfaces inline. All domain contracts belong in `src/types/index.ts`.

3. **Post-Change Verification**:
   - After completing edits, always run:
     ```bash
     npm run cambium:scan
     npm run build
     ```
   - Verify that:
     - No new complexity outliers were introduced.
     - Structural deltas (Δcomplexity, Δlines) are healthy.
     - TypeScript compiler passes with 0 errors (`tsc -b && vite build`).

4. **Atomic Conventional Commits**:
   - Commit code atomically by architectural layer:
     - `refactor(...)`
     - `feat(...)`
     - `fix(...)`
     - `docs(...)`
   - Document Cambium metric changes in commit bodies and review reports.
