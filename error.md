# Troubleshooting History

## 1. Vite Import Analysis Error (`Failed to resolve import "framer-motion"`)
**Symptom**: 
```text
Pre-transform error: Failed to resolve import "react-router-dom" from "src/App.tsx". Does the file exist?
```
**Why it happened**: 
In the initial project setup, Vite (acting as the dev server) attempted to bundle the React application. Our code included `import { motion } from 'framer-motion'`, but the `npm install` command containing these dependencies either hadn't been run yet or hadn't completed successfully before the server was booted up. Without the modules physically present in `node_modules`, Vite throws a fatal error and crashes the HMR (Hot Module Replacement) loop.

**Resolution**: 
Ran the explicit dependency string: `npm install react-router-dom framer-motion lucide-react clsx tailwind-merge axios recharts`.

---

## 2. Uvicorn ModuleNotFoundError (`No module named 'cohere'`)
**Symptom**:
```text
ModuleNotFoundError: No module named 'cohere'
```
**Why it happened**:
Similar to the frontend, the FastAPI backend was instructed to start running via `python -m uvicorn app.main:app`. However, the Python virtual environment (often located at `.venv`) didn't have the third-party dependencies from `requirements.txt` installed yet. When `app.main` tried to import the Cohere testing engine, Python couldn't locate it in its site-packages.

**Resolution**:
Ran `pip install -r requirements.txt`. (Note: in environments with spaces in directory names, absolute paths to `python.exe` inside `.venv` must be quoted properly, e.g., `& "f:\Pyhton-Projects\AI Test Case Generator\.venv\Scripts\python.exe" -m pip install -r requirements.txt`).

---

## 3. TypeScript Interface Re-export Error
**Symptom**:
```text
Uncaught SyntaxError: The requested module '/src/types/testcaseTypes.ts' does not provide an export named 'TestCaseDBModel'
```

**Why it happened**:
In modern Vite + TypeScript setups (specifically when using `esbuild` or when `isolatedModules` is enabled in `tsconfig.json`), you cannot import a pure TypeScript `interface` or `type` using standard value import syntax if that interface doesn't compile down to actual JavaScript code. When Vite tries to serve this to the browser natively, the browser complains that the JavaScript file actually contains no variable named `TestCaseDBModel` (because interfaces evaporate at runtime).

**Resolution**:
Modified the import statements in React components complaining about this error to explicitly use the `import type` syntax:
```typescript
// Incorrect in isolated environments
import { TestCaseDBModel } from '../types/testcaseTypes';

// Correct
import type { TestCaseDBModel } from '../types/testcaseTypes';
```
This tells Vite to strip this strictly at compile-time and refrain from attempting to fetch a runtime variable from the `.ts` module.

---

## 4. Tailwind V4 "Cannot apply unknown utility class `border-border`" Error
**Symptom**:
```text
[vite] (client) Pre-transform error: Cannot apply unknown utility class `border-border`
```

**Why it happened**:
Our initial SaaS stylesheet utilized the standard Tailwind CSS `v3` architecture for defining custom colors in CSS variables within an `@layer base { :root { ... } }` block.
However, when we upgraded to the brand new **Tailwind V4 Vite Plugin**, it deprecated this older mechanism entirely. V4 dynamically scans CSS variables directly, but *only* if they are explicitly registered within a proprietary `@theme` block and prefixed with `--color-*` or `--font-*` namespaces. Because we didn't specify these namespaces, Tailwind V4 failed to parse `--border` into a utility class, resulting in Vite crashing on compile.

**Resolution**:
Replaced the `v3` legacy `@layer base` root block entirely with the brand new overarching `@theme` directive blocks:
```css
@theme {
  --color-border: hsl(214.3 31.8% 91.4%);
  --color-input: hsl(214.3 31.8% 91.4%);
}
```
