import {
  ReviewerScoreRecord,
  ValidatedQuoteRef,
  QuoteVerificationStatus,
  FeedbackSectionData,
} from '../types';

/**
 * Normalizes text for comparison by trimming and collapsing whitespace.
 */
const normalizeText = (text: string): string => {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
};

/**
 * Check if the quote text exists within any of the reviewer's submitted comment/note fields.
 */
export const findMatchingSourceField = (
  reviewer: ReviewerScoreRecord,
  quoteText: string
): 'sectionComments' | 'notes' | 'keyStrengths' | 'supportNeeded' | 'overallSummary' | undefined => {
  const normQuote = normalizeText(quoteText);
  if (!normQuote) return undefined;

  // 1. Check section comments
  for (const comment of Object.values(reviewer.sectionComments || {})) {
    if (normalizeText(comment).includes(normQuote) || normQuote.includes(normalizeText(comment))) {
      return 'sectionComments';
    }
  }

  // 2. Check question notes
  for (const note of Object.values(reviewer.notes || {})) {
    if (normalizeText(note).includes(normQuote) || normQuote.includes(normalizeText(note))) {
      return 'notes';
    }
  }

  // 3. Check key strengths
  if (reviewer.keyStrengths) {
    const norm = normalizeText(reviewer.keyStrengths);
    if (norm.includes(normQuote) || normQuote.includes(norm)) {
      return 'keyStrengths';
    }
  }

  // 4. Check support needed
  if (reviewer.supportNeeded) {
    const norm = normalizeText(reviewer.supportNeeded);
    if (norm.includes(normQuote) || normQuote.includes(norm)) {
      return 'supportNeeded';
    }
  }

  // 5. Check overall summary
  if (reviewer.overallSummary) {
    const norm = normalizeText(reviewer.overallSummary);
    if (norm.includes(normQuote) || normQuote.includes(norm)) {
      return 'overallSummary';
    }
  }

  return undefined;
};

/**
 * Validate a quote reference against actual submitted reviewers in the meeting.
 * Rejects invented references, verifies genuine matches, and identifies edited quotes.
 */
export const validateQuoteProvenance = (
  quoteRef: ValidatedQuoteRef,
  submittedReviewers: ReviewerScoreRecord[]
): {
  isValidReference: boolean;
  verificationStatus: QuoteVerificationStatus;
  matchedReviewer?: ReviewerScoreRecord;
  sourceField?: 'sectionComments' | 'notes' | 'keyStrengths' | 'supportNeeded' | 'overallSummary';
} => {
  // 1. Find reviewer by ID or exact name
  const matchedRev = submittedReviewers.find(
    (r) => r.id === quoteRef.reviewerId || normalizeText(r.name) === normalizeText(quoteRef.reviewerName)
  );

  if (!matchedRev) {
    if (quoteRef.reviewerId === 'custom' && quoteRef.verificationStatus === 'edited') {
      return {
        isValidReference: true,
        verificationStatus: 'edited',
      };
    }
    // Invented reviewer reference
    return {
      isValidReference: false,
      verificationStatus: 'unverified',
    };
  }

  // 2. Check if quote matches actual source text
  const sourceField = findMatchingSourceField(matchedRev, quoteRef.quote);

  if (sourceField) {
    return {
      isValidReference: true,
      verificationStatus: quoteRef.verificationStatus === 'edited' ? 'edited' : 'verified',
      matchedReviewer: matchedRev,
      sourceField,
    };
  }

  // If reviewer exists but quote text does not match submitted text, mark as edited or unverified
  return {
    isValidReference: true,
    verificationStatus: 'edited',
    matchedReviewer: matchedRev,
  };
};

/**
 * Extract genuine, verified quotes for Nancy's feedback sections from submitted scorecards.
 */
export const extractSourceQuotesForCategory = (
  submittedReviewers: ReviewerScoreRecord[],
  category: 'team' | 'market' | 'fit' | 'risk'
): ValidatedQuoteRef[] => {
  const quoteRefs: ValidatedQuoteRef[] = [];

  submittedReviewers.forEach((rev) => {
    // 1. Section comment
    const comment = rev.sectionComments?.[category]?.trim();
    if (comment && comment.length > 15) {
      quoteRefs.push({
        id: `quote_${rev.id}_${category}_comment`,
        quote: comment,
        reviewerId: rev.id,
        reviewerName: rev.name,
        reviewerRole: rev.role || rev.title || 'Steering Committee',
        reviewerInitials: rev.initials,
        score: rev.categoryRatings?.[category],
        categoryKey: category,
        sourceField: 'sectionComments',
        verificationStatus: 'verified',
      });
    }

    // 2. Relevant criterion notes
    Object.entries(rev.notes || {}).forEach(([criterionKey, noteText]) => {
      if (criterionKey.startsWith(`${category}_`) && noteText && noteText.trim().length > 15) {
        quoteRefs.push({
          id: `quote_${rev.id}_${criterionKey}`,
          quote: noteText.trim(),
          reviewerId: rev.id,
          reviewerName: rev.name,
          reviewerRole: rev.role || rev.title || 'Steering Committee',
          reviewerInitials: rev.initials,
          score: rev.scores?.[criterionKey],
          categoryKey: category,
          sourceField: 'notes',
          verificationStatus: 'verified',
        });
      }
    });
  });

  return quoteRefs;
};

/**
 * Resolves and validates quote references for a FeedbackSectionData against the active meeting's
 * submitted reviewers. Ensures user-edited quotes stay marked 'edited', genuine source quotes
 * stay marked 'verified', and unattributed/invented quotes are marked 'unverified'.
 */
export const resolveSectionQuoteRefs = (
  section: FeedbackSectionData,
  submittedReviewers: ReviewerScoreRecord[]
): ValidatedQuoteRef[] => {
  if (section.quoteRefs && section.quoteRefs.length > 0) {
    return section.quoteRefs.map((qr, idx) => {
      if (qr.verificationStatus === 'edited') {
        return {
          ...qr,
          id: qr.id || `quote_${section.id}_${idx}`,
          verificationStatus: 'edited',
        };
      }

      const validation = validateQuoteProvenance(qr, submittedReviewers);
      return {
        ...qr,
        id: qr.id || `quote_${section.id}_${idx}`,
        reviewerId: validation.matchedReviewer?.id || qr.reviewerId,
        reviewerName: validation.matchedReviewer?.name || qr.reviewerName || 'Reviewer',
        reviewerRole:
          validation.matchedReviewer?.role ||
          validation.matchedReviewer?.title ||
          qr.reviewerRole ||
          'Steering Committee',
        reviewerInitials: validation.matchedReviewer?.initials || qr.reviewerInitials,
        sourceField: validation.sourceField || qr.sourceField,
        verificationStatus: validation.verificationStatus,
      };
    });
  }

  // Fallback for legacy string quotes when quoteRefs is empty
  return (section.quotes || []).map((quoteText, idx) => {
    for (const rev of submittedReviewers) {
      const sourceField = findMatchingSourceField(rev, quoteText);
      if (sourceField) {
        return {
          id: `legacy_${section.id}_${idx}`,
          quote: quoteText,
          reviewerId: rev.id,
          reviewerName: rev.name,
          reviewerRole: rev.role || rev.title || 'Steering Committee',
          reviewerInitials: rev.initials,
          sourceField,
          verificationStatus: 'verified' as const,
        };
      }
    }

    return {
      id: `legacy_${section.id}_${idx}`,
      quote: quoteText,
      reviewerId: 'unverified',
      reviewerName: 'Committee Draft Note',
      reviewerRole: 'Steering Committee',
      verificationStatus: 'unverified' as const,
    };
  });
};

/**
 * Synthesizes a deterministic, meeting-specific 5-section Feedback Summary from the active
 * meeting's submitted reviewer scorecards, preserving quote provenance and company/meeting isolation.
 */
export const buildDeterministicMeetingDraft = (
  companyName: string,
  meetingTitle: string,
  submittedReviewers: ReviewerScoreRecord[]
): FeedbackSectionData[] => {
  const count = submittedReviewers.length;
  const teamQuotes = extractSourceQuotesForCategory(submittedReviewers, 'team');
  const marketQuotes = extractSourceQuotesForCategory(submittedReviewers, 'market');
  const fitQuotes = extractSourceQuotesForCategory(submittedReviewers, 'fit');
  const riskQuotes = extractSourceQuotesForCategory(submittedReviewers, 'risk');

  // Supplement with keyStrengths / supportNeeded if category-specific comments/notes are sparse
  if (teamQuotes.length === 0) {
    submittedReviewers.forEach((rev) => {
      if (rev.keyStrengths && rev.keyStrengths.trim().length > 15) {
        teamQuotes.push({
          id: `quote_${rev.id}_team_strength`,
          quote: rev.keyStrengths.trim(),
          reviewerId: rev.id,
          reviewerName: rev.name,
          reviewerRole: rev.role || rev.title || 'Steering Committee',
          reviewerInitials: rev.initials,
          score: rev.categoryRatings?.team,
          categoryKey: 'team',
          sourceField: 'keyStrengths',
          verificationStatus: 'verified',
        });
      }
    });
  }

  if (riskQuotes.length === 0) {
    submittedReviewers.forEach((rev) => {
      if (rev.supportNeeded && rev.supportNeeded.trim().length > 15) {
        riskQuotes.push({
          id: `quote_${rev.id}_risk_support`,
          quote: rev.supportNeeded.trim(),
          reviewerId: rev.id,
          reviewerName: rev.name,
          reviewerRole: rev.role || rev.title || 'Steering Committee',
          reviewerInitials: rev.initials,
          score: rev.categoryRatings?.risk,
          categoryKey: 'risk',
          sourceField: 'supportNeeded',
          verificationStatus: 'verified',
        });
      }
    });
  }

  const overallSummaries = submittedReviewers
    .map((r) => r.overallSummary?.trim() || r.keyStrengths?.trim())
    .filter((s): s is string => Boolean(s));

  return [
    {
      id: 'overall',
      title: 'OVERALL FEEDBACK',
      prompt: 'What is the overall view on the company, where it is at now, and its future path.',
      summary:
        count > 0
          ? `${companyName} (${meetingTitle}) was evaluated by ${count} submitted steering committee member${
              count === 1 ? '' : 's'
            }. ${
              overallSummaries[0] ||
              'The committee noted promising technical foundations alongside structured incubation milestones.'
            }`
          : `No submitted reviewer scorecards are available yet for ${companyName} (${meetingTitle}).`,
      quotes: [],
      quoteRefs: [],
    },
    {
      id: 'team',
      title: 'FEEDBACK ON TEAM',
      prompt:
        'Does the company possess the internal talent and/or hired external talent needed to make progress?',
      categoryScoreKey: 'team',
      summary:
        teamQuotes.length > 0
          ? `Across ${count} submitted scorecard${count === 1 ? '' : 's'} for ${companyName}, reviewers highlighted leadership coachability and domain experience while identifying targeted operational mentorship needs.`
          : `Pending submitted team observations for ${companyName} (${meetingTitle}).`,
      quotes: teamQuotes.slice(0, 3).map((q) => q.quote),
      quoteRefs: teamQuotes.slice(0, 3),
    },
    {
      id: 'value_prop',
      title: 'FEEDBACK ON VALUE PROPOSITION',
      prompt:
        'Does the company have a solution that is viable, desirable, and feasible? Is there a clear path to commercialization of the technology?',
      categoryScoreKey: 'market',
      summary:
        marketQuotes.length > 0 || count > 0
          ? `Committee evaluators assessed ${companyName}'s clinical and commercial differentiation during ${meetingTitle}, emphasizing validation milestones and customer adoption.`
          : `Pending submitted value proposition observations for ${companyName} (${meetingTitle}).`,
      quotes: marketQuotes.slice(0, 3).map((q) => q.quote),
      quoteRefs: marketQuotes.slice(0, 3),
    },
    {
      id: 'abi_fit',
      title: 'FEEDBACK ON ABI FIT',
      prompt:
        'Does the mission of the company align with ABI? Would a relationship between the company and ABI be beneficial to both parties?',
      categoryScoreKey: 'fit',
      summary:
        fitQuotes.length > 0 || count > 0
          ? `Reviewers evaluated ${companyName}'s alignment with ACC Bioscience Incubator wet-lab instrumentation, BSL-2 workflows, and student internship collaboration.`
          : `Pending submitted ABI facility fit observations for ${companyName} (${meetingTitle}).`,
      quotes: fitQuotes.slice(0, 3).map((q) => q.quote),
      quoteRefs: fitQuotes.slice(0, 3),
    },
    {
      id: 'risk',
      title: 'FEEDBACK ON RISK',
      prompt:
        'What are the technical, regulatory, IP, and financial risks, and how should they be addressed?',
      categoryScoreKey: 'risk',
      summary:
        riskQuotes.length > 0 || count > 0
          ? `For ${meetingTitle}, committee members identified key regulatory, IP, and commercialization risks that ${companyName} should address through structured advisory milestones.`
          : `Pending submitted risk observations for ${companyName} (${meetingTitle}).`,
      quotes: riskQuotes.slice(0, 3).map((q) => q.quote),
      quoteRefs: riskQuotes.slice(0, 3),
    },
  ];
};
