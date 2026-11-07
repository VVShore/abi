# ACC Bioscience Incubator — Evaluation & Admission Portal

Applicant review scorecard, committee insights dashboard, and founder pitch feedback summary report for the ACC Bioscience Incubator (ABI).

* **Design System Guide:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)
* **Tech Stack Overview:** [STACK.md](STACK.md)

---

## Overview

### What this is

The ABI Evaluation & Admission Portal is a web application for ABI staff and steering committee workflows at Austin Community College. It brings applicant evaluation scorecards, committee consensus metrics, and standardized founder feedback reports into one place, reducing manual work across separate spreadsheets, forms, and documents. It is being built by the GAPS internship team.

This branch (`sandbox-salazar`) is a **local demonstration and testing build**. It is designed to run on a local computer using browser-only persistence and a local demo backend service with live AI disabled.

### What it does today

* **Three core evaluation views (header tabs):**
  * **Individual Scorecard:** Each committee member rates the selected company and meeting across 4 core categories (**Team**, **Value Proposition**, **ABI Fit**, and **Risk**) on a 1–5 scale, records section comments, saves drafts, submits their final scorecard, or unlocks a submitted scorecard to revise and re-submit.
  * **Committee Insights:** Aggregates **submitted** reviewer scorecards for the active meeting into **Category Averages & Reviewer Spread Distribution** cards, expandable consensus themes (**What Reviewers Noticed**), automatically flagged low-score gaps (**Areas to Address** derived from individual ratings of 1 or 2), and topic-filtered remarks (**Reviewer Comments by Topic**).
  * **Feedback Summary:** Renders a meeting-specific, editable 5-section report formatted 1:1 after Nancy Lyon’s standardized **ACC Bioscience Incubator — Member Company Pitch Feedback Summary** template (**OVERALL FEEDBACK**, **TEAM**, **VALUE PROPOSITION**, **ABI FIT**, and **RISK**), with on-screen draft editing, deterministic demo draft generation, quote verification badges, an interactive **Preview PDF** modal, and **Export PDF** / print support.
* **Companies:** Switch between applicant companies, add a new company, or edit its basic profile metadata (company name, technology domain, review date, review round, incubation status, and threshold score).
* **Meetings & meeting-specific editable reports:** Each company has an *Initial Pitch* and any number of dated *Progress Check-ins*. Each meeting stores its own independent reviewer scorecards and its own editable **Feedback Summary** draft. Switching meetings switches both the scorecard calculations and the saved report content, and an overwrite confirmation dialog protects unsaved or custom report edits before generating a new demo draft.
* **Submitted-only calculations:** **Committee Insights** and **Feedback Summary** calculations (category averages, evaluator spread pills, steering committee member lists, low-score concerns for ratings of 1 or 2, and extracted quotes) include **submitted scorecards only** (`isSubmitted: true`). Unsubmitted draft scorecards are excluded until submitted, and a warning banner is displayed if a meeting has zero submitted scorecards.
* **Quote verification:** Reviewer quotes displayed in **Committee Insights** and the **Feedback Summary** editor are checked against the active meeting’s submitted scorecards and tagged with provenance badges:
  * **Source Verified** — quote text and reviewer attribution match a submitted scorecard verbatim.
  * **User Edited** — quote was manually edited or added in the report editor.
  * **Unverified Reference** — quote text or reviewer attribution does not match a submitted scorecard in the active meeting.
* **Application import (`.xlsx`):** Load applicant records from an Excel workbook (`Form Responses 1`). The app previews parsed rows, flags possible duplicates, and asks for confirmation before creating new companies or filling blank fields on existing ones.

### How it works

* **Browser-only persistence (`localStorage`):** All data you enter, edit, or import (companies, meetings, reviewer scorecards, submission status, and edited Feedback Summary reports) is saved only in your local web browser on this computer, scoped to the exact site address (`http://127.0.0.1:3000`). There is **no shared database** and **no real user authentication or sign-in**—the **Reviewer** selector in the header simply switches the active evaluator perspective locally for demonstration and testing. Other testers cannot see your browser’s data, and you cannot see theirs.
* **Two-process local demo architecture:** For full local demo operation, you run two PowerShell windows:
  1. **Local backend server** (`npm.cmd run server` on `http://127.0.0.1:3001`) with `LIVE_AI_ENABLED=false`.
  2. **Website / Vite frontend** (`npm.cmd run dev` on `http://127.0.0.1:3000`), which proxies `/api` requests to `http://127.0.0.1:3001`.
* **Live Gemini is implemented, disabled, and not live-tested:** The local Express backend (`server/index.ts`, `server/geminiService.ts`) contains a gated Gemini synthesis endpoint (`POST /api/ai/synthesize-draft`) restricted to an allowlisted server-side synthetic fixture (`FIXTURE_SYNTHETIC_SOLARIS_2026`). However, **live Gemini calls are disabled by default (`LIVE_AI_ENABLED=false`) and have not been live-tested**. Demo mode requires **no Gemini API key** and uses **synthetic data only** via `POST /api/ai/demo-draft` (with a built-in deterministic in-browser fallback).
* **Preloaded sample records:** The app starts with four preloaded company profiles:
  * **Solaris Biotherapeutics** (`FIXTURE_SYNTHETIC_SOLARIS_2026`) — a confirmed synthetic fixture with both an *Initial Pitch* and a *Q2 Progress Check-in* created specifically to test meeting-specific reports, submitted-only calculations, quote verification, and deterministic demo draft generation.
  * **Vayim**, **BioNanox Diagnostics**, and **Austin Cell Therapeutics** — preloaded sample records included in the repository. Do not label or treat existing sample records as fictional unless their provenance is confirmed.
* Built with React 19, TypeScript, Vite, Tailwind CSS, Express, Vitest, and Storybook. See [STACK.md](STACK.md) for details.

### Local Demo vs. Static Cloudflare Preview

| Environment | What runs | How Demo Draft Generation & Persistence Work |
|---|---|---|
| **Local Demo Operation** (`http://127.0.0.1:3000` + `http://127.0.0.1:3001`) | Both the Vite frontend (`npm.cmd run dev`) and the local Express backend (`npm.cmd run server` with `LIVE_AI_ENABLED=false`) run on your machine in two PowerShell windows. | Vite proxies `/api/health` and `/api/ai/demo-draft` to the local backend on `127.0.0.1:3001`. All state persists in your local browser’s `localStorage`. |
| **Static Cloudflare Preview** (Static `dist/` deployment) | Serves only the compiled static frontend bundle. **Does not include or run the local Node/Express backend (`server/index.ts`).** | Backend `/api/*` endpoints are not present on a static preview host. Clicking **Generate Demo Draft** automatically falls back to the built-in client-side deterministic synthetic draft generator, and all edits still persist only in each visitor’s own browser `localStorage` (never shared across users). |

### Finding your way around

Maximize your browser window so the full header and navigation bar show clearly.

| Where | What it's for |
|---|---|
| Header tabs: **Individual Scorecard**, **Committee Insights**, **Feedback Summary** | Switch between the three main evaluation and reporting screens |
| **Import (.xlsx)** | Import applicant rows from a local Excel workbook |
| **Applicant** | Choose a company, add a new one, or edit its basic profile metadata |
| **Meeting** | Choose the *Initial Pitch* or a dated *Progress Check-in*, or add a new check-in |
| **Reviewer** | Choose which committee member perspective you are scoring as, or add a reviewer (local switcher; no authentication) |

---

## Running Locally on Windows

You need a Windows 10 or 11 computer, an internet connection for initial setup, and Chrome or Edge. Initial setup takes about 10–15 minutes the first time.

All commands below go into **PowerShell**. To open it, press the Windows key, type `PowerShell`, and press Enter. Copy each command, paste it into PowerShell with `Ctrl+V`, and press Enter. Using `npm.cmd` avoids PowerShell script execution policy issues when invoking npm.

### 1. Install the prerequisites (once per computer)

```powershell
# Allow PowerShell scripts to run for your user account if needed (answer Y if asked)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Node.js LTS (version 22.12 or newer is required) and Git
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

If Windows says `winget` is not recognized, install the two programs from their websites instead, keeping the default options: Node.js LTS from https://nodejs.org and Git from https://git-scm.com/download/win.

**Close PowerShell and open a new window** so it finds the newly installed programs. Then check:

```powershell
node -v        # must show v22.12.0 or newer
git --version
```

### 2. Download the `sandbox-salazar` branch (once)

This clones the `sandbox-salazar` branch into a folder called `abi` inside your `Documents` folder:

```powershell
cd $HOME\Documents
git clone --branch sandbox-salazar https://github.com/VVShore/abi.git
cd abi
```

*(If you already cloned the repository previously, switch to the branch with `git fetch origin` and `git checkout sandbox-salazar`.)*

### 3. Install the app's dependencies (once, and after each update)

```powershell
npm.cmd ci
```

This takes a minute or two. Warnings are normal; it is only a problem if it ends with a red `ERR!`. **No Gemini API key (`GEMINI_API_KEY`) or `.env` file is required for demo mode.**

### 4. Start the app (Two PowerShell Windows)

Full local demo mode uses **two separate PowerShell windows**—one for the local backend server (`127.0.0.1:3001`) with live AI explicitly disabled, and one for the Vite website (`127.0.0.1:3000`).

#### PowerShell Window 1 — Local Backend Server (Live AI Disabled)

Open your first PowerShell window and run:

```powershell
cd $HOME\Documents\abi
$env:LIVE_AI_ENABLED="false"
npm.cmd run server
```

Wait until PowerShell shows:
* `[AI Backend] Server listening at http://127.0.0.1:3001`
* `[AI Backend] Live AI calls: DISABLED (default)`

Keep this first PowerShell window open.

#### PowerShell Window 2 — Website (Vite Frontend)

Open a **second** PowerShell window and run:

```powershell
cd $HOME\Documents\abi
npm.cmd run dev
```

When the second PowerShell window shows `Local: http://127.0.0.1:3000/`, open **http://127.0.0.1:3000** in Chrome or Edge.

Keep both PowerShell windows open while you use the app. When you are finished, click each window and press `Ctrl+C` to stop both servers. Both servers bind strictly to `127.0.0.1` (localhost only) and do not accept connections from other computers on the network.

### Next time

You do not need to repeat steps 1–3. Open **two PowerShell windows**:

* **Window 1 (Backend):**
  ```powershell
  cd $HOME\Documents\abi
  $env:LIVE_AI_ENABLED="false"
  npm.cmd run server
  ```
* **Window 2 (Website):**
  ```powershell
  cd $HOME\Documents\abi
  npm.cmd run dev
  ```

### Getting the latest version on `sandbox-salazar`

When there is an update on `sandbox-salazar`, stop both PowerShell windows (`Ctrl+C`), then run:

```powershell
cd $HOME\Documents\abi
git checkout sandbox-salazar
git pull origin sandbox-salazar
npm.cmd ci
```

Then restart the backend window (`$env:LIVE_AI_ENABLED="false"; npm.cmd run server`) and website window (`npm.cmd run dev`).

### Commands for developers: testing, linting, and builds

```powershell
npm.cmd run lint             # Type-checks the code (tsc --noEmit); no output means it passed
npm.cmd test                 # Runs the Vitest unit & server test suite (vitest run --project unit)
npm.cmd run test:unit        # Alias for the unit & server test suite (src/**/*.test.ts(x), server/**/*.test.ts)
npm.cmd run test:storybook   # Runs headless Playwright tests for Storybook stories
npm.cmd run build            # Creates the production static frontend bundle in dist\
npm.cmd run preview          # Serves the static dist\ build at http://127.0.0.1:4173 (frontend only)
```

| Command | What it does |
|---|---|
| `npm.cmd run server` | Starts the local Express backend at `http://127.0.0.1:3001` (`tsx server/index.ts`) |
| `npm.cmd run dev` | Starts the Vite frontend dev server at `http://127.0.0.1:3000` (proxies `/api` to `127.0.0.1:3001`) |
| `npm.cmd test` / `npm.cmd run test:unit` | Runs Vitest unit and server tests (`vitest run --project unit`) |
| `npm.cmd run test:storybook` | Runs Storybook component tests in headless Chromium via Playwright |
| `npm.cmd run storybook` | Starts the interactive Storybook component explorer on port `6006` |
| `npm.cmd run build-storybook` | Builds static Storybook documentation |
| `npm.cmd run lint` | Type-checks the project (`tsc --noEmit`) |
| `npm.cmd run build` | Creates the production frontend build in `dist/` |
| `npm.cmd run preview` | Serves the static production build at `http://127.0.0.1:4173` (without the local Express backend) |
| `npm.cmd run clean` | Deletes `dist/` and `server.js` |

### Troubleshooting

| What you see | What to do |
|---|---|
| "running scripts is disabled on this system" | Use `npm.cmd` instead of `npm`, or run the `Set-ExecutionPolicy` command from step 1 |
| "node" or "git" is not recognized | Close PowerShell, open a new window, and try again. If it still fails, repeat step 1 |
| `npm.cmd ci` mentions an unsupported engine or Node version | Update Node.js (`winget upgrade OpenJS.NodeJS.LTS`), open a new PowerShell window, and try again |
| Port `3000` or `3001` is already in use | Stop any previous PowerShell windows running `npm.cmd run dev` or `npm.cmd run server` (`Ctrl+C`) |
| Your saved data seems to have disappeared | Verify you opened the exact same address (`http://127.0.0.1:3000`). `127.0.0.1:3000`, `localhost:3000`, and a Cloudflare preview URL each have completely separate browser storage |
| The page is blank or broken | Press `F12`, open the **Console** tab, and share any red error messages with the team |

### Notes on data, AI safety, and confidentiality

* **Where data lives:** Saved data belongs to the exact browser and address you open (`http://127.0.0.1:3000`). Clearing your browser's site data erases it. There is no cloud database or cross-user syncing.
* **Synthetic data only:** Always test with synthetic/invented test data. Never test with real confidential applicant workbooks, real founder personal data, or real executed contracts, and never attach real data to issues, chats, or screenshots.
* **Sample record provenance:** **Solaris Biotherapeutics** (`FIXTURE_SYNTHETIC_SOLARIS_2026`) is a confirmed synthetic test fixture created specifically for this branch. The other preloaded sample records (**Vayim**, **BioNanox Diagnostics**, **Austin Cell Therapeutics**) are existing repository sample records; do not label existing sample records as fictional unless their provenance is confirmed.
* **Live AI status:** Live Gemini synthesis code exists in `server/geminiService.ts` behind `LIVE_AI_ENABLED=true` and strict fixture allowlisting (`FIXTURE_SYNTHETIC_SOLARIS_2026`), but **must remain disabled (`LIVE_AI_ENABLED=false`)** for demo operation and has not been live-tested. No Gemini API key is needed.
* **Application workbook (`.xlsx`):** When using **Import (.xlsx)** in the header, the file is parsed inside your browser and stored only in `localStorage`. Do not copy real workbooks into the project folder or commit `.xlsx` files to Git (spreadsheet files are ignored by `.gitignore`).

---

## Testing the `sandbox-salazar` Branch

Follow **Running Locally on Windows** above with both PowerShell windows running (`$env:LIVE_AI_ENABLED="false"; npm.cmd run server` and `npm.cmd run dev`), then open **http://127.0.0.1:3000**.

> **Use synthetic data only.** Never test with real applicant spreadsheets, real contacts, or real contracts.

### Make a synthetic test workbook

In Excel, create a new workbook with a sheet named `Form Responses 1`. Put these headers in row 1 and add a few rows of synthetic answers:

| Timestamp | Email Address | Company Name | Primary Contact Name | Phone Number | Describe your technology | Funding raised to date |
|---|---|---|---|---|---|---|
| 3/2/2026 9:15 | test@example.com | Test Company One | Test Person | 555-0100 | Synthetic test description | $0 |

To exercise duplicate handling, repeat one company name in two rows, and add a row with the company name `BioNanox Diagnostics` (an existing sample company). Save it as `.xlsx` **outside** the project folder.

### What to check

| Area | Steps | Expected |
|---|---|---|
| **Three current tabs** | Click **Individual Scorecard**, **Committee Insights**, and **Feedback Summary** in the header. | Each view renders for the currently selected Applicant and Meeting. |
| **Submitted-only calculations** | Select **BioNanox Diagnostics** (where reviewers start in *Draft* status) and open **Committee Insights** and **Feedback Summary**. Then return to **Individual Scorecard**, complete and submit one reviewer's scorecard, and re-check. | When 0 scorecards are submitted, **Committee Insights** shows the *No Submitted Scorecards for This Meeting* warning and `0.0` averages, and **Feedback Summary** lists no submitted steering committee members. Once a reviewer submits, calculations and rosters update using only submitted scorecards. |
| **Low-score gap detection & quote verification** | Select **Solaris Biotherapeutics** (`Initial Pitch`) and open **Committee Insights**. Expand a theme in **What Reviewers Noticed** and a category in **Areas to Address**. | Quotes matching submitted scorecards display a **Source Verified** badge. **Areas to Address** lists only concerns derived from individual submitted ratings of `1` or `2`. |
| **Meeting-specific editable reports & Nancy's template** | Open **Feedback Summary** for **Solaris Biotherapeutics** (`Initial Pitch`). Verify Nancy’s 5-section report layout (**OVERALL FEEDBACK**, **TEAM**, **VALUE PROPOSITION**, **ABI FIT**, **RISK**). Click **Edit Draft**, change a summary or quote, and click **Save Draft**. Switch **Meeting** to `Q2 Progress Check-in` and back. | Edited quotes are tagged **User Edited**. Each meeting keeps its own distinct report content. **Preview PDF** and **Export PDF** reflect the saved edits for the active meeting. |
| **Demo draft generation & overwrite guard** | In **Feedback Summary**, after editing a meeting’s draft, click **Generate Demo Draft**. | A confirmation modal (*Replace Existing Draft?*) warns before overwriting custom edits. Confirming generates a deterministic synthetic draft for that specific meeting without requiring a Gemini API key. |
| **Persistence** | Refresh the browser (`F5`). | Meetings, submitted/draft scorecards, and per-meeting Feedback Summary edits remain persisted in `localStorage`. |
| **Application import (`.xlsx`)** | Click **Import (.xlsx)**, select your synthetic test workbook, review duplicate flags, and click **Confirm & Import**. | Found, Ready, Possible Duplicates, and Skipped counts appear; imported companies open with clean initial scorecards; choosing **Update Existing** fills only blank fields without overwriting existing data. |

### Remaining Limitations & Unfinished Items

The following items are either intentionally constrained in this branch or not built yet:

* **Browser-only persistence (`localStorage`):** There is no shared backend database, multi-user synchronization, or server-side storage. Data lives only in the browser profile on the machine and origin (`127.0.0.1:3000` vs. `localhost:3000` vs. static preview URL) where it was entered.
* **No real user authentication:** There is no login, role-based access control, or session management. Switching reviewers in the header is a local perspective switcher for single-machine testing.
* **Live Gemini AI is disabled and not live-tested:** Although `server/geminiService.ts` implements gated Gemini synthesis (`POST /api/ai/synthesize-draft`) for the allowlisted synthetic fixture (`FIXTURE_SYNTHETIC_SOLARIS_2026`), live AI is disabled (`LIVE_AI_ENABLED=false`), has not been live-tested, and rejects arbitrary user/browser payloads.
* **Static Cloudflare preview has no backend server:** A static Cloudflare preview deploys only the frontend `dist/` bundle and does not run `npm.cmd run server` (`server/index.ts`).
* **Company Details section not built yet:** There is no dedicated UI view/editor for detailed company contacts, payment terms, contract dates, rooms, benches, instruments, or special conditions (only basic company metadata is editable in the company modal).
* **Company overview for original application answers not built yet:** Imported `.xlsx` intake fields are stored on the company object in browser storage, but there is no UI screen to view the full original application answers yet.
* **Uploading contracts and amendments not built yet:** There is no UI workflow to upload, view, or manage contract PDFs and amendments.
* **Meeting-specific uploaded pitch decks not built yet:** The **Preview Pitch Deck (PDF)** modal currently displays a built-in multi-slide preview template rather than uploading or rendering separate PDF slide decks per meeting.

### Reset or report

* **Start over:** In your browser, clear the site data for `127.0.0.1` (Chrome or Edge: click the icon left of the address bar, then *Site settings*, then *Delete data*).
* **Reporting a problem:** Include the steps, what you expected, what happened, and a screenshot made with synthetic test data only. Press `F12` and copy any red errors from the **Console** tab.
