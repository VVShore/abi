import React, { useState, useEffect } from 'react';
import { useEvaluation } from '../context/EvaluationContext';
import { X, Building2, Calendar, Tag, Layers, CheckCircle2, Trash2 } from 'lucide-react';
import { AbiLogo } from './AbiLogo';

interface CompanyModalProps {
  mode?: 'edit' | 'create';
}

export const CompanyModal: React.FC<CompanyModalProps> = ({ mode = 'edit' }) => {
  const {
    company,
    companies,
    updateCompany,
    addNewCompany,
    deleteCompany,
    isCompanyModalOpen,
    setIsCompanyModalOpen,
  } = useEvaluation();

  const [isCreating, setIsCreating] = useState(mode === 'create');
  const [formData, setFormData] = useState({
    name: company.name,
    domain: company.domain,
    cohort: company.cohort,
    round: company.round,
    reviewDate: company.reviewDate,
    admissionStatus: company.admissionStatus,
    thresholdScore: company.thresholdScore,
  });

  useEffect(() => {
    if (isCompanyModalOpen) {
      if (mode === 'create') {
        setIsCreating(true);
        setFormData({
          name: '',
          domain: 'Therapeutics / Diagnostics / Devices',
          cohort: 'Cohort 2026.1 Assessment',
          round: 'Round 1 Evaluation',
          reviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          admissionStatus: 'Pending',
          thresholdScore: 3.5,
        });
      } else {
        setIsCreating(false);
        setFormData({
          name: company.name,
          domain: company.domain,
          cohort: company.cohort,
          round: company.round,
          reviewDate: company.reviewDate,
          admissionStatus: company.admissionStatus,
          thresholdScore: company.thresholdScore,
        });
      }
    }
  }, [isCompanyModalOpen, company, mode]);

  if (!isCompanyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isCreating) {
      addNewCompany({
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        cohort: formData.cohort.trim(),
        round: formData.round.trim(),
        reviewDate: formData.reviewDate.trim(),
        admissionStatus: formData.admissionStatus as 'Approved' | 'Pending' | 'Declined',
        thresholdScore: Number(formData.thresholdScore) || 3.5,
      });
    } else {
      updateCompany({
        name: formData.name.trim(),
        domain: formData.domain.trim(),
        cohort: formData.cohort.trim(),
        round: formData.round.trim(),
        reviewDate: formData.reviewDate.trim(),
        admissionStatus: formData.admissionStatus as 'Approved' | 'Pending' | 'Declined',
        thresholdScore: Number(formData.thresholdScore) || 3.5,
      });
    }
    setIsCompanyModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove the evaluation profile for "${company.name}"?`)) {
      deleteCompany(company.id);
      setIsCompanyModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AbiLogo size={28} />
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">
                {isCreating ? 'Add New Applicant Company' : 'Edit Company Information'}
              </h2>
              <p className="text-xs text-slate-500">
                {isCreating
                  ? 'Set up a fresh scorecard evaluation for a new applicant'
                  : `Update metadata and evaluation criteria for ${company.name}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCompanyModalOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mode Switch Tabs inside modal */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setFormData({
                  name: company.name,
                  domain: company.domain,
                  cohort: company.cohort,
                  round: company.round,
                  reviewDate: company.reviewDate,
                  admissionStatus: company.admissionStatus,
                  thresholdScore: company.thresholdScore,
                });
              }}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                !isCreating ? 'bg-white shadow-2xs text-[#431A4D] font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit Current ({company.name})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(true);
                setFormData({
                  name: '',
                  domain: 'Therapeutics / Diagnostics / Devices',
                  cohort: 'Cohort 2026.1 Assessment',
                  round: 'Round 1 Evaluation',
                  reviewDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  admissionStatus: 'Pending',
                  thresholdScore: 3.5,
                });
              }}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                isCreating ? 'bg-white shadow-2xs text-[#431A4D] font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Create New Company
            </button>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vayim, BioNanox, Austin Gene Lab"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Domain / Technology Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Domain / Technology Focus
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="e.g. ENT Biofilm Therapeutics, Microfluidics, Genomics"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Review Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pitch Review Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  placeholder="e.g. Jan 23, 2026"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Evaluation Round */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Review Round
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formData.round}
                  onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                  placeholder="e.g. Round 1 Evaluation"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Admission Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Incubation Status
              </label>
              <select
                value={formData.admissionStatus}
                onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white text-slate-800 font-medium"
              >
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved for Admission</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            {/* Threshold Score */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Threshold Score (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.thresholdScore}
                onChange={(e) => setFormData({ ...formData, thresholdScore: parseFloat(e.target.value) || 3.5 })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20] bg-white text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            {!isCreating && companies.length > 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete this company evaluation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Company</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCompanyModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#431A4D] hover:bg-[#34143D] text-white rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#78BE20]" />
                <span>{isCreating ? 'Create Scorecard' : 'Save Details'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
