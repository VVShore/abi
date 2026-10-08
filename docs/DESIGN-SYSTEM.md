---
title: "Design System Operating Guide"
subtitle: "Interaction design patterns Γåö component architecture ┬╖ v10 (Windows, Antigravity CLI)"
date: 2026-09-27
---

<!--
Intended location: <repo>/docs/DESIGN-SYSTEM.md
The Antigravity CLI (`agy`) loads it through one line in AGENTS.md:
  Design-system work: read and follow docs/DESIGN-SYSTEM.md.
The PDF is a render of this file. Edit this file, never the PDF.
-->

# For agents

**Context.** You are working in a React + Vite app whose design system is documented in Storybook. The people you work with may be designers, UX researchers, product managers or developers, and some have never written code, so explain what you do in plain words. This guide is their shared agreement: it fixes which interaction patterns the app uses (┬º2), what counts as accessible (┬º3), what each component must guarantee (┬º4), how stories and doc pages are written (┬º5), and the order of the work (┬º6). In each session your job is to find the current step of the plan, do it with the user, and prove it is done.

**Rules.** Read this whole file before acting.

1. **Check where the project stands before proposing anything.** For each step in [┬º6.4](#steps), test its *Done when* items against the repo as it is now, and show the results as a table with evidence (command output or `file:LINE`). The first step with a failing item is the current step. Use the shell you have: on Windows that is PowerShell, so don't assume `grep`, `perl` or `find`. What this file says about the repo (for example the appendix) was measured on one date; your check wins.
2. **One step per session.** Tell the user which step is current and why. Propose a plan (files to change, how you'll prove each *Done when* item) and wait for approval before editing.
3. **One change per approval.** Name the file, the change and the reason. Run `npm run lint` after each change; stop and explain if it fails.
4. **Never run git or publish.** No `commit`, `push`, `reset`, `checkout` or branch deletion; no `npx chromatic` or any deploy unless the user says so in this session. Give the user the exact command instead. Never write a token into a tracked file.
5. **Pattern names come from ┬º2.2 only, verbatim, with the chapter shown there.** Each component's pattern is fixed in its [┬º4.1](#contracts) row; copy it, don't choose a new one. If you think the row is wrong, say so and write *unverified*. Never invent a pattern name or chapter.
6. **Check the content, not just that it exists.** A heading that exists isn't a check that passed. For every *Done when* that concerns content (a pattern, a role, a label), read the content and compare it with this file.
7. **Close with evidence.** Report *Done when* before and after, files changed, and every pattern decision with its chapter. Append the report to `docs/design-system/session-log.md`. Claim a step done only if every item in its *Done when* passes.

# For people

Sections 1ΓÇô4 are reference, in the order you'd use them: **what the user needs** (Tidwell patterns), **what "done" means** (WCAG and ARIA), and **what gets built** (component contracts and platform names). Section 5 shows how that becomes Storybook stories and doc pages. Section 6 sets up a Windows machine and runs the plan by talking to the Antigravity CLI (`agy`) inside the repo; you won't type measurement commands yourself.

# 1. Vocabularies {#vocabularies}

Three vocabularies, each for one job. Sections 2, 3 and 4 follow this order.

| # | Vocabulary | Its job | Where it fails |
|---|---|---|---|
| 2 | **Tidwell IxD patterns** (*Designing Interfaces* 3e) | **Intent**: what the user is doing and which flow or layout serves it. Every role can read it. | Doesn't specify markup. |
| 3 | **WCAG 2.2 + WAI-ARIA** | **Acceptance**: what "done" means, checkably. Legally required for US state and local government sites. | Not a design language. |
| 4 | **Component contracts / platform names** | **Output**: the thing that gets built (`Button`, `<dialog>`, `NavigationStack`). | The vocabulary AI fakes most fluently. Verify against pinned docs. |


# 2. Tidwell patterns: intent {#patterns}

> **Want to understand why interfaces work?** *Designing Interfaces* (3rd ed., Jenifer Tidwell, Charles Brewer and Aynne Valencia, O'Reilly 2020) is where these pattern names come from. In the publisher's words: "By capturing UI best practices as design patterns, this best-selling book provides solutions to common design problems." Its first chapter, *Designing for People*, describes patterns of human behavior, such as Safe Exploration and Instant Gratification, that the rest of the book builds on. Read it if you want the reasoning behind a choice. You don't need it to use this guide: the tables below and the agent carry the names for you.

## 2.1 Pattern pickers, by job

Each job lists the sibling patterns that compete for it, and the **code signal** that shows which one a codebase really has. Pick one; name the ones you rejected.

| Job | Patterns (3e chapter) | Choose when | Code signal |
|---|---|---|---|
| Show an item's detail | **Two-Panel Selector or Split View** (7) | Wide screen; comparing items; list must stay visible | List and detail rendered together |
| | **One-Window Drilldown** (7) | Small screen; rich detail; one item at a time | Screen state replaced on tap (router push, `NavigationStack`, `setScreen('detail')`) |
| | **List Inlay** (7) | Short detail; scanning many items | Expand/collapse state on the row; the list stays |
| Browse a collection | **Collections and Cards** (6) ┬╖ **Cards** ┬╖ **Thumbnail Grid** ┬╖ **Carousel** (7) ┬╖ **Grid of Equals** (4) | Visual, comparable items | Grid of repeated cards |
| Long lists | **Infinite List** (6) ┬╖ **Pagination** ┬╖ **Jump to Item** ┬╖ **Alpha/Numeric Scroller** ┬╖ **New-Item Row** (7) | Finding things inside the list is the problem | Scroll-triggered fetch, page state, index control, editable last row |
| Multi-step task | **Wizard** (2) ┬╖ **Progress Indicator** (3) | Rare or dependent steps; the user benefits from being led | Step index state; one step rendered at a time |
| Organize a screen | **Titled Sections** ┬╖ **Module Tabs** ┬╖ **Accordion** ┬╖ **Collapsible Panels** ┬╖ **Center Stage** ┬╖ **Visual Framework** (4) | Tabs only when sections are alternatives | `activeTab` state for tabs; plain headings for sections |
| Get around | **Escape Hatch** ┬╖ **Modal Panel** ┬╖ **Deep Links** ┬╖ **Breadcrumbs** ┬╖ **Clear Entry Points** (3) ┬╖ **Bottom Navigation** (6) | Escape Hatch wherever a screen has no obvious way back *to where you came from* | Back returns to the previous screen, and browser Back stays in the app |
| Act on things | **Prominent "Done" Button or Assumed Next Step** ┬╖ **Button Groups** ┬╖ **Action Panel** ┬╖ **Hover or Pop-Up Tools** (8) ┬╖ **Touch Tools** (6) | Done button only for the action that completes a task | One emphasised action per task screen |
| Feedback while working | **Spinners and Loading Indicators** ┬╖ **Cancelability** ┬╖ **Multilevel Undo** (8) ┬╖ **Loading or Progress Indicators** (6) | Show waiting; allow stopping; allow reversing | Loading state; cancel handler; undo history |
| Summaries | **Dashboard** ┬╖ **Streams and Feeds** (2) | Dashboard for status at a glance; Streams and Feeds for time-ordered entries | Grouped metrics; reverse-chronological list |
| Forms | **Good Defaults and Smart Prefills** ┬╖ **Input Hints** ┬╖ **Error Messages** ┬╖ **Forgiving Format** (10) | Reduce typing and errors | Prefilled values; inline hints and errors |

Chapter 1 entries (*Safe Exploration*, *Instant Gratification*, *Habituation*ΓÇª) are **patterns of human behavior**, not interface patterns. Cite them to explain *why* a design works, never as a component's pattern.

## 2.2 Complete list of 3e interface patterns {#pattern-list}

Verified against the publisher's table of contents ([O'Reilly](https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/)) on 2026-09-26. **The only valid pattern names.** Chapters 5, 11 and 12 contain no patterns.

- **Ch. 1 Designing for People** (behaviors): Safe Exploration ┬╖ Instant Gratification ┬╖ Satisficing ┬╖ Changes in Midstream ┬╖ Deferred Choices ┬╖ Incremental Construction ┬╖ Habituation ┬╖ Microbreaks ┬╖ Spatial Memory ┬╖ Prospective Memory ┬╖ Streamlined Repetition ┬╖ Keyboard Only ┬╖ Social Media, Social Proof, and Collaboration
- **Ch. 2 Organizing the Content**: Feature, Search, and Browse ┬╖ Mobile Direct Access ┬╖ Streams and Feeds ┬╖ Media Browser ┬╖ Dashboard ┬╖ Canvas Plus Palette ┬╖ Wizard ┬╖ Settings Editor ┬╖ Alternative Views ┬╖ Many Workspaces ┬╖ Help Systems ┬╖ Tags
- **Ch. 3 Getting Around**: Clear Entry Points ┬╖ Menu Page ┬╖ Pyramid ┬╖ Modal Panel ┬╖ Deep Links ┬╖ Escape Hatch ┬╖ Fat Menus ┬╖ Sitemap Footer ┬╖ Sign-In Tools ┬╖ Progress Indicator ┬╖ Breadcrumbs ┬╖ Annotated Scroll Bar ┬╖ Animated Transition
- **Ch. 4 Layout of Screen Elements**: Visual Framework ┬╖ Center Stage ┬╖ Grid of Equals ┬╖ Titled Sections ┬╖ Module Tabs ┬╖ Accordion ┬╖ Collapsible Panels ┬╖ Movable Panels
- **Ch. 6 Mobile Interfaces**: Vertical Stack ┬╖ Filmstrip ┬╖ Touch Tools ┬╖ Bottom Navigation ┬╖ Collections and Cards ┬╖ Infinite List ┬╖ Generous Borders ┬╖ Loading or Progress Indicators ┬╖ Richly Connected Apps
- **Ch. 7 Lists of Things**: Two-Panel Selector or Split View ┬╖ One-Window Drilldown ┬╖ List Inlay ┬╖ Cards ┬╖ Thumbnail Grid ┬╖ Carousel ┬╖ Pagination ┬╖ Jump to Item ┬╖ Alpha/Numeric Scroller ┬╖ New-Item Row
- **Ch. 8 Doing Things**: Button Groups ┬╖ Hover or Pop-Up Tools ┬╖ Action Panel ┬╖ Prominent "Done" Button or Assumed Next Step ┬╖ Smart Menu Items ┬╖ Preview ┬╖ Spinners and Loading Indicators ┬╖ Cancelability ┬╖ Multilevel Undo ┬╖ Command History ┬╖ Macros
- **Ch. 9 Showing Complex Data**: Datatips ┬╖ Data Spotlight ┬╖ Dynamic Queries ┬╖ Data Brushing ┬╖ Multi-Y Graph ┬╖ Small Multiples
- **Ch. 10 Getting Input from Users**: Forgiving Format ┬╖ Structured Format ┬╖ Fill-in-the-Blanks ┬╖ Input Hints ┬╖ Input Prompt ┬╖ Password Strength Meter ┬╖ Autocompletion ┬╖ Drop-down Chooser ┬╖ List Builder ┬╖ Good Defaults and Smart Prefills ┬╖ Error Messages

Names that are **not** Tidwell patterns, though they sound like it: *Toast*, *Snackbar*, *Inline Notification*, *Feedback & Status*, *Stat Card*, *Task Row*, *MasterΓÇôDetail*, *Bottom Sheet*, *Stepper*.

# 3. WCAG 2.2 + WAI-ARIA: acceptance {#acceptance}

## 3.1 Why this is the acceptance layer

The US Department of Justice's ADA Title II rule requires state and local government web content and mobile apps to meet **WCAG 2.1 Level AA**, with compliance dates starting in 2026 ([ada.gov](https://www.ada.gov/resources/web-guidance/); check the date that applies to your entity). This guide targets **WCAG 2.2 AA**, which includes every 2.1 AA criterion except the obsolete 4.1.1 Parsing, so meeting it covers the legal floor.

## 3.2 The five rules of ARIA use

From W3C [Using ARIA](https://www.w3.org/TR/using-aria/):

1. Use a native HTML element when one exists (`<button>`, `<dialog>`, `<meter>`), instead of adding a role.
2. Don't change native semantics (no `role="region"` on an `<article>`).
3. Every interactive ARIA control must work with the keyboard.
4. Don't put `role="presentation"` or `aria-hidden="true"` on anything focusable.
5. Every interactive element needs an accessible name.

## 3.3 How it's checked: you don't need to memorize any of this

> **Storybook checks accessibility for you.** Every story runs through the accessibility addon (`addon-a11y`, built on axe). With `test: 'error'` set in the preview (Step 1), a story with a problem fails, and the Accessibility panel names the problem and the element. The agent reads those failures and fixes them. You don't need to remember the success criteria below or check them by hand.

Two things automation can't do, and a person should, once per component before its doc page says "checked":

- **Keyboard pass:** reach and use it with Tab, Enter, Space and Esc only.
- **Screen-reader pass:** listen to it with Narrator (built into Windows) or NVDA.

Sections 3.4 and 3.5 are **reference** for anyone who wants to go deeper, for example toward accessibility auditing, and for the agent. Everyone else can skip them.

## 3.4 Success criteria this system is responsible for *(reference)*

| SC | Level | Requires | Lands in (┬º4.1) |
|---|---|---|---|
| 1.1.1 Non-text Content | A | Images have text alternatives | SpecimenCard, JournalEntryCard, IconButton |
| 1.3.1 Info and Relationships | A | Structure is in the markup (lists, headings, labels) | Cards, metric sections, forms |
| 1.4.1 Use of Color | A | Color is never the only signal | Badge, FilterPill |
| 1.4.3 Contrast (Minimum) | AA | Text 4.5:1 (3:1 large) | Tokens, every text component |
| 2.1.1 Keyboard | A | Everything works with a keyboard | Every interactive component |
| 2.2.1 Timing Adjustable | A | Time limits can be turned off or extended | Toast with an action |
| 2.4.3 Focus Order | A | Focus moves in a logical order | Modal, screens |
| 2.4.7 Focus Visible | AA | The focused element is visible | Button, IconButton, FilterPill |
| 2.4.11 Focus Not Obscured (Minimum) *(new in 2.2)* | AA | Sticky headers and bars don't hide the focused element | Header, BottomNav |
| 2.5.8 Target Size (Minimum) *(new in 2.2)* | AA | Targets at least 24 ├ù 24 CSS px | Every tap target |
| 4.1.2 Name, Role, Value | A | Custom controls expose name, role and state | IconButton, FilterPill, gauges |
| 4.1.3 Status Messages | AA | Status updates are announced without moving focus | Toast |

## 3.5 Roles and states used *(reference)*

| Need | Use | Not |
|---|---|---|
| A blocking dialog | `<dialog>` opened with `showModal()`, plus `aria-labelledby` | `role="dialog"` on a `div` |
| A polite status update | One `role="status"` region, always mounted | `aria-live` added on top (status already implies it) |
| An urgent error | `role="alert"` | `role="status"` |
| A **measurement** in a range (vigor, soil moisture) | `<meter>` or `role="meter"` + `aria-valuenow/min/max` | `progressbar` (that's task progress) |
| **Progress** toward finishing a task | `<progress>` or `role="progressbar"` | `meter` |
| A toggle | `aria-pressed` on a `<button>` | a checkbox styled as a pill |
| Where you are | `aria-current="page"` in nav, `aria-current="step"` in a wizard | `aria-valuenow` on steps |
| Grouped toggles | `role="group"` + `aria-label` | `role="radiogroup"` unless it behaves like radios |
| Tabs that swap content | `tablist` / `tab` / `tabpanel` | tabs made of plain buttons |

# 4. Component contracts / platform names: output {#output}

> **You don't have to name components from scratch.** The agent reads the repo's React components and uses these names; this table tells it what each one must guarantee. If you're a developer, learning the names pays off: they're the words you'll use in code reviews and with other teams, and ┬º4.2 gives the equivalent names on web, iOS and Android.

## 4.1 Contracts {#contracts}

Each row fixes the component's element, accessibility contract, props and pattern. Agents copy the pattern column verbatim into the doc page.

| Component | Element and accessibility | Props | When to use (pattern, ch.) | Use instead |
|---|---|---|---|---|
| **Button** | `<button type="button">`; `submit` only in forms; no `role`; focus ring; ΓëÑ 24 px | `variant` ┬╖ `size` ┬╖ `type` ┬╖ `onClick` ┬╖ `disabled` | **Prominent "Done" Button or Assumed Next Step** (8), for the one action that completes a task. Otherwise no pattern: purpose-neutral action. | A link when it navigates ┬╖ IconButton when there's no text ┬╖ **Button Groups** (8) for related actions |
| **IconButton** | `<button aria-label>`; toggles use `aria-pressed` | `icon` ┬╖ `label` ┬╖ `pressed?` ┬╖ `onClick` | **Touch Tools** (6) when it floats over content | Button when a text label fits |
| **Badge** | `<span>`; meaning in text, not only color | `tone` ┬╖ `children` | None (data display) | Button if it acts |
| **FilterPill** | `<button aria-pressed>` in `role="group"` + `aria-label` | `selected` ┬╖ `onSelect` ┬╖ `children` | **Feature, Search, and Browse** (2) | **Module Tabs** (4) when sections swap instead of narrowing a list |
| **Toast** | One `role="status"` region, always mounted; no auto-dismiss if it has an action | `message` ┬╖ `tone` ┬╖ `durationMs` ┬╖ `action?` | None. It's a status message (WCAG 4.1.3), secondary to an inline change on the item | **Modal Panel** (3) only if the user must respond; **Spinners and Loading Indicators** (8) while waiting |
| **Meter** (vigor ring, soil moisture) | `<meter>` or `role="meter"` + `aria-valuenow/min/max` + label | `value` ┬╖ `min` ┬╖ `max` ┬╖ `label` ┬╖ `shape` | None (data display) | ProgressBar for task progress |
| **ProgressBar** | `<progress>` or `role="progressbar"` + label | `value` ┬╖ `max` ┬╖ `label` | **Loading or Progress Indicators** (6) | Meter for measurements |
| **CareTaskCard** | `<li>` in a labelled list; every tap target a button or link | `task` ┬╖ `onComplete` ┬╖ `onOpenPlant` | **One-Window Drilldown** (7) to the plant | **List Inlay** (7) if the detail were short ┬╖ **Two-Panel Selector or Split View** (7) on wide screens |
| **SpecimenCard** | `<article>` in a grid; image `alt` | `plant` ┬╖ `onOpen` ┬╖ `onToggleFavorite` | **Collections and Cards** (6) in a **Grid of Equals** (4); opens by **One-Window Drilldown** (7) | **Thumbnail Grid** (7) if cards carried images only |
| **JournalEntryCard** | `<li>` in an `<ol>`; `<time datetime>` | `entry` ┬╖ `onOpenPlant?` | **Streams and Feeds** (2) | `role="feed"` only with infinite loading (**Infinite List**, 6) |
| **StreakCard / metric cards** | `<section aria-labelledby>`; values in `<dl>`; units in text | `label` ┬╖ `value` ┬╖ `target` ┬╖ `week` | **Dashboard** (2); each card a **Titled Section** (4) | ΓÇö |
| **Modal** | `<dialog>` + `showModal()`; focus returns to the opener; Esc closes | `open` ┬╖ `onClose` ┬╖ `title` ┬╖ `children` | **Modal Panel** (3); Morning Loop adds **Wizard** (2) + **Progress Indicator** (3) with `aria-current="step"` | **Titled Sections** (4) inline when the task needn't block |
| **Header / BottomNav** | `<nav aria-label>`; `aria-current="page"`; must not hide focus (2.4.11) | `current` ┬╖ `onNavigate` ┬╖ `previousScreen` | **Bottom Navigation** (6); back control = **Escape Hatch** (3) | ΓÇö |

Name variants by **role** (`primary`, `secondary`, `accent`), not hue (`terracotta`), for the same reason tokens are role-named: a rebrand shouldn't rename the API.

## 4.2 Platform names

The same job has different names on each platform. Use the right one when speaking to that platform's docs or engineers.

| Job | Web | iOS (SwiftUI / UIKit) | Android (Compose, Material 3) |
|---|---|---|---|
| Blocking overlay | `<dialog>` + `showModal()` | `.sheet` + `.presentationDetents` / `UISheetPresentationController` | `ModalBottomSheet` or `AlertDialog` |
| Short list of choices | Buttons in a dialog | `confirmationDialog` (the action sheet), **not** a bottom sheet | `DropdownMenu` |
| List ΓåÆ detail, replacing | Router push | `NavigationStack` | Navigation Compose (`NavHost`) |
| List and detail side by side | Two columns | `NavigationSplitView` | `ListDetailPaneScaffold` |
| Status message | `role="status"` region | No toast in Apple's HIG: use inline change or a banner | `Snackbar` |
| Multi-step flow | `<ol>` + `aria-current="step"` | No component (HIG's *Stepper* is a +/ΓêÆ control) | No Material 3 component |
| Primary navigation | `<nav>` + `aria-current="page"` | `TabView` | `NavigationBar` |

# 5. Story conventions {#storybook}

Check installed versions first (the agent does this). Shapes below were verified on Storybook 10.6 (CSF3).

**Hierarchy:** `Foundations/` (tokens) ┬╖ `Atoms/` ┬╖ `Molecules/` ┬╖ `Organisms/` ┬╖ `Screens/`. This adapts Frost's Atomic Design (Atoms, Molecules, Organisms, Templates, Pages): *Foundations* is an addition and *Screens* stands in for Templates + Pages. Say so on the Storybook intro page.

**`.storybook/preview.tsx`** loads the app's CSS and makes accessibility failures fail:

```tsx
import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: { a11y: { test: 'error' } },
};
export default preview;
```

Fonts loaded in `index.html` also go in `.storybook/preview-head.html`.

**Story file** (one concept per story):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: { onClick: fn(), children: 'Water' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Disabled: Story = { args: { disabled: true } };
```

**JSDoc for agents.** Above each component export, a short description plus its ┬º4.1 pattern line. Storybook puts JSDoc into the manifest its MCP server gives agents ([AI best practices](https://storybook.js.org/docs/ai/best-practices)).

**The doc page.** This is what a finished page looks like in Storybook, in the order used by production systems such as [Carbon](https://react.carbondesignsystem.com/?path=/docs/components-datatable-batch-actions--overview): show the component first, then say when to use it and what to use instead, then one section per behavior, then accessibility, props, where it lives in the app, and sources.

![Storybook docs page for Button, top half. (1) Title, one-line description and links to Source, When to use and Accessibility. (2) Live example of every variant with Show code. (3) When to use: Prominent "Done" Button or Assumed Next Step, Ch. 8, for the action that completes a task; other buttons are purpose-neutral. (4) When not to use, use instead: a link when it navigates, IconButton without text, FilterPill to narrow a list, Button Groups for related actions. (5) Getting started: import and required props.](v8-assets/storybook-docs-page-top.png)

![Storybook docs page for Button, bottom half. (6) Variants and states, each with prose and its own live example. (7) Accessibility: element, keyboard, size and contrast with WCAG numbers, and test status. (8) Props table generated from TypeScript. (9) In this app: file and line references. (10) Sources and an edit link.](v8-assets/storybook-docs-page-bottom.png)

Template with the same sections: `storybook-templates/Component.mdx`.

# 6. Plan {#plan}

## 6.1 Set up a Windows machine (once) {#windows}

Open **PowerShell** (Start ΓåÆ type *PowerShell*). No administrator rights needed.

1. **Git and Node.js.** Node must be **22.12 or newer**: this repo's Vitest 5 requires it.

    ```powershell
    winget install --id Git.Git -e
    winget install --id OpenJS.NodeJS.LTS -e
    ```

    Close and reopen PowerShell, then check: `git --version` and `node -v`.

2. **If `npm` or `npx` says "running scripts is disabled on this system"**, allow signed scripts for your user only:

    ```powershell
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
    ```

3. **The Antigravity CLI (`agy`).**

    ```powershell
    irm https://antigravity.google/cli/install.ps1 | iex
    ```

    Reopen PowerShell and check `agy --version`. The first run opens your browser to sign in.

    New to `agy`? Google's CLI docs cover it: [Installation & Auth](https://antigravity.google/docs/cli/install/) ┬╖ [Tutorial](https://antigravity.google/docs/cli/tutorial/) (five steps) ┬╖ [Using AGY CLI](https://antigravity.google/docs/cli/using/) (settings, keybindings, `/config`, `/permissions`) ┬╖ [Execution Modes](https://antigravity.google/docs/cli/modes/) ┬╖ [Prompting & Interaction](https://antigravity.google/docs/cli/prompting/) ┬╖ [Best Practices](https://antigravity.google/docs/cli/best-practices/). The left panel on any of those pages lists the rest, including each slash command.

4. **The repo.**

    ```powershell
    git clone <repo-url>
    cd <repo-folder>
    npm install
    npx playwright install chromium
    ```

    The last line downloads the browser Storybook's tests run in. Then `npm run storybook` opens it at `http://localhost:6006`.


## 6.2 Connect the agent to this file {#connect}

`agy` reads **AGENTS.md** from the repo root at start-up. Add this line to it (Step 0 does it):

```text
Design-system work: read and follow docs/DESIGN-SYSTEM.md.
```

Then, from the repo folder, start the agent with `agy`.

**Pick the mode for the job** ([Execution Modes](https://antigravity.google/docs/cli/modes/)); press `Shift+Tab` in the prompt box to switch:

| Mode | What it does | Use it for |
|---|---|---|
| `plan` (`agy --mode=plan`) | Analyzes and outlines steps before writing code | START and REVIEW |
| `default` (`agy`) | Pauses for a diff review before every file edit | BUILD and FIX: you approve each change |
| `accept-edits` | Approves file edits automatically | **Not for this guide**: it skips your review |

## 6.3 Prompting the agent {#prompting}

The rules in this file already travel with every session, so prompts stay short. What makes them work:

- **State the goal and the evidence you want**, not the commands. The agent picks commands that work on your OS.
- **Point at the section**, e.g. "step 3", "┬º4.1 Button row", so the agent uses this file's decisions instead of its own.
- **Plan before edits.** Ask for a plan and approve it.
- **One step per session.** Long sessions drift, and the v7 run showed an agent marking steps done that were half done.
- **Verify in a fresh session.** The agent that built something is the worst judge of it. A second session, told it is a reviewer, finds what the builder skipped.

Four prompts cover the whole plan:

```text
START   (plan mode) Read docs/DESIGN-SYSTEM.md. Measure the current state against every
        Done when in ┬º6.4 and show it as a table with evidence. Tell me which
        step is current and why. Don't change any file.

BUILD   (default mode) Do step N of docs/DESIGN-SYSTEM.md. First give me a plan: the files
        you'll change and how you'll prove each Done when item. Wait for my OK,
        then work one change at a time.

REVIEW  (new session, plan mode) You are reviewing, not building. Read docs/DESIGN-SYSTEM.md.
        For step N, check every Done when item yourself and report pass or
        fail with evidence. Check every pattern name in the doc pages and JSDoc
        against ┬º2.2 and the component's ┬º4.1 row. Change nothing.

FIX     (default mode) Fix the review's failures, one at a time, under the same rules.
```

## 6.4 Steps {#steps}

A step is done only when **every** item in *Done when* passes. The agent measures; you see the evidence.

| # | Goal, and why | Official docs | Done when |
|---|---|---|---|
| 0 | **Undo, green, portable.** Version history for undo; a passing type check; scripts that run on Windows; one lockfile; pinned versions; the agent pointer in AGENTS.md. *You run git.* | [Git basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) | A commit exists ┬╖ `npm run lint` passes ┬╖ every `npm run` script works in PowerShell ┬╖ one lockfile, no `latest` versions ┬╖ `.gitattributes` sets line endings ┬╖ AGENTS.md contains the pointer line |
| ΓÇö | **Storybook not installed?** React + Vite: paste Storybook's prompt *"Set up Storybook for me with npm create storybook@latest and follow its instructions precisely"* (experimental). Other stacks: `npm create storybook@latest`. Installed: skip. | [AI setup](https://storybook.js.org/docs/ai/setup) ┬╖ [Install](https://storybook.js.org/docs/get-started/install) | `npm run storybook` opens |
| 1 | **Storybook shows the real design** and fails on accessibility violations. | [Styling and CSS](https://storybook.js.org/docs/configure/styling-and-css) ┬╖ [Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing) | Preview imports the app CSS ┬╖ a11y test mode is `error` ┬╖ a Foundations/Colors story shows the real palette and fonts ┬╖ no example boilerplate stories |
| 2 | **One role-named token per color**, so a rebrand is one edit. | [Tailwind theme variables](https://tailwindcss.com/docs/theme) | Every color used in `src` maps to one token ┬╖ no utility class used but undefined |
| 3 | **Atoms built to ┬º4.1**, each with stories and a doc page in the ┬º5 order. | [Writing stories](https://storybook.js.org/docs/writing-stories) ┬╖ [Writing docs](https://storybook.js.org/docs/writing-docs) ┬╖ [AI best practices](https://storybook.js.org/docs/ai/best-practices) | Every atom in ┬º4.1 exists ┬╖ element and roles match its row (gauges are `meter`) ┬╖ each doc page's *When to use* matches its row verbatim ┬╖ 0 a11y violations in Atoms/ |
| 4 | **No hardcoded colors**, in components or in data. | [Tailwind theme variables](https://tailwindcss.com/docs/theme) | No hex color classes in `src` ┬╖ no styling fields in data types |
| 5 | **Molecules extracted once**; every tap target a button or link. | [Writing stories](https://storybook.js.org/docs/writing-stories) | No duplicated card markup across screens ┬╖ no clickable `<div>` ┬╖ each molecule's doc page matches its ┬º4.1 row ┬╖ 0 a11y violations in Molecules/ |
| 6 | **Modals and the way back.** | [MDN `<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) ┬╖ [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Every modal is a `<dialog>`: Esc closes, focus returns to the opener ┬╖ in-app Back returns to the previous screen ┬╖ **browser Back** moves within the app |
| 7 | **Screens and documentation.** Screen stories with sample data; intro page; all doc pages in the ┬º5 order. | [MDX](https://storybook.js.org/docs/writing-docs/mdx) ┬╖ [Testing](https://storybook.js.org/docs/writing-tests) | Each screen has stories ┬╖ `npm run build-storybook` passes ┬╖ a **REVIEW** session finds every pattern name in ┬º2.2 with the right chapter and matching ┬º4.1 |
| 8 | **Publish and connect design** *(optional; your go-ahead)*. Chromatic hosts a versioned Storybook per commit and runs visual tests; designers embed live stories in Figma with the Storybook Connect plugin, which requires a Chromatic-published Storybook. | [Publish with Chromatic](https://storybook.js.org/docs/sharing/publish-storybook#publish-storybook-with-chromatic) ┬╖ [Figma plugin](https://storybook.js.org/docs/sharing/design-integrations/?renderer=react#embed-storybook-in-figma-with-the-plugin) ┬╖ [chromatic CLI](https://www.npmjs.com/package/chromatic) | *You run* `npx chromatic` with `CHROMATIC_PROJECT_TOKEN` set ΓåÆ a Storybook URL ┬╖ one Figma component shows a linked story |

**Chromatic's free plan** ([pricing](https://www.chromatic.com/pricing), checked 2026-09-26): unlimited projects, users and collaborators; 5,000 snapshots a month; Chrome; visual and interaction tests; versioned hosting; Figma plugin. Not included: Safari, Firefox and Edge (Starter, $179/month), Chromatic's accessibility tests, UI Review. Accessibility stays covered locally by `addon-a11y`. Publishing puts the Storybook on a third-party host, so check what stories expose before the first publish.

# 7. Sources {#sources}

- Tidwell, Brewer & Valencia, *Designing Interfaces*, 3rd ed., O'Reilly 2020 ΓÇö table of contents: <https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/>
- W3C WCAG 2.2 ΓÇö <https://www.w3.org/TR/WCAG22/>; WAI-ARIA 1.2 (incl. `meter`) ΓÇö <https://www.w3.org/TR/wai-aria-1.2/>; Using ARIA ΓÇö <https://www.w3.org/TR/using-aria/>; APG patterns ΓÇö <https://www.w3.org/WAI/ARIA/apg/patterns/>
- US DOJ ADA Title II web guidance ΓÇö <https://www.ada.gov/resources/web-guidance/>
- MDN `<dialog>` ΓÇö <https://developer.mozilla.org/docs/Web/HTML/Element/dialog>
- Storybook docs (verified on 10.6) ΓÇö <https://storybook.js.org/docs>; AI setup ΓÇö <https://storybook.js.org/docs/ai/setup>; AI best practices ΓÇö <https://storybook.js.org/docs/ai/best-practices>; publishing ΓÇö <https://storybook.js.org/docs/sharing/publish-storybook>; design integrations ΓÇö <https://storybook.js.org/docs/sharing/design-integrations/?renderer=react>
- Carbon DataTable, reference doc page ΓÇö <https://react.carbondesignsystem.com/?path=/docs/components-datatable-batch-actions--overview>
- Chromatic CLI ΓÇö <https://www.npmjs.com/package/chromatic>; pricing ΓÇö <https://www.chromatic.com/pricing>
- Antigravity CLI ΓÇö install <https://antigravity.google/docs/cli/install/>; tutorial <https://antigravity.google/docs/cli/tutorial/>; using <https://antigravity.google/docs/cli/using/>; execution modes <https://antigravity.google/docs/cli/modes/>; prompting <https://antigravity.google/docs/cli/prompting/>; best practices <https://antigravity.google/docs/cli/best-practices/>; context files (AGENTS.md) <https://antigravity.google/docs/cli/gcli-migration/>
- Tailwind CSS theme variables (verified on 4.3) ΓÇö <https://tailwindcss.com/docs/theme>
- Frost, *Atomic Design*, Ch. 2 ΓÇö <https://atomicdesign.bradfrost.com/chapter-2/>

# Appendix: FloraFolio status {#florafolio}

Measured on 2026-09-26 after the v7 run (commit `8f22768`). **Agents: re-measure before relying on this.**

**What the v7 run achieved:** type check passes ┬╖ Storybook loads the app CSS with a11y in `error` mode ┬╖ 0 hardcoded hex classes (from 452) ┬╖ 0 clickable `<div>`s ┬╖ all four modals use `<dialog>` ┬╖ in-app Back returns to the previous screen (`Header.tsx:59-60`) ┬╖ 7 atoms and 4 molecules in `src/components/ui/`, each with stories and a doc page ┬╖ screen stories for all five screens.

**Still open, by step:**

| Step | Finding | Where |
|---|---|---|
| 0 | `clean` script uses `rm -rf`, which fails on Windows | `package.json` scripts |
| 0 | Only `bun.lock`; `vitest`, `playwright`, `@chromatic-com/storybook` pinned to `latest` | repo root, `package.json` |
| 0 | No AGENTS.md pointer; no `.gitattributes` | repo root |
| 3 | Doc pages cite patterns that are wrong or don't exist: Button "Ch. 4" and applied to every variant; Toast "Inline Notification / Feedback, Ch. 7"; CareTaskCard "Two-Panel Selector", although the code is One-Window Drilldown | `Button.mdx:15`, `Toast.mdx:15`, `CareTaskCard.mdx:15` |
| 3 | Vigor ring and soil-moisture bar are `progressbar`; they are measurements, so `meter` | `RingGauge.tsx:42`, `ProgressBar.tsx:44`, used at `PlantDetailScreen.tsx:112`, `:180` |
| 3 | Button variant `terracotta` is a hue name | `ui/Button.tsx:4` |
| 4 | `tagColor?: string` still declared on `JournalEntry` | `types.ts:27` |
| 6 | Browser Back leaves the app (no history handling) | `App.tsx` |
| 8 | Not started | ΓÇö |

Next session: **REVIEW** for step 3, then **BUILD** step 0 (Windows portability).
