# Lumenci Assistant — Technical Stack Documentation

This document provides a comprehensive technical analysis of the application architecture found in `index_test.html`. 

## 1. FRONTEND FRAMEWORK
- **Framework Used**: React
- **Version**: 18.x (loaded via development builds)
- **How it is loaded**: Through unpkg CDNs directly in the `<head>`:
  - `https://unpkg.com/react@18/umd/react.development.js`
  - `https://unpkg.com/react-dom@18/umd/react-dom.development.js`
- **Why it was chosen**: React enables component-driven UI architecture. Loading it via CDN allows for a quick, zero-build environment that can run instantly in any browser without needing a Node.js runtime or local development servers.

## 2. PROGRAMMING LANGUAGE
- **Language**: JavaScript (ES6+ with JSX syntax)
- **How it runs in the browser**: Browsers cannot natively understand JSX. The code is wrapped in a `<script type="text/babel">` tag.
- **Transpiler**: `@babel/standalone` is loaded via CDN to transpile the JSX code into vanilla JavaScript in real-time within the browser before execution. 
- **Why**: This approach skips build steps like Webpack or Vite, keeping the entire application contained in a single shareable file.

## 3. STYLING APPROACH
- **How CSS is written**: The project primarily uses atomic utility classes directly inside JSX `className` attributes. A native `<style>` block is also used for global rules (like scrollbars) and complex custom elements (like the `.tog` toggle switches).
- **CSS Framework**: Tailwind CSS
- **Loaded via**: `https://cdn.tailwindcss.com` (Tailwind Play CDN)
- **Color Palette**: The app relies heavily on Tailwind's default palette, particularly `slate` and `blue` for its corporate UI:
  - **Primary Blue**: `#1e40af` (Tailwind `blue-800`), used for active states, headers, and the custom toggle slider.
  - **Slate/Gray**: `#cbd5e1` (Tailwind `slate-300`), used for disabled toggle states and scrollbars.
  - **Alert Colors**: Exact inline hex usages include specific background tagging: `#7c3aed` (purple), `#047857` (emerald/green), `#ef4444` (red), `#f97316` (orange).
- **Typography**: 
  - Standard body text: **Inter**
  - Headings (`h1`, `h2`, `h3`): **Plus Jakarta Sans**
  - Fonts are loaded via Google Fonts. A custom inline Tailwind configuration maps the `sans` font-family to Inter.

## 4. AI / API LAYER
*Note: The current `index_test.html` file implements a **mocked** state of the AI layer to demonstrate UX without using actual API keys. Based on user architecture instructions, the intended implementation behaves as follows:*

- **Primary AI Provider Name**: Google Gemini
- **Primary Model Name**: Gemini API (e.g., Gemini 1.5 Pro / Flash)
- **API Endpoint URL**: `https://generativelanguage.googleapis.com/v1beta/models/...`
- **Request Format Used**: JSON body with `contents` array and structural prompt instructions.
- **Response Parsing Method**: Regex parsing to extract specific `<UPDATE>` JSON tags strings from the AI's markdown response.
- **Fallback AI Provider Name**: OpenAI
- **Fallback Model Name**: GPT-4o-mini (or similar)
- **Fallback Endpoint URL**: `https://api.openai.com/v1/chat/completions`
- **How silent switching works**: A `try/catch` block attempts the primary Gemini request. If a network failure, validation failure, or timeout occurs, the `catch` block intercepts the error and immediately fires a secondary `fetch` request to the OpenAI endpoint without showing an error to the user.
- **Error handling approach**: If both providers fail, the system falls back to a generic error message pushed to the chat array: *"Unable to process request. Please check your API keys."*
- **Current Mock Implementation**: The `send` function in `AnalysisView` uses `setTimeout(..., 1500)` to simulate a 1.5-second network delay before pushing a hardcoded assistant response with an amendment object.

## 5. STATE MANAGEMENT
- **How app state is managed**: Core React `useState` hooks local to specific components, with top-level state passed down as props where necessary.
- **List of `useState` variables**:
  - `v` (in `App`): String storing the currently active screen. Controls global routing.
  - `q` (in `AllClaims`): String storing the search filter for the claims table.
  - `aS`, `sC`, `rT`, `eD`, `iA`, `fW`, `aR`, `ap` (in `SettingsView`): Booleans storing toggles (Auto-suggest, Confidence scores, Real-time highlighting, Email digest, In-app alerts, Format Word vs PDF, Include AI reasoning, Append sources).
  - `ints` (in `IntsView`): Array of objects storing the connected status of third-party integrations.
  - `style`, `thresh`, `autoHL`, `autoSug` (in `PreferencesView`): Strings/Numbers/Booleans storing AI behaviour configurations.
  - `msgs`, `inp`, `loading` (in `AnalysisView`): Array of chat objects, current chat input string, and boolean loading state for the AI chat panel.
- **How screen navigation works**: The root `App` component holds `const [v, sv] = useState('allClaims')`. The `v` string acts as a client-side router. `sv` (setView) is passed to `TopNav`, `Sidebar`, and views to trigger renders of different main components.
- **How chart history / undo works**: (Intended architecture) Uses a history stack array holding cloned snapshots of the chart JSON. An "undo" command pops the last snapshot from the history array and sets it as the active chart state.

## 6. COMPONENT ARCHITECTURE
- **`App`**: Main entry point; parses the router state and renders standard layout (Navs) + specific Views.
- **`TopNav`**: Global top menu bar for switching high-level modes (Workspace, Documents).
- **Sidebars (`ClaimsSidebar`, `WorkspaceSidebar`, `SettingsSidebar`)**: Context-aware left navigation menus that render dynamically depending on what `App` group is active.
- **`AllClaims`**: Renders the complete claim inventory, search fields, and team activity layout.
- **`ClaimDetail`**: The single claim view (Screen 2) showing 3 columns (Claim, Product, Reasoning) and confidence bars.
- **`AnalysisView`**: The split-screen AI chat engine interface.
- **`SettingsView`**: General account controls and global toggles.
- **`TeamView`**: Role permission management and seat utilization.
- **`UsageView`**: Analytics dashboard with quota monitoring and heatmaps.
- **`ProfileView`**: Analyst productivity metrics and personal overview.
- **`BillingView` & `PreferencesView` & `IntsView`**: Configuration panels for subscriptions, AI limits, and software connections.

## 7. DATA LAYER
- **Where mock data is stored**: Maintained as top-level constant arrays (`CLAIMS`, `TEAM`, `INTS`) right below the imports, allowing any component to read them. Sub-view data (like `ANALYSIS`) is stored locally inside the `AnalysisView` component.
- **Structure of claim chart data**: Primarily arrays of standard JSON objects (e.g., `{id: 'CLM-001', patent: 'US123456', element: '...', status: 'ACTIVE', conf: 92}`).
- **Data Update Lifecycle**: When the user clicks "Accept Changes" on an AI suggestion, the system updates the element's array locally within the state, triggering an instant React re-render of the specific row.

## 8. FILE STRUCTURE
- **`index_test.html`**: A monolithic single file.
  - `Lines 1-13`: HTML Head, CDNs, Font links, and Tailwind configuration.
  - `Lines 14-25`: Native CSS overrides.
  - `Lines 26-28`: HTML Body wrapper.
  - `Lines 30+`: The Babel script block containing all React Components, mock data, and mounting logic.
- **Why a single HTML file was chosen**: Portability. It functions as an instantly distributable, locally executable prototype that requires zero dependencies, zero build scripts, and no environment setup.

## 9. EXTERNAL DEPENDENCIES
- `https://unpkg.com/react@18/umd/react.development.js` — React Core (v18).
- `https://unpkg.com/react-dom@18/umd/react-dom.development.js` — React DOM render engine (v18).
- `https://unpkg.com/@babel/standalone/babel.min.js` — In-browser transpiler (latest stable).
- `https://cdn.tailwindcss.com` — Tailwind CSS runtime (latest stable v3).
- `https://fonts.googleapis.com/...` — Google Fonts API for typography rendering.

## 10. BROWSER APIs USED
- **Events & DOM**: Standard React synthetic event wrappers (`onClick`, `onChange`).
- **File downloads**: (Currently mocked with UI buttons mapped to empty functions or console tools). Standard implementation would use dynamically generated `Blob` URLs triggered via native `<a>` elements for downloading Word/PDF documents.
- **Storage**: No `localStorage` or `sessionStorage` is currently utilized. State memory is purely volatile (lost on browser refresh).

## 11. SECURITY APPROACH
- **How API keys are handled**: In the original app specification, API keys (`GEMINI_KEY`, `OPENAI_KEY`) are stored simply as string constants within the code.
- **Why keys are in code vs env variables**: This is a direct consequence of the zero-build single HTML file setup. Without a Node.js server or a build bundler (like Vite/Webpack), there is no `.env` loading capacity.
- **What should be changed for production**: 
  - Never ship API keys to the browser.
  - Extract all `fetch` triggers to a secure backend proxy server (e.g., Node.js / Python FastApi).
  - Web UI should ping the proprietary backend using an authorization token, and the backend communicates with Gemini/OpenAI securely.

## 12. KNOWN LIMITATIONS
- **What does not work in production**: 
  - Babel compiling JSX live requires immense memory and overhead on the client's browser, leading to sluggish initialization.
  - The Tailwind CDN dynamically parses classes heavily loading the DOM on start.
- **What needs to be changed before real deployment**:
  1. Migrate source code to a standard bundled environment (`npx create-react-app` or Vite).
  2. Implement a unified state store (Redux or Context API) instead of localized prop-drilling.
  3. Move hardcoded data to a persistent database (PostgreSQL/Firebase).
- **Features mocked vs real**: Data models (`CLAIMS`, `TEAM`), file uploads/downloads, API chat latency, chart updates, and settings persistence are completely mocked in this specific iteration.

## 13. HOW TO RUN
1. **Prerequisites**: Ensure you have a modern web browser (Chrome, Edge, Firefox, Safari). No other software (Node.js, NPM) is required.
2. **Execute**: Double-click `index_test.html` on your desktop or drag-and-drop it into an open browser tab.
3. **Alternatively (for strict CORS environments)**: 
   - Open a terminal in the folder containing the file.
   - Run `python3 -m http.server 8000`
   - Visit `http://localhost:8000/index_test.html` in your browser.
4. **API Keys**: Open the file in a text editor like VS Code. Search for `const GEMINI_KEY = ` and place your real key in the quotes if you are deploying the API-connected version.
5. **Deployment**: To host, upload `index_test.html` to any basic static hosting provider like GitHub Pages, Vercel, or an AWS S3 Bucket. No build commands are necessary.
