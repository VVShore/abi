# ACC Bioscience Incubator — Evaluation & Admission Portal

Applicant review scorecard, committee consensus scoreboard, and founder pitch feedback report for the ACC Bioscience Incubator (ABI).

* **Design System Guide:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)
* **Tech Stack Overview:** [STACK.md](STACK.md)

---

## Overview

### What this is

The ABI Evaluation & Admission Portal is a web app for ABI staff at Austin Community College. It brings the information about each applicant or resident company into one place, so staff don't have to search across separate spreadsheets, forms and documents. It is being built by the GAPS internship team.

This branch (`mvp/local-company-view`) is the **minimum viable product (MVP)**. It is meant to run on one computer for demonstrations and testing.

### What it does today

* **Companies:** switch between applicant companies, add a company, or edit its basic information.
* **Meetings:** each company has an *Initial Pitch* and any number of dated *Progress Check-ins*. Each meeting keeps its own reviewer scorecards.
* **Reviewer scorecards:** each committee member rates a company on Team, Value Proposition, ABI Fit and Risk, and adds comments.
* **Committee views:** *Committee Summary* combines all reviewers' scores into a scoreboard. *Committee Highlights and Key Takeaways* shows the feedback report layout, currently with sample content.
* **Application import:** load applicant records from the ABI Form to Lead Responses Excel workbook. The app shows a preview, flags possible duplicates, and asks for confirmation before importing.

### How it works

* **Runs only on your computer.** There is no server, no database and no sign-in. Nothing you enter or import is uploaded.
* **Data is saved in your web browser** on this computer. It is still there after you close and reopen the browser. Other testers don't see your data, and you don't see theirs.
* **It starts with three made-up demo companies** (Vayim, BioNanox Diagnostics, Austin Cell Therapeutics), so there is something to look at right away.
* Built with React, TypeScript, Vite and Tailwind CSS. See [STACK.md](STACK.md) for details.

### Finding your way around

Maximize your browser window so the full header shows.

| Where | What it's for |
|---|---|
| Tabs in the header: **Individual Scorecard**, **Committee Highlights and Key Takeaways**, **Committee Summary** | Switch between the three main screens |
| **Import (.xlsx)** | Import applications from an Excel workbook |
| **Applicant** | Choose a company, add a new one, or edit its information |
| **Meeting** | Choose the Initial Pitch or a Progress Check-in, or add a new check-in |
| **Reviewer** | Choose which committee member you are scoring as, or add a reviewer |

---

## Running Locally on Windows

You need a Windows 10 or 11 computer, an internet connection for the setup, and Chrome or Edge. Setup takes about 10–15 minutes the first time.

All commands below go into **PowerShell**. To open it, press the Windows key, type `PowerShell` and press Enter. Copy each command, paste it into PowerShell with `Ctrl+V`, and press Enter.

### 1. Install the prerequisites (once per computer)

```powershell
# Allow npm's PowerShell scripts to run for your user account (answer Y if asked)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Node.js LTS (version 22.12 or newer is required) and Git
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

If Windows says `winget` is not recognized, install the two programs from their websites instead, keeping the default options: Node.js LTS from https://nodejs.org and Git from https://git-scm.com/download/win.

**Close PowerShell and open a new window**, so it finds the new programs. Then check:

```powershell
node -v   # must show v22.12.0 or newer
git --version
```

### 2. Download the code (once)

This puts the project in a folder called `abi` inside your Documents folder:

```powershell
cd $HOME\Documents
git clone --branch mvp/local-company-view https://github.com/VVShore/abi.git
cd abi
```

### 3. Install the app's dependencies (once, and after each update)

```powershell
npm ci
```

This takes a minute or two. Warnings are normal. It is only a problem if it ends with a red `ERR!`. No environment variables or `.env` file are needed.

### 4. Start the app

```powershell
npm run dev
```

When PowerShell shows a `Local: http://127.0.0.1:3000/` line, open **http://127.0.0.1:3000** in Chrome or Edge.

Keep this PowerShell window open while you use the app. When you're done, click the window and press `Ctrl+C` to stop it. The app only accepts connections from this computer (`127.0.0.1`), not from the rest of the network.

### Next time

You don't need to repeat steps 1–3. Open PowerShell and run:

```powershell
cd $HOME\Documents\abi
npm run dev
```

### Getting the latest version

When the team says there's an update, stop the app (`Ctrl+C`), then run:

```powershell
cd $HOME\Documents\abi
git pull
npm ci
npm run dev
```

### For developers: checks and production build

Testers can skip this section.

```powershell
npm run lint      # type-checks the code; no output means it passed
npm run build     # creates the optimized app in the dist\ folder
npm run preview   # serves dist\ at http://127.0.0.1:4173
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server at http://127.0.0.1:3000 |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Serves the production build at http://127.0.0.1:4173 |
| `npm run lint` | Type-checks the project (`tsc --noEmit`) |
| `npm run clean` | Deletes the `dist/` folder |

### Troubleshooting

| What you see | What to do |
|---|---|
| "running scripts is disabled on this system" | Run the `Set-ExecutionPolicy` command from step 1, then try again |
| "node" or "git" is not recognized | Close PowerShell, open a new window and try again. If it still fails, repeat step 1 |
| `npm ci` mentions an unsupported engine or Node version | Update Node.js (`winget upgrade OpenJS.NodeJS.LTS`), open a new PowerShell window and try again |
| PowerShell shows a different port, such as `3001` | Port 3000 is being used by another program. Use the address PowerShell shows. Your saved data belongs to the address, so stick to one |
| Your data seems to have disappeared | Check you opened the same address as before: `127.0.0.1:3000` and `localhost:3000` keep separate data |
| The page is blank or broken | Press F12, open the **Console** tab and send the red error messages to the team |

### Notes on data and confidentiality

* **Where data lives:** Saved data belongs to the exact address you open. `http://127.0.0.1:3000`, `http://localhost:3000` and `http://127.0.0.1:4173` each have separate data. Use the same address every time. Clearing your browser's site data erases it.
* **Application workbook:** Choose the ABI Form to Lead Responses `.xlsx` file from your computer using **Import (.xlsx)** in the header. The file is read inside the browser and is not uploaded anywhere. Do not copy the workbook into the project folder or commit it to Git. Spreadsheet files are already excluded in `.gitignore`.
* **Internet use:** The app does not send your data anywhere. It loads its fonts and icons from Google Fonts, so text and icons display best with an internet connection.

---

## Testing the MVP

Follow **Running Locally on Windows** above, then open http://127.0.0.1:3000. The app starts with three demo companies (Vayim, BioNanox Diagnostics, Austin Cell Therapeutics). They are made-up examples.

> **Use made-up data only.** Never test with the real ABI Form to Lead Responses workbook, real company names, contacts or contracts. Never attach real data to an issue, chat or email.

### Make a test workbook

In Excel, create a new workbook with a sheet named `Form Responses 1`. Put these headers in row 1 and add a few rows of invented answers:

| Timestamp | Email Address | Company Name | Primary Contact Name | Phone Number | Describe your technology | Funding raised to date |
|---|---|---|---|---|---|---|
| 3/2/2026 9:15 | test@example.com | Test Company One | Test Person | 555-0100 | Invented description | $0 |

To exercise duplicate handling, repeat one company name in two rows, and add a row with the company name `BioNanox Diagnostics` (a demo company). Save it as `.xlsx` **outside** the project folder.

### What to check

| Area | Steps | Expected |
|---|---|---|
| Meetings | Click **Meeting** in the header, then **+ Add Progress Check-in**. Enter a date and save. Add a second one. | Both appear under the company's Initial Pitch. The new check-in shows *0 of 4 sections complete*. |
| Separate scorecards | Rate a section and type a comment in one check-in. Switch to the other check-in and to the Initial Pitch. | Each meeting shows only its own ratings and comments. |
| Persistence | Refresh the page (F5). | Meetings, ratings and comments are still there. |
| Company separation | Switch companies with the **Applicant** selector. | Each company lists only its own meetings. |
| Import preview | Click **Import (.xlsx)** and choose your test workbook. | Found, Ready, Possible Duplicates and Skipped counts are shown. The repeated name and `BioNanox Diagnostics` are flagged and not pre-selected. A row without a company name is skipped. |
| Import | Click **Confirm & Import**. | A summary of new, updated and skipped records appears. Each imported company opens with a blank scorecard. |
| Update without overwriting | Import again and set `BioNanox Diagnostics` to **Update Existing**. | BioNanox's existing answers, contacts and scorecards are unchanged. Only blank fields are filled. |

### Not built yet

These planned MVP items are not in this version, so there is nothing to test yet:

* Company Details section (contacts, payment terms, contract dates, rooms, benches, instruments, special conditions).
* Company overview that shows the original application answers.
* Uploading contracts and amendments.
* Committee feedback summary, pitch deck and Highlights report specific to each meeting. These screens currently show the same content for every meeting, and edits to the summary are not saved.

### Reset or report

* **Start over:** In your browser, clear the site data for `127.0.0.1` (Chrome or Edge: click the icon left of the address, then *Site settings*, then *Delete data*).
* **Reporting a problem:** Include the steps, what you expected, what happened and a screenshot made with test data. Press F12 and copy any red errors from the **Console** tab.
