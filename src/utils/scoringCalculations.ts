import { MeetingRecord, ReviewerScoreRecord, RatingValue } from '../types';

export interface CategoryAverageResult {
  average: number;
  badgeText?: 'Highest' | 'Flagged Risk';
  badgeType?: 'highest' | 'risk';
}

export interface ReviewerPillData {
  reviewerId: string;
  name: string;
  score: number;
  isLow?: boolean;
  isHigh?: boolean;
}

export interface IndividualLowScoreConcern {
  id: string;
  criterionId: string;
  criterionTitle: string;
  category: 'team' | 'market' | 'fit' | 'risk';
  categoryLabel: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  score: number;
  noteOrComment: string;
}

/**
 * Filter reviewers belonging to the meeting who have explicitly submitted their scorecard.
 */
export const getSubmittedReviewers = (meeting?: MeetingRecord): ReviewerScoreRecord[] => {
  if (!meeting || !Array.isArray(meeting.reviewers)) {
    return [];
  }
  return meeting.reviewers.filter((r) => Boolean(r.isSubmitted));
};

/**
 * Calculate the category average for a specific reviewer across all questions in that category.
 */
export const computeReviewerCategoryAverage = (
  reviewer: ReviewerScoreRecord,
  category: 'team' | 'market' | 'fit' | 'risk'
): number => {
  if (reviewer.categoryRatings?.[category] !== undefined && reviewer.categoryRatings[category] > 0) {
    return Number(reviewer.categoryRatings[category].toFixed(1));
  }

  const categoryScores = Object.entries(reviewer.scores || {})
    .filter(([key, val]) => key.startsWith(`${category}_`) && typeof val === 'number')
    .map(([, val]) => val as RatingValue);

  if (categoryScores.length === 0) {
    return 0;
  }

  const sum = categoryScores.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / categoryScores.length).toFixed(1));
};

/**
 * Calculate arithmetic committee score averages across submitted reviewers.
 */
export const calculateCommitteeCategoryAverages = (
  submittedReviewers: ReviewerScoreRecord[]
): {
  team: CategoryAverageResult;
  market: CategoryAverageResult;
  fit: CategoryAverageResult;
  risk: CategoryAverageResult;
  overall: number;
  totalSubmitted: number;
} => {
  const count = submittedReviewers.length;
  if (count === 0) {
    return {
      team: { average: 0 },
      market: { average: 0 },
      fit: { average: 0 },
      risk: { average: 0 },
      overall: 0,
      totalSubmitted: 0,
    };
  }

  const calcCategory = (cat: 'team' | 'market' | 'fit' | 'risk') => {
    const scores = submittedReviewers.map((r) => computeReviewerCategoryAverage(r, cat));
    const sum = scores.reduce((acc, s) => acc + s, 0);
    return Number((sum / count).toFixed(1));
  };

  const teamAvg = calcCategory('team');
  const marketAvg = calcCategory('market');
  const fitAvg = calcCategory('fit');
  const riskAvg = calcCategory('risk');

  const averages = [
    { cat: 'team' as const, val: teamAvg },
    { cat: 'market' as const, val: marketAvg },
    { cat: 'fit' as const, val: fitAvg },
    { cat: 'risk' as const, val: riskAvg },
  ];

  // Highest calculation (threshold >= 3.8)
  const maxVal = Math.max(...averages.map((a) => a.val));
  const highestCat = maxVal >= 3.8 ? averages.find((a) => a.val === maxVal)?.cat : undefined;

  const toResult = (cat: 'team' | 'market' | 'fit' | 'risk', val: number): CategoryAverageResult => {
    // Flagged Risk: if average < 3.0 or category is risk with low scores
    if (val > 0 && val < 3.0) {
      return { average: val, badgeText: 'Flagged Risk', badgeType: 'risk' };
    }
    if (cat === highestCat) {
      return { average: val, badgeText: 'Highest', badgeType: 'highest' };
    }
    return { average: val };
  };

  const overall = Number(((teamAvg + marketAvg + fitAvg + riskAvg) / 4).toFixed(1));

  return {
    team: toResult('team', teamAvg),
    market: toResult('market', marketAvg),
    fit: toResult('fit', fitAvg),
    risk: toResult('risk', riskAvg),
    overall,
    totalSubmitted: count,
  };
};

/**
 * Format a reviewer's full name as first name and last initial (e.g., "Richard S.").
 * Strips common honorific prefixes while leaving full names intact elsewhere.
 */
export const formatReviewerFirstAndLastInitial = (fullName: string): string => {
  const cleaned = fullName
    .trim()
    .replace(/^(?:dr|prof|mr|mrs|ms|mx)\.?\s+/i, '')
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return fullName.trim();
  }
  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
};

/**
 * Extract evaluator pill distributions for a specific category across submitted reviewers.
 */
export const extractEvaluatorPills = (
  submittedReviewers: ReviewerScoreRecord[],
  category: 'team' | 'market' | 'fit' | 'risk'
): ReviewerPillData[] => {
  return submittedReviewers.map((r) => {
    const score = computeReviewerCategoryAverage(r, category);
    const shortName = formatReviewerFirstAndLastInitial(r.name);
    return {
      reviewerId: r.id,
      name: shortName,
      score,
      isLow: score > 0 && score <= 2.5,
      isHigh: score >= 4.5,
    };
  });
};

/**
 * Derive low-score concerns directly from individual submitted ratings of 1 or 2,
 * satisfying Implementation Correction 6.
 */
export const deriveIndividualLowScoreConcerns = (
  submittedReviewers: ReviewerScoreRecord[]
): IndividualLowScoreConcern[] => {
  const concerns: IndividualLowScoreConcern[] = [];

  const categoryLabels: Record<string, string> = {
    team: 'Team Competency',
    market: 'Value Proposition & Commercial',
    fit: 'ABI Facility Fit',
    risk: 'Risk & Execution',
  };

  submittedReviewers.forEach((rev) => {
    // 1. Check detailed criteria scores
    Object.entries(rev.scores || {}).forEach(([criterionKey, score]) => {
      if (typeof score === 'number' && (score === 1 || score === 2)) {
        const cat = criterionKey.split('_')[0] as 'team' | 'market' | 'fit' | 'risk';
        const rawNote = rev.notes?.[criterionKey] || rev.sectionComments?.[cat] || '';
        const titleFormatted = criterionKey
          .replace(/^[a-z]+_/, '')
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());

        concerns.push({
          id: `${rev.id}_${criterionKey}`,
          criterionId: criterionKey,
          criterionTitle: titleFormatted,
          category: cat || 'risk',
          categoryLabel: categoryLabels[cat] || 'Risk & Governance',
          reviewerId: rev.id,
          reviewerName: rev.name,
          reviewerRole: rev.role || rev.title || 'Committee Reviewer',
          score,
          noteOrComment:
            rawNote ||
            `Reviewer flagged ${titleFormatted} with an evaluation score of ${score} out of 5.`,
        });
      }
    });

    // 2. Check category ratings if any is <= 2
    Object.entries(rev.categoryRatings || {}).forEach(([catKey, catScore]) => {
      if (typeof catScore === 'number' && catScore > 0 && catScore <= 2) {
        const cat = catKey as 'team' | 'market' | 'fit' | 'risk';
        const sectionComment = rev.sectionComments?.[cat] || '';
        const exists = concerns.some((c) => c.reviewerId === rev.id && c.category === cat);
        if (!exists && sectionComment) {
          concerns.push({
            id: `${rev.id}_cat_${cat}`,
            criterionId: `cat_${cat}`,
            criterionTitle: `${cat.toUpperCase()} Overall Rating`,
            category: cat,
            categoryLabel: categoryLabels[cat] || 'Risk & Governance',
            reviewerId: rev.id,
            reviewerName: rev.name,
            reviewerRole: rev.role || rev.title || 'Committee Reviewer',
            score: catScore,
            noteOrComment: sectionComment,
          });
        }
      }
    });
  });

  return concerns;
};
