# Technology Stack Report

This report outlines the technology stack, dependencies, runtime configuration, deployment mechanisms, and shared assets for the **ACC Bioscience Incubator (ABI) — Evaluation & Admission Portal** repository.

---

## 1. Programming Languages

* **TypeScript**: TypeScript is the primary language used across the application to provide strong static typing, maintainable contracts, and compile-time error prevention.
* **HTML5**: HTML5 defines the semantic markup and foundational document structure for the application shell in [index.html](file:///C:/Users/brian/Documents/GitHub/abi/index.html).
* **CSS3**: CSS3 provides styling, typography integration, and print-media stylesheet rules in [src/index.css](file:///C:/Users/brian/Documents/GitHub/abi/src/index.css).
* **JavaScript (ES Modules)**: Modern ECMAScript (ES2022/ESNext) serves as the runtime script target executed by web browsers and development tooling.

---

## 2. Frameworks

* **React (`v19.0.1`)**: React is the frontend framework used to build declarative, component-driven user interfaces and manage reactive state.
* **Express (`v4.21.2`)**: Express is included as the backend HTTP server framework to handle server-side capabilities and API routing in containerized hosting environments.

---

## 3. Production Dependencies and Libraries

* **`@google/genai` (`^2.4.0`)**: This library provides the official Google GenAI SDK to interact with Gemini generative AI models for evaluation workflows.
* **`@tailwindcss/vite` (`^4.3.3`)**: This Vite plugin provides seamless, high-speed integration between Tailwind CSS v4 and the Vite compilation pipeline.
* **`@vitejs/plugin-react` (`^6.1.1`)**: This plugin enables React Fast Refresh and automatic JSX transforms within Vite.
* **`lucide-react` (`^0.546.0`)**: This icon library supplies lightweight and consistent vector icons used throughout the dashboard and scorecard navigation.
* **`react` (`^19.0.1`)**: This core library provides component lifecycles, hooks, and virtual DOM algorithms for building the user interface.
* **`react-dom` (`^19.0.1`)**: This package handles rendering and DOM reconciliation for React components in the browser.
* **`vite` (`^8.3.0`)**: This modern build tool and development server provides fast Hot Module Replacement during development and compiles production bundles.
* **`express` (`^4.21.2`)**: This web server library manages HTTP endpoints and static asset serving in full-stack setups.
* **`dotenv` (`^17.2.3`)**: This package loads environment variables from local configuration files into `process.env`.
* **`motion` (`^12.23.24`)**: This library delivers smooth animations, transitions, and gesture handling for interactive UI elements.

---

## 4. Development Dependencies and Libraries

* **`@types/node` (`^22.14.0`)**: This package supplies TypeScript type definitions for Node.js runtime APIs and modules.
* **`@types/react` (`^19.3.0`)**: This package provides TypeScript type definitions for React components, hooks, and synthetic events.
* **`@types/react-dom` (`^19.3.0`)**: This package provides TypeScript type definitions for React DOM mounting methods.
* **`@types/express` (`^4.17.21`)**: This package delivers TypeScript type definitions for Express request and response handlers.
* **`autoprefixer` (`^10.4.21`)**: This PostCSS plugin parses CSS to automatically append browser-specific vendor prefixes.
* **`esbuild` (`^0.25.0`)**: This JavaScript and TypeScript bundler delivers rapid transpilation for Vite and tsx.
* **`tailwindcss` (`^4.3.3`)**: This utility-first CSS framework provides utility classes for layout, typography, and styling.
* **`tsx` (`^4.21.0`)**: This command-line utility executes TypeScript files directly in Node.js without requiring manual compilation.
* **`typescript` (`^7.0.2`)**: This compiler performs static type checking and code analysis across the project.

---

## 5. Application Execution and Deployment

* **Local Development Execution**: The application runs locally via Vite by executing `npm run dev` to serve the frontend on port 3000 bound to host `0.0.0.0`.
* **Production Build Workflow**: The build command `npm run build` compiles TypeScript and bundles minified assets into the `dist/` directory for production deployment.
* **Hosting and Cloud Deployment**: The application is configured to deploy as a containerized web service on Google Cloud Run through Google AI Studio.
* **Runtime Secret Management**: Runtime variables such as `GEMINI_API_KEY` and `APP_URL` are injected automatically into the hosting container by Google AI Studio from user secrets.
* **Client State Persistence**: Evaluation records, reviewer scores, and customized criteria persist on the client side using the browser's `localStorage`.

---

## 6. Shared Assets and Cross-Team Standards

* **Google AI Studio Applet Architecture**: The project shares an AI Studio application template and runtime environment hooks specified in [metadata.json](file:///C:/Users/brian/Documents/GitHub/abi/metadata.json) and [vite.config.ts](file:///C:/Users/brian/Documents/GitHub/abi/vite.config.ts) with sibling AI Studio applets.
* **Shared Gemini AI Infrastructure**: The app uses the shared Google GenAI API platform capability configured under `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` for artificial intelligence workflows.
* **ACC Bioscience Incubator Brand Identity**: The interface shares the official Austin Community College Bioscience Incubator brand colors (`#431A4D` purple, `#78BE20` green), typography, and institutional links.
* **Organization Design System Standard**: The repository references a shared cross-team design guideline governed by [AGENTS.md](file:///C:/Users/brian/Documents/GitHub/abi/AGENTS.md) directing teams to adhere to `docs/DESIGN-SYSTEM.md`.
