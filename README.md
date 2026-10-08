

# ACC Bioscience Incubator — Evaluation & Admission Portal

Applicant review scorecard, committee consensus scoreboard, and founder pitch feedback report for the ACC Bioscience Incubator (ABI).

* **View in AI Studio:** [AI Studio Applet](https://ai.studio/apps/cf753c77-44d8-4b3f-979e-2ec8c61709cf)
* **Design System Guide:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)
* **Tech Stack Overview:** [STACK.md](STACK.md)

---

## Getting Started on Windows

Follow these step-by-step instructions to set up and run this prototype and Storybook on a fresh Windows machine.

### 1. Prerequisites Installation

Open PowerShell and install the required tools:

#### a. Configure PowerShell Execution Policy
Allow running locally installed npm scripts and PowerShell tools:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### b. Install Node.js (22.12+)
Install Node.js LTS via Windows Package Manager (`winget`):
```powershell
winget install OpenJS.NodeJS.LTS
```
> Verify Node.js is version 22.12 or higher:
> ```powershell
> node -v
> npm -v
> ```

#### c. Install Git
Install Git for Windows:
```powershell
winget install Git.Git
```
> Verify Git installation:
> ```powershell
> git --version
> ```

---

### 2. Repository Setup & Environment Configuration

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/VVShore/abi.git
   cd abi
   ```

2. **Configure environment variables:**
   Copy the example environment file:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   Open `.env.local` and specify your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

---

### 3. Install Dependencies

Install project packages and the Playwright Chromium browser for component and accessibility testing:

1. **Install npm dependencies:**
   ```powershell
   npm install
   ```

2. **Install Playwright Chromium browser:**
   ```powershell
   npx playwright install chromium
   ```

---

### 4. Running the Applications Locally

#### a. Run the Web Prototype
Start the local Vite development server:
```powershell
npm run dev
```
Open your browser to: **[http://localhost:3000](http://localhost:3000)**

#### b. Run Storybook
Launch the Storybook component explorer and design system workshop:
```powershell
npm run storybook
```
Open your browser to: **[http://localhost:6006](http://localhost:6006)**

---

### 5. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on port 3000 (`0.0.0.0`) |
| `npm run storybook` | Starts Storybook component workshop on port 6006 |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm run build-storybook` | Compiles static Storybook documentation bundle |
| `npm run lint` | Runs TypeScript type-checking across the project (`tsc --noEmit`) |
| `npm run clean` | Cleans build artifacts (`dist/`, `server.js`) using cross-platform Node cleanup |
| `npm run preview` | Locally previews the production build output |
