# Engineering Challenges & Error Resolution Log

During the development of the AI Test Case Generator SaaS, we encountered several architectural bugs and errors that were methodically resolved. This document serves as a knowledge base to help other developers understand the pitfalls in building real-time Full-Stack React + FastAPI applications.

### 1. Independent React Component State Desynchronization
**The Error**: `Displaying stale data in the Reports Tab after Test Suite Deletion.`
- **Cause**: To prevent the Generator tab from losing its unsubmitted state (entered test cases, input text) when the user navigated away, we used CSS `display: none` masking instead of relying on standard React Router unmounting. While this preserved the Generator, it meant the `HistoryPanel` and `ReportDashboard` were independently hiding in the DOM, maintaining entirely separate local `useState(history)` arrays. When a Test Suite was deleted, only the tab executing the delete function removed the item; the other sibling tabs were completely out-of-sync.
- **The Fix**: We stripped the local hooks from the children and shifted to a **Centralized Single Source of Truth**. We lifted `const [history, setHistory]` to the top-level `Dashboard.tsx` parent, and piped the `history` and `onRefresh` commands backwards down into the tabs natively via Props. This inherently guarantees 100% mathematical consistency without relying on fragile JavaScript Window event listeners.

### 2. Tailscale/PostCSS Internal Server Error (`border-border`)
**The Error**: `Internal server error: Cannot apply unknown utility class border-border`
- **Cause**: Upgrading to the modern Tailwind CSS v4 alpha structure unexpectedly broke a legacy snippet in `index.css` looking for `@apply border-border`, which was an undefined Tailwind token.
- **The Fix**: Removed the rogue utility classes in `index.css` and strictly relied on Tailwind's native `border-white/10` and `border-transparent` explicit colors.

### 3. Recharts ResponsiveContainer Minimum Height Collapse
**The Error (Console Warning)**: `The width(-1) and height(-1) of chart should be greater than 0...`
- **Cause**: The Recharts `<ResponsiveContainer>` wrapper strictly requires its direct parent `div` to have an explicitly declared pixel boundary or minimum height. Because the CSS display was masking it arbitrarily, it collapsed to 0px and threw a warning loop.
- **The Fix**: Hardcoded `<div className="h-64 min-h-[16rem]">` into the wrapper div above the ResponsiveContainer.

### 4. Nested Pydantic Model Validation Failures (FastAPI)
**The Error**: `422 Unprocessable Entity - Value Error on /save-testcases endpoint`
- **Cause**: Cohere sometimes hallucinated unstructured Markdown wrappers (like \`\`\`json) outside of the requested JSON object boundaries, causing FastAPI's rigorous Pydantic schemas to reject the incoming payload entirely.
- **The Fix**: Enhanced the Cohere System Prompt in `ai_testcase_engine.py` to aggressively demand strict schema-matching without markdown. Also injected a regex-cleanser function running across the `response.text` string removing ````json` dynamically before parsing it through `json.loads()`.

### 5. MongoDB BSON ObjectId Serialization Conflicts
**The Error**: `TypeError: ObjectId('...') is not JSON serializable`
- **Cause**: Standard Python JSON libraries cannot natively parse MongoDB `_id` objects directly into HTTP Rest responses. 
- **The Fix**: We leveraged Pydantic V2's robust configuration features, adding a custom `PyObjectId` type wrapper combining `Annotated[str, BeforeValidator(str)]`, combined with `ConfigDict(populate_by_name=True)`. This automatically coerced the BSON IDs into valid strings precisely before sending them over the FastAPI network wire.

### 6. Cascading Deletion Mapping Failure
**The Error**: Deleting a group of test cases generated at the same time was impossible because they were only tracked individually in a massive flat array in MongoDB.
- **Cause**: Our initial Data Schema only utilized `test_id` (e.g., `TC_001`). 
- **The Fix (Phase 4)**: Completely re-architected the Database models to include `suite_id: str` (UUID generated on save) and `suite_name: str`. We built a dedicated router `@router.delete("/delete-suite/{suite_id}")` which utilizes `db.test_cases.delete_many({"suite_id": suite_id})` to flawlessly wipe heavily grouped arrays in a single action.
