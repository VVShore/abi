import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface SwatchProps {
  name: string;
  role: string;
  tokenClass: string;
  hex: string;
}

const ColorSwatch: React.FC<SwatchProps> = ({ name, role, tokenClass, hex }) => (
  <div className="flex flex-col rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-surface">
    <div
      className={`h-20 w-full ${tokenClass}`}
      role="img"
      aria-label={`${name} color preview: ${hex}`}
    />
    <div className="p-3 bg-surface">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm text-text-main">{name}</h3>
        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-text-body border border-slate-200">
          {hex}
        </span>
      </div>
      <p className="text-xs text-text-muted mt-1">{role}</p>
    </div>
  </div>
);

const ColorsAndTypographyDoc: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-surface text-text-main">
      {/* Header & Provenance Banner */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white mb-3">
          ABI Prototype Palette
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Foundations: ABI Prototype Palette &amp; Typography
        </h1>
        <p className="text-text-body mt-2 max-w-2xl text-base">
          Role-named design tokens and typography scales utilized across the ACC Bioscience Incubator (ABI) Evaluation &amp; Admission Portal prototype.
        </p>

        {/* Provenance Notice */}
        <div className="mt-4 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-base">info</span>
            Provenance Notice: Unverified Institutional Brand Identity
          </p>
          <p className="mt-1 text-xs text-amber-800">
            Colors in this prototype reflect existing UI implementation values and have not yet been verified against official Austin Community College (ACC) institutional brand guidelines.
          </p>
        </div>
      </div>

      {/* Prototype Brand Colors */}
      <section aria-labelledby="brand-colors-title" className="space-y-4">
        <h2 id="brand-colors-title" className="text-xl font-bold text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Prototype Brand Colors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ColorSwatch
            name="Primary Purple"
            role="--color-primary (headers, major buttons, active badges)"
            tokenClass="bg-primary"
            hex="#431A4D"
          />
          <ColorSwatch
            name="Accent Lime Green"
            role="--color-accent (recommendation highlights, admission banners)"
            tokenClass="bg-accent"
            hex="#78BE20"
          />
          <ColorSwatch
            name="Modal Header Purple"
            role="--color-modal-header (Workspace & Email modal headers)"
            tokenClass="bg-modal-header"
            hex="#4D1979"
          />
        </div>
      </section>

      {/* Surfaces & Canvas */}
      <section aria-labelledby="surfaces-title" className="space-y-4">
        <h2 id="surfaces-title" className="text-xl font-bold text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Surfaces &amp; Canvas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch
            name="Canvas Main"
            role="--color-canvas (main viewport background)"
            tokenClass="bg-canvas"
            hex="#F8FAFD"
          />
          <ColorSwatch
            name="Canvas Subtle"
            role="--color-canvas-subtle (secondary app layout)"
            tokenClass="bg-canvas-subtle"
            hex="#F8FAFC"
          />
          <ColorSwatch
            name="Surface Card"
            role="--color-surface (white cards & panels)"
            tokenClass="bg-surface"
            hex="#FFFFFF"
          />
          <ColorSwatch
            name="Surface Muted"
            role="--color-surface-muted (slate-50 card wells)"
            tokenClass="bg-surface-muted"
            hex="#F1F5F9"
          />
        </div>
      </section>

      {/* Semantic / Status */}
      <section aria-labelledby="semantic-title" className="space-y-4">
        <h2 id="semantic-title" className="text-xl font-bold text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Evaluation Status &amp; Semantics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch
            name="Status Success"
            role="--color-status-success (high scorecard rating)"
            tokenClass="bg-status-success"
            hex="#10B981"
          />
          <ColorSwatch
            name="Status Warning"
            role="--color-status-warning (conditional evaluation)"
            tokenClass="bg-status-warning"
            hex="#F59E0B"
          />
          <ColorSwatch
            name="Status Danger"
            role="--color-status-danger (critical / rejection)"
            tokenClass="bg-status-danger"
            hex="#EF4444"
          />
          <ColorSwatch
            name="Status Info"
            role="--color-status-info (metric indicator)"
            tokenClass="bg-status-info"
            hex="#2563EB"
          />
        </div>
      </section>

      {/* Accessibility Disclosures & Defect Flagging */}
      <section aria-labelledby="accessibility-audit-title" className="space-y-4 pt-6 border-t border-slate-200">
        <h2 id="accessibility-audit-title" className="text-xl font-bold text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Accessibility &amp; Contrast Limitations (WCAG 2.2 AA)
        </h2>
        
        <div className="p-5 rounded-2xl border border-rose-300 bg-rose-50 text-rose-950 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
            <span className="material-symbols-outlined text-rose-700 text-lg">warning</span>
            Active Palette Contrast Limitation: Accent Lime Green (#78BE20)
          </div>
          <p className="text-xs text-rose-900 leading-relaxed">
            <strong>Scope Disclaimer:</strong> Passing automated Storybook axe checks on this doc page confirms only that isolated swatch labels inside high-contrast containers meet WCAG criteria. <strong>It does not mean the entire prototype palette is accessible.</strong>
          </p>
          <div className="text-xs text-rose-900 space-y-1">
            <p><strong>Flagged Defect:</strong> The accent lime green (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-950">#78BE20</code>) has a contrast ratio of only <strong>2.18:1</strong> against white (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-950">#FFFFFF</code>) or canvas (<code className="font-mono bg-rose-100 px-1 py-0.5 rounded text-rose-950">#F8FAFD</code>), failing the WCAG 2.2 AA minimum threshold of <strong>4.5:1</strong> for normal text and 3.0:1 for graphical UI elements.</p>
            <p className="mt-2 font-semibold">Flagged Prototype Elements Requiring Separate Accessibility Fix:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>Text badges &amp; icons in <code className="font-mono">PitchFeedbackReportView.tsx</code> using <code className="font-mono">text-[#78BE20]</code> on white/canvas</li>
              <li>Navigation indicator text and borders in <code className="font-mono">Header.tsx</code></li>
              <li>Recommendation text highlights in <code className="font-mono">PitchDeckModal.tsx</code></li>
              <li>Status pills lacking darkened accessible text (<code className="font-mono">--color-status-success-dark: #008A2E</code>)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Typography System */}
      <section aria-labelledby="typography-title" className="space-y-6 pt-6 border-t border-slate-200">
        <h2 id="typography-title" className="text-xl font-bold text-text-main font-['Plus_Jakarta_Sans',sans-serif]">
          Typography System
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-surface-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Heading Font — Plus Jakarta Sans
            </span>
            <div className="font-['Plus_Jakarta_Sans',sans-serif] space-y-2">
              <h3 className="text-2xl font-bold text-text-main">
                Evaluation Committee Consensus Summary
              </h3>
              <p className="text-sm text-slate-700">
                Used for executive page titles, scorecard section headings, and applicant names.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-surface-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Body &amp; Interface Font — Inter
            </span>
            <div className="font-['Inter',sans-serif] space-y-2">
              <p className="text-base text-text-body">
                The ACC Bioscience Incubator provides wet laboratory space, specialized equipment, and research facilities for emerging biotechnology ventures.
              </p>
              <p className="text-xs text-slate-700">
                Standard weight: 400 (Regular), 500 (Medium), 600 (Semi-bold).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-surface-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Iconography — Material Symbols Outlined
            </span>
            <div className="flex items-center gap-6 text-text-main">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="p-1 rounded bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">biotech</span>
                </span>
                <span>Biotech Lab</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="p-1 rounded bg-primary text-accent flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">verified</span>
                </span>
                <span>Admitted</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="p-1 rounded bg-slate-200 text-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">assessment</span>
                </span>
                <span>Scorecard</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof ColorsAndTypographyDoc> = {
  title: 'Foundations/Colors',
  component: ColorsAndTypographyDoc,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'error',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
