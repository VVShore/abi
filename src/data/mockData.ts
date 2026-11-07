import {
  QuestionCriterion,
  ReviewerScoreRecord,
  KeyPriority,
  EvaluationTopic,
  CompanyAssessment,
  FeedbackSectionData,
  OrganizationContactDetails,
  ApplicationIntakeInfo,
  OrganizationContractDetails,
  ContractDocument,
  MeetingRecord,
} from '../types';

export const QUESTIONS_DATA: QuestionCriterion[] = [
  // Section 1: Team
  {
    id: 'team_coachability',
    category: 'team',
    categoryTitle:
      'Team: If given the opportunity to mentor or work with this company, I definitely would.',
    categoryShortTitle: 'Team',
    criteriaName: 'Coachability',
    prompt: 'Are they open to feedback & mentoring?',
    title: 'Coachability',
    description: 'Are they open to feedback & mentoring?',
    notesHeader: 'Team Notes',
    questionNumber: 1,
    pitchNote:
      'yes. Phil has communicated very openly his need for training/education in the microbiology part of this company. During the pitch, the founders were very receptive to committee advice.',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'edit_note',
  },
  {
    id: 'team_qualifications',
    category: 'team',
    categoryTitle:
      'Team: If given the opportunity to mentor or work with this company, I definitely would.',
    categoryShortTitle: 'Team',
    criteriaName: 'Qualifications/Experience',
    prompt: "Do I think they're qualified to succeed?",
    title: 'Qualifications/Experience',
    description: "Do I think they're qualified to succeed?",
    notesHeader: 'Team Notes',
    questionNumber: 2,
    pitchNote:
      'Yes; they have significantly more business experience than the typical ABI member company. They have already met with key players (FDA meeting, hired a regulatory consultant, etc)',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'verified',
  },
  {
    id: 'team_skillset',
    category: 'team',
    categoryTitle:
      'Team: If given the opportunity to mentor or work with this company, I definitely would.',
    categoryShortTitle: 'Team',
    criteriaName: 'Team Skillset Diversity & Advisors',
    prompt: 'How much help does their team need?',
    title: 'Team Skillset Diversity & Advisors',
    description: 'How much help does their team need?',
    notesHeader: 'Team Notes',
    questionNumber: 3,
    pitchNote: 'lab help, regulatory guidance for starts.',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'groups',
  },
  {
    id: 'team_other',
    category: 'team',
    categoryTitle:
      'Team: If given the opportunity to mentor or work with this company, I definitely would.',
    categoryShortTitle: 'Team',
    criteriaName: 'Other:',
    prompt: '',
    title: 'Other:',
    description: '',
    notesHeader: 'Team Notes',
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    isOther: true,
  },

  // Section 2: Value Proposition
  {
    id: 'market_pmf',
    category: 'market',
    categoryTitle:
      'Value Proposition: If I were a target customer, I would buy this product or service.',
    categoryShortTitle: 'Value Proposition',
    criteriaName: 'Product-Market Fit',
    prompt: 'Is this solution viable, desirable, and feasible?',
    title: 'Product-Market Fit',
    description: 'Is this solution viable, desirable, and feasible?',
    notesHeader: 'Value Prop Notes',
    questionNumber: 4,
    pitchNote:
      "it seems like a good solution as it doesn't require adopters to spend lots of $$ and doesn't increase treatment time significantly.",
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'storefront',
  },
  {
    id: 'market_competitive',
    category: 'market',
    categoryTitle:
      'Value Proposition: If I were a target customer, I would buy this product or service.',
    categoryShortTitle: 'Value Proposition',
    criteriaName: 'Competitive Advantage',
    prompt: 'Is this solution significantly better than current alternatives?',
    title: 'Competitive Advantage',
    description: 'Is this solution significantly better than current alternatives?',
    notesHeader: 'Value Prop Notes',
    questionNumber: 5,
    pitchNote:
      'it sounds like the current solution is horrible and the market would welcome a new solution',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'trending_up',
  },
  {
    id: 'market_traction',
    category: 'market',
    categoryTitle:
      'Value Proposition: If I were a target customer, I would buy this product or service.',
    categoryShortTitle: 'Value Proposition',
    criteriaName: 'Traction - Strategic Partners & Existing Customers',
    prompt: 'Is there market interest/validation?',
    title: 'Traction - Strategic Partners & Existing Customers',
    description: 'Is there market interest/validation?',
    notesHeader: 'Value Prop Notes',
    questionNumber: 6,
    pitchNote: 'not sure.',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'help_outline',
  },
  {
    id: 'market_ecosystem',
    category: 'market',
    categoryTitle:
      'Value Proposition: If I were a target customer, I would buy this product or service.',
    categoryShortTitle: 'Value Proposition',
    criteriaName: 'Ecosystem',
    prompt: 'Do they have connections to their industry to get feedback, leads, etc.?',
    title: 'Ecosystem',
    description: 'Do they have connections to their industry to get feedback, leads, etc.?',
    notesHeader: 'Value Prop Notes',
    questionNumber: 7,
    pitchNote:
      'The medical colleagues would be a key population to get onboard and having a practicing MD should facilitate that.',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'hub',
  },
  {
    id: 'market_other',
    category: 'market',
    categoryTitle:
      'Value Proposition: If I were a target customer, I would buy this product or service.',
    categoryShortTitle: 'Value Proposition',
    criteriaName: 'Other:',
    prompt: '',
    title: 'Other:',
    description: '',
    notesHeader: 'Value Prop Notes',
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    isOther: true,
  },

  // Section 3: ABI Fit
  {
    id: 'fit_labspace',
    category: 'fit',
    categoryTitle:
      'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    categoryShortTitle: 'ABI Fit',
    criteriaName: 'Lab space needs',
    prompt: 'Does this company need the type of equipment ABI provides ?',
    title: 'Lab space needs',
    description: 'Does this company need the type of equipment ABI provides ?',
    notesHeader: 'ABI Fit Notes',
    questionNumber: 8,
    pitchNote: 'Impact Lab too',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'biotech',
  },
  {
    id: 'fit_abifit',
    category: 'fit',
    categoryTitle:
      'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    categoryShortTitle: 'ABI Fit',
    criteriaName: 'ABI Fit',
    prompt: "Would I want to see this company on ABI's website?",
    title: 'ABI Fit',
    description: "Would I want to see this company on ABI's website?",
    notesHeader: 'ABI Fit Notes',
    questionNumber: 9,
    pitchNote: 'yes,',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'thumb_up',
  },
  {
    id: 'fit_students',
    category: 'fit',
    categoryTitle:
      'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    categoryShortTitle: 'ABI Fit',
    criteriaName: 'Work with students',
    prompt: 'Do they want to work with ACC students/faculty/staff?',
    title: 'Work with students',
    description: 'Do they want to work with ACC students/faculty/staff?',
    notesHeader: 'ABI Fit Notes',
    questionNumber: 10,
    pitchNote:
      'yes, they are hoping that ACC students will be the lab staff. (not likely to be a good solution, but indicates their willingness)',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'school',
  },
  {
    id: 'fit_goodcitizen',
    category: 'fit',
    categoryTitle:
      'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    categoryShortTitle: 'ABI Fit',
    criteriaName: 'Good Citizen',
    prompt: 'Do they seem agreeable and cooperative?',
    title: 'Good Citizen',
    description: 'Do they seem agreeable and cooperative?',
    notesHeader: 'ABI Fit Notes',
    questionNumber: 11,
    pitchNote:
      'yes. they are good communictors and are mature enough to feel confident that they would comply with rules',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'handshake',
  },
  {
    id: 'fit_other',
    category: 'fit',
    categoryTitle:
      'ABI Fit: I believe ABI has the appropriate resources and should help this company.',
    categoryShortTitle: 'ABI Fit',
    criteriaName: 'Other:',
    prompt: '',
    title: 'Other:',
    description: '',
    notesHeader: 'ABI Fit Notes',
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    isOther: true,
  },

  // Section 4: Risk
  {
    id: 'risk_regulatory',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Regulatory Risks/Barriers',
    prompt: 'Ability to operate efficiently or with undue risk?',
    title: 'Regulatory Risks/Barriers',
    description: 'Ability to operate efficiently or with undue risk?',
    notesHeader: 'Risk Notes',
    questionNumber: 12,
    pitchNote: 'they have a handle the importance of IP protection etc.',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'gavel',
  },
  {
    id: 'risk_commercial',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Commercial Readiness',
    prompt: 'Working, well-defined offering that can be purchased?',
    title: 'Commercial Readiness',
    description: 'Working, well-defined offering that can be purchased?',
    notesHeader: 'Risk Notes',
    questionNumber: 13,
    pitchNote: 'yes',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'verified',
  },
  {
    id: 'risk_ip',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Intellectual Property Status/Risk',
    prompt: 'Do they have legal protection for their unique value?',
    title: 'Intellectual Property Status/Risk',
    description: 'Do they have legal protection for their unique value?',
    notesHeader: 'Risk Notes',
    questionNumber: 14,
    pitchNote: 'patents filed',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'shield',
  },
  {
    id: 'risk_funding',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Funding & Capital',
    prompt: 'Investment(s) to date? Would an investor give them money?',
    title: 'Funding & Capital',
    description: 'Investment(s) to date? Would an investor give them money?',
    notesHeader: 'Risk Notes',
    questionNumber: 15,
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'payments',
  },
  {
    id: 'risk_revenue',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Revenue & Burn Rate',
    prompt: 'Would I trust them to manage my investment efficiently/effectively?',
    title: 'Revenue & Burn Rate',
    description: 'Would I trust them to manage my investment efficiently/effectively?',
    notesHeader: 'Risk Notes',
    questionNumber: 16,
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    noteBadgeIcon: 'account_balance',
  },
  {
    id: 'risk_other',
    category: 'risk',
    categoryTitle: 'Risk: I would invest my own money in this company.',
    categoryShortTitle: 'Risk',
    criteriaName: 'Other:',
    prompt: '',
    title: 'Other:',
    description: '',
    notesHeader: 'Risk Notes',
    pitchNote: '',
    pitchNoteAuthor: "Nancy Lyon's Pitch Note",
    isOther: true,
  },
];

export const INITIAL_REVIEWERS: ReviewerScoreRecord[] = [
  {
    id: 'nl',
    name: 'Nancy Lyon',
    initials: 'NL',
    title: 'Lab Operations Specialist',
    role: 'Steering Committee',
    scores: {
      team_coachability: 4,
      team_qualifications: 4,
      team_skillset: 4,
      market_pmf: 4,
      market_competitive: 4,
      market_traction: 4,
      market_ecosystem: 4,
      fit_labspace: 4,
      fit_abifit: 4,
      fit_students: 4,
      fit_goodcitizen: 4,
      risk_regulatory: 4,
      risk_commercial: 4,
      risk_ip: 4,
      risk_funding: 4,
      risk_revenue: 4,
    },
    categoryRatings: {
      team: 4,
      market: 4,
      fit: 4,
      risk: 4,
    },
    keyStrengths:
      'Exceptional business maturity compared to incoming cohort peers. Pre-emptive engagement with FDA consultants demonstrates strong execution acumen. Founders are pragmatic and communicate clearly.',
    supportNeeded:
      'Microbiology technical benchwork needs structured mentorship. Reliance on student labor must be monitored and supplemented with veteran advisory support before wet-lab protocols scale.',
    isSubmitted: true,
    submittedAt: 'Jan 23, 2026 14:45',
  },
  {
    id: 'sa',
    name: 'Shane Allen',
    initials: 'SA',
    title: 'Commercialization & IP',
    role: 'Steering Committee',
    scores: {
      team_coachability: 4,
      team_qualifications: 4,
      team_skillset: 4,
      market_pmf: 3,
      market_competitive: 4,
      market_traction: 3,
      market_ecosystem: 4,
      fit_labspace: 4,
      fit_abifit: 4,
      fit_students: 3,
      fit_goodcitizen: 4,
      risk_regulatory: 4,
      risk_commercial: 4,
      risk_ip: 5,
      risk_funding: 4,
      risk_revenue: 4,
    },
    categoryRatings: {
      team: 4,
      market: 3.5,
      fit: 3.8,
      risk: 4.2,
    },
    keyStrengths:
      'Very strong intellectual property foundation and deep commercial background. The founders possess realistic expectations around healthcare economics.',
    supportNeeded:
      'Assistance modeling outpatient insurance codes and structuring reimbursement dossier.',
    isSubmitted: true,
    submittedAt: 'Jan 23, 2026 15:10',
  },
  {
    id: 'np',
    name: 'Nancy Patterson',
    initials: 'NP',
    title: 'Clinical Validation Expert',
    role: 'Steering Committee',
    scores: {
      team_coachability: 4,
      team_qualifications: 4,
      team_skillset: 4,
      market_pmf: 4,
      market_competitive: 3,
      market_traction: 3,
      market_ecosystem: 4,
      fit_labspace: 4,
      fit_abifit: 4,
      fit_students: 4,
      fit_goodcitizen: 4,
      risk_regulatory: 4,
      risk_commercial: 3,
      risk_ip: 4,
      risk_funding: 3,
      risk_revenue: 3,
    },
    categoryRatings: {
      team: 4,
      market: 3.5,
      fit: 4.0,
      risk: 3.4,
    },
    keyStrengths:
      'Clear unmet medical need identified. Recalcitrant chronic sinusitis patients require novel localized interventions.',
    supportNeeded:
      'Need to ensure clinical co-founder balances medical practice obligations with lab protocols.',
    isSubmitted: true,
    submittedAt: 'Jan 23, 2026 15:30',
  },
  {
    id: 'ks',
    name: 'Kevin Smith',
    initials: 'KS',
    title: 'Biotech Workforce & Mentorship',
    role: 'Steering Committee',
    scores: {
      team_coachability: 5,
      team_qualifications: 5,
      team_skillset: 5,
      market_pmf: 4,
      market_competitive: 4,
      market_traction: 4,
      market_ecosystem: 4,
      fit_labspace: 4,
      fit_abifit: 5,
      fit_students: 5,
      fit_goodcitizen: 5,
      risk_regulatory: 4,
      risk_commercial: 4,
      risk_ip: 4,
      risk_funding: 4,
      risk_revenue: 4,
    },
    categoryRatings: {
      team: 5,
      market: 4,
      fit: 4.8,
      risk: 4.0,
    },
    keyStrengths:
      'Exemplary coachability and eagerness to mentor ACC biotechnology students. High cultural alignment with ABI incubator values.',
    supportNeeded:
      'Continuous oversight on biofilm assay replicates and technical training on spectrophotometers.',
    isSubmitted: true,
    submittedAt: 'Jan 23, 2026 16:00',
  },
  {
    id: 'ch',
    name: 'Cam Houser',
    initials: 'CH',
    title: 'Entrepreneurship Lead',
    role: 'Steering Committee',
    scores: {
      team_coachability: 5,
      team_qualifications: 5,
      team_skillset: 5,
      market_pmf: 4,
      market_competitive: 4,
      market_traction: 4,
      market_ecosystem: 4,
      fit_labspace: 4,
      fit_abifit: 4,
      fit_students: 4,
      fit_goodcitizen: 4,
      risk_regulatory: 4,
      risk_commercial: 4,
      risk_ip: 4,
      risk_funding: 4,
      risk_revenue: 4,
    },
    categoryRatings: {
      team: 5,
      market: 4,
      fit: 4.0,
      risk: 4.0,
    },
    keyStrengths:
      'High entrepreneurial quotient. The pitch evolved substantially based on preliminary feedback, showing exceptional velocity.',
    supportNeeded:
      'Introductions to healthcare venture partners once the 6-month in-vitro eradication data is verified.',
    isSubmitted: true,
    submittedAt: 'Jan 23, 2026 16:15',
  },
];

import { SYNTHETIC_SOLARIS_COMPANY, SYNTHETIC_NANCY_FEEDBACK_SECTIONS } from '../fixtures/syntheticFixture';

export const NANCY_STANDARDIZED_FEEDBACK_SECTIONS: FeedbackSectionData[] = [
  {
    id: 'overall',
    title: 'OVERALL FEEDBACK',
    prompt: 'What is the overall view on the company, where it is at now, and its future path.',
    summary:
      'Company is a small team with a potentially very valuable technology portfolio once the injection technology and therapeutic component are married. However, each may be valuable independently. The team possesses the technical expertise to drive progress at a high-level but will need support from staff in the laboratory and experts or advisors in the non-technical aspects of the business, such as the regulatory pathway, business development, and connections to partners. This technology is at the stage where partnership with ABI is both appropriate, feasible, and desirable, though they may quickly outgrow the facility. Marcel personally appears to be a driven, successful, and conscientious member of the community and would be welcome in the Austin ecosystem. Because of this the committee has recommended that Company be offered admission into the Incubator.',
    quotes: [],
    quoteRefs: [],
  },
  {
    id: 'team',
    title: 'FEEDBACK ON TEAM',
    prompt: 'Does the company possess the internal talent and/or hired external talent needed to make progress?',
    categoryScoreKey: 'team',
    summary:
      'There appears to be no concern about the technical expertise that Company has access to. The two largest gaps identified by the committee would be (1) selection of the appropriate laboratory staff to conduct the work and (2) collaborators, advisors, or staff to provide insight to the non-technical aspects of the business (i.e. business development, regulatory partners).',
    quotes: [
      'He will need lab staff and some business help. He acknowledged the lab need.',
      "I think they're likely qualified to succeed with solution development. Commercial success is a different question. He is an accomplished PI with a long track record in the field.",
      'He seems to have many many academic collaborators and experience, but may need to engage other stakeholders in Austin ecosystem.',
    ],
    quoteRefs: [],
  },
  {
    id: 'value_prop',
    title: 'FEEDBACK ON VALUE PROPOSITION',
    prompt: 'Does the company have a solution that is viable, desirable, and feasible? Is there a clear path to commercialization of the technology?',
    categoryScoreKey: 'market',
    summary:
      'The current targeted exit strategy seems to likely be acquisition due to the extended timeline to get their technology into patients. This is due in large part due to the novelty of the technology but also due to the market space they are entering (therapeutics). This is a risky strategy due to many factors and may be ameliorated to some extent by developing relationships with key stakeholders (and potential customers) now and possibly pursuing licensing opportunities. The committee identified a significant amount of risk here and addition of expertise in this space (business development, regulatory, etc) via staff or advisors will be key. There was also concern about expired patents.',
    quotes: [
      'Far from commercial readiness. Exit strategy seems to be pre-revenue acquisition, which is definitely risky / lower probability.',
      "It feels like they've figured out a potentially better solution to a problem that people want solved. It's not clear that they've figured out if someone would be willing to pay for the solution. (Focus was more on company acquisition than on the end customer.)",
      'This product has a long way to go. Direct injection of modified cells to the center of the brain will be a hard sell.',
    ],
    quoteRefs: [],
  },
  {
    id: 'abi_fit',
    title: 'FEEDBACK ON ABI FIT',
    prompt: 'Does the mission of the company align with ABI? Would a relationship between the company and ABI be beneficial to both parties?',
    categoryScoreKey: 'fit',
    summary:
      'The facility offered by ABI appears to have the vast majority of the instrumentation that the company would need for internal R&D as well as some validation. The size of the company also aligns with ABI’s portfolio. They will need to hire staff to conduct the work at the incubator and ensure those staff work well in these spaces. They will also need to conduct animal work at some point outside of ABI.',
    quotes: [
      '[Company would need] Cell culture, flow, qPCR, etc. They want to do assay dev and development of cell differentiation procedure. No animal work being done.',
      "This wasn't completely clear to me. It seems like the space might be useful for making cells and assay development, but the case wasn't super-strong.",
      'Yes he will be fine here [at ABI]',
    ],
    quoteRefs: [],
  },
  {
    id: 'risk',
    title: 'FEEDBACK ON RISK',
    prompt: 'What are the technical, regulatory, IP, and financial risks, and how should they be addressed?',
    categoryScoreKey: 'risk',
    summary:
      'The technology appears to be at a very early stage, but has a large potential for dramatic improvement relative to competitors. This means the risk is high, but the potential is very great. Identifying the key ‘go / no-go’ experiments at ABI and technological gates more broadly will be key in maintaining momentum. The specific injection technology may have more monetary value than the cellular component at the end of the day, and further development and/or protection of this technology can de-risk the less mature therapeutic and cellular component. The regulatory risk of this technology should not be underestimated and evaluated internally and with advisors and external stakeholders.',
    quotes: [
      'The major value add for their tech is the surgical implantation, which is far above competitors. Specific cell enrichment is slightly better, but less separation it seems.',
      'It [the technology] is well defined, but complicated.',
      'No iPS derived cell therapy has been approved previously, so risk there. Not personalized, they want allogeneic therapy from one single cell line',
    ],
    quoteRefs: [],
  },
];

/**
 * Explicit migration function that maps legacy meeting sections to Nancy's 5 sections
 * without silently relabeling content or assigning a Risk score to Technology.
 */
export const migrateMeetingFeedbackSections = (
  existingSections?: FeedbackSectionData[]
): FeedbackSectionData[] => {
  if (!existingSections || existingSections.length === 0) {
    return NANCY_STANDARDIZED_FEEDBACK_SECTIONS.map((s) => ({
      ...s,
      quotes: [...(s.quotes || [])],
      quoteRefs: (s.quoteRefs || []).map((qr) => ({ ...qr })),
    }));
  }

  const secMap = new Map(existingSections.map((s) => [s.id, s]));

  // 1. Overall
  const legacyOverall = secMap.get('overall');
  const overallSec: FeedbackSectionData = {
    id: 'overall',
    title: legacyOverall?.title || 'OVERALL FEEDBACK',
    prompt: legacyOverall?.prompt || 'What is the overall view on the company, where it is at now, and its future path.',
    summary: legacyOverall?.summary || '',
    quotes: [...(legacyOverall?.quotes || [])],
    quoteRefs: (legacyOverall?.quoteRefs || []).map((qr) => ({ ...qr })),
  };

  // 2. Team
  const legacyTeam = secMap.get('team');
  const teamSec: FeedbackSectionData = {
    id: 'team',
    title: legacyTeam?.title || 'FEEDBACK ON TEAM',
    prompt: legacyTeam?.prompt || 'Does the company possess the internal talent and/or hired external talent needed to make progress?',
    categoryScoreKey: 'team',
    summary: legacyTeam?.summary || '',
    quotes: [...(legacyTeam?.quotes || [])],
    quoteRefs: (legacyTeam?.quoteRefs || []).map((qr) => ({ ...qr })),
  };

  // 3. Value Proposition
  const legacyVP = secMap.get('value_prop') || secMap.get('business_plan');
  const vpSec: FeedbackSectionData = {
    id: 'value_prop',
    title: 'FEEDBACK ON VALUE PROPOSITION',
    prompt: legacyVP?.prompt || 'Does the company have a solution that is viable, desirable, and feasible? Is there a clear path to commercialization of the technology?',
    categoryScoreKey: 'market',
    summary: legacyVP?.summary || '',
    quotes: [...(legacyVP?.quotes || [])],
    quoteRefs: (legacyVP?.quoteRefs || []).map((qr) => ({ ...qr })),
  };

  // 4. ABI Fit
  const legacyFit = secMap.get('abi_fit');
  const fitSec: FeedbackSectionData = {
    id: 'abi_fit',
    title: 'FEEDBACK ON ABI FIT',
    prompt: legacyFit?.prompt || 'Does the mission of the company align with ABI? Would a relationship between the company and ABI be beneficial to both parties?',
    categoryScoreKey: 'fit',
    summary: legacyFit?.summary || '',
    quotes: [...(legacyFit?.quotes || [])],
    quoteRefs: (legacyFit?.quoteRefs || []).map((qr) => ({ ...qr })),
  };

  // 5. Risk
  const legacyRisk = secMap.get('risk');
  const riskSec: FeedbackSectionData = {
    id: 'risk',
    title: 'FEEDBACK ON RISK',
    prompt: legacyRisk?.prompt || 'What are the technical, regulatory, IP, and financial risks, and how should they be addressed?',
    categoryScoreKey: 'risk',
    summary: legacyRisk?.summary || '',
    quotes: [...(legacyRisk?.quotes || [])],
    quoteRefs: (legacyRisk?.quoteRefs || []).map((qr) => ({ ...qr })),
  };

  const result = [overallSec, teamSec, vpSec, fitSec, riskSec];

  // 6. Explicitly preserve legacy Technology section if present, WITHOUT assigning Risk score to Technology
  const legacyTech = secMap.get('technology');
  if (legacyTech) {
    result.push({
      id: 'technology',
      title: legacyTech.title || 'FEEDBACK ON TECHNOLOGY',
      prompt: legacyTech.prompt || 'Does the company have a technology that has been developed or there is significant confidence in it being developed?',
      // CRITICAL: Explicitly undefined; DO NOT assign categoryScoreKey: 'risk' to Technology
      categoryScoreKey: undefined,
      summary: legacyTech.summary || '',
      quotes: [...(legacyTech.quotes || [])],
      quoteRefs: (legacyTech.quoteRefs || []).map((qr) => ({ ...qr })),
    });
  }

  return result;
};

export const DEFAULT_FEEDBACK_SECTIONS: FeedbackSectionData[] = NANCY_STANDARDIZED_FEEDBACK_SECTIONS;

export const DEFAULT_CONTACT_DETAILS: OrganizationContactDetails = {
  primaryContactName: 'Not provided',
  roleOrTitle: 'Not provided',
  email: 'Not provided',
  phone: 'Not provided',
  website: 'Not provided',
  linkedIn: 'Not provided',
  mailingAddress: 'Not provided',
};

export const DEFAULT_APPLICATION_INFO: ApplicationIntakeInfo = {
  submittedAt: 'Not provided',
  executiveSummary: 'Not provided',
  problemStatement: 'Not provided',
  proposedSolution: 'Not provided',
  stageOfDevelopment: 'Not provided',
  targetMarket: 'Not provided',
  teamBackground: 'Not provided',
  fundingRaisedToDate: 'Not provided',
  spaceRequirements: 'Not provided',
  additionalFields: {},
};

export const DEFAULT_CONTRACT_DETAILS: OrganizationContractDetails = {
  status: 'Pending Execution',
  agreementDate: 'Not provided',
  effectiveStartDate: 'Not provided',
  termEndDate: 'Not provided',
  monthlyFee: 'Not provided',
  securityDeposit: 'Not provided',
  billingCadence: 'Not provided',
  rooms: [],
  benches: [],
  instrumentAccess: [],
  specialConditions: 'Not provided',
};

export const VAYIM_CONTACT_DETAILS: OrganizationContactDetails = {
  primaryContactName: 'Dr. Marcel Tremblay',
  roleOrTitle: 'Co-Founder & Chief Executive Officer',
  email: 'marcel@vayimtx.com',
  phone: '(512) 842-1980',
  website: 'https://vayimtx.com',
  linkedIn: 'https://linkedin.com/company/vayim-therapeutics',
  mailingAddress: '6101 Highland Campus Dr, Bldg 4000, Austin, TX 78752',
};

export const VAYIM_APPLICATION_INFO: ApplicationIntakeInfo = {
  submittedAt: 'Jan 05, 2026',
  executiveSummary:
    'Vayim Therapeutics is an early-stage biopharmaceutical startup developing an enzyme-mediated topical catheter delivery platform to eradicate recalcitrant bacterial biofilms in chronic rhinosinusitis (CRS).',
  problemStatement:
    'Chronic rhinosinusitis afflicts 30M+ Americans. Bacterial biofilms create an impenetrable extracellular matrix causing high surgical revision rates (25% in 3 years) and systemic antibiotic resistance.',
  proposedSolution:
    'Proprietary catalytic formulation disrupting extracellular polysaccharide matrix, combined with outpatient targeted irrigations that restore native mucosal ciliary function.',
  stageOfDevelopment: 'Pre-clinical validation; in-vitro eradication data established.',
  targetMarket: 'Outpatient Ear, Nose, and Throat (ENT) surgical practices and ambulatory surgery centers.',
  teamBackground:
    'Led by serial biotechnology founders and an active rhinologic ENT surgeon with 15+ years clinical expertise and proven patent filings.',
  fundingRaisedToDate: '$750,000 Seed / Non-dilutive NIH SBIR Phase 1 grant application submitted.',
  spaceRequirements:
    'Two dedicated wet lab benches, BSL-2 cell/microbiology culture access, -80°C cold storage, and spectrophotometer/fluorescence plate readers.',
  additionalFields: {
    'Referral Source': 'Austin Technology Incubator (ATI) / BioAustin Network',
    'Hazardous Chemicals': 'Standard BSL-2 microbial strains (P. aeruginosa, S. aureus); no volatile toxics.',
    'ACC Student Interns': 'Committed to mentoring 2 ACC Biotechnology AAS interns per academic year.',
  },
};

export const VAYIM_CONTRACT_DETAILS: OrganizationContractDetails = {
  status: 'Active',
  agreementDate: 'Jan 28, 2026',
  effectiveStartDate: 'Feb 01, 2026',
  termEndDate: 'Jan 31, 2027',
  monthlyFee: '$1,850 / month',
  securityDeposit: '$3,700',
  billingCadence: 'Monthly (Net 30)',
  rooms: ['Room 214 (Wet Lab)', 'BSL-2 Shared Culture Suite A'],
  benches: ['Bench B-03', 'Bench B-04'],
  instrumentAccess: [
    'Confocal Laser Scanning Microscope (Leica STELLARIS)',
    'Flow Cytometer (BD Accuri C6 Plus)',
    'Autoclave & Media Preparation Suite',
    '-80°C Ultra-Low Temperature Freezer Rack 3',
    'Microplate Spectrophotometer (BioTek Synergy H1)',
  ],
  specialConditions:
    'Resident company must sponsor at least 1 ACC Biotechnology AAS student intern per academic semester. All BSL-2 microbial biofilm protocols must be approved by the ACC Institutional Biosafety Committee (IBC) prior to culture initiation.',
};

export const VAYIM_CONTRACT_DOCUMENTS: ContractDocument[] = [
  {
    id: 'doc_vayim_license_2026',
    organizationId: 'vayim',
    title: 'ABI Resident Facility License Agreement - Vayim Therapeutics.pdf',
    documentType: 'Original Contract',
    uploadedAt: 'Jan 28, 2026',
    fileSize: '2.4 MB',
    fileType: 'application/pdf',
    uploadedDuringMeetingId: 'vayim_initial_pitch',
  },
  {
    id: 'doc_vayim_amendment_1',
    organizationId: 'vayim',
    title: 'Amendment 1 - Dedicated Bench B-04 Expansion & Ultra-Low Freezer Allocation.pdf',
    documentType: 'Amendment',
    uploadedAt: 'Apr 15, 2026',
    fileSize: '480 KB',
    fileType: 'application/pdf',
    uploadedDuringMeetingId: 'vayim_checkin_2026_04',
  },
];

export const VAYIM_MEETINGS: MeetingRecord[] = [
  {
    id: 'vayim_initial_pitch',
    organizationId: 'vayim',
    type: 'Initial Pitch',
    title: 'Initial Pitch & Steering Committee Admission Review',
    date: 'Jan 23, 2026',
    deckTitle: 'Vayim - Cohort 2026.1 Pitch Deck.pdf',
    deckSlideCount: 12,
    deckDocumentId: 'doc_vayim_pitch_deck',
    reviewers: INITIAL_REVIEWERS,
    feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
    status: 'Completed',
  },
  {
    id: 'vayim_checkin_2026_04',
    organizationId: 'vayim',
    type: 'Progress Check-in',
    title: 'Q1 Progress Check-in: Biofilm Assay & BSL-2 Milestones',
    date: 'Apr 15, 2026',
    deckTitle: 'Vayim - Q1 Progress Update Deck.pdf',
    deckSlideCount: 8,
    deckDocumentId: 'doc_vayim_checkin_deck',
    reviewers: INITIAL_REVIEWERS.map((r) => ({
      ...r,
      lastSavedAt: 'Apr 15, 2026 16:30',
    })),
    feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
    status: 'Completed',
  },
];

export const INITIAL_COMPANY: CompanyAssessment = {
  id: 'vayim',
  name: 'Vayim',
  round: 'Round 1 Evaluation',
  cohort: 'Cohort 2026.1 Assessment',
  reviewDate: 'Jan 23, 2026',
  domain: 'ENT Biofilm Therapeutics',
  admissionStatus: 'Approved',
  thresholdScore: 3.5,
  contactDetails: VAYIM_CONTACT_DETAILS,
  applicationInfo: VAYIM_APPLICATION_INFO,
  contractDetails: VAYIM_CONTRACT_DETAILS,
  contractDocuments: VAYIM_CONTRACT_DOCUMENTS,
  meetings: VAYIM_MEETINGS,
};

export const INITIAL_COMPANIES: CompanyAssessment[] = [
  SYNTHETIC_SOLARIS_COMPANY,
  INITIAL_COMPANY,
  {
    id: 'bionanox',
    name: 'BioNanox Diagnostics',
    round: 'Round 1 Evaluation',
    cohort: 'Cohort 2026.1 Assessment',
    reviewDate: 'Feb 10, 2026',
    domain: 'Rapid Microfluidic Pathogen Detection',
    admissionStatus: 'Pending',
    thresholdScore: 3.5,
    contactDetails: {
      ...DEFAULT_CONTACT_DETAILS,
      primaryContactName: 'Dr. Elena Rostova',
      roleOrTitle: 'Founder & CTO',
      email: 'elena@bionanox.io',
      phone: '(512) 774-2901',
      website: 'https://bionanox.io',
    },
    applicationInfo: {
      ...DEFAULT_APPLICATION_INFO,
      submittedAt: 'Jan 18, 2026',
      executiveSummary: 'Point-of-care microfluidic cartridge detecting bacterial sepsis in under 15 minutes.',
      spaceRequirements: '1 dedicated wet lab bench, spectrophotometer, and BSL-2 biosafety cabinet.',
    },
    contractDetails: DEFAULT_CONTRACT_DETAILS,
    contractDocuments: [],
    meetings: [
      {
        id: 'bionanox_initial_pitch',
        organizationId: 'bionanox',
        type: 'Initial Pitch',
        title: 'BioNanox Diagnostics - Initial Pitch Review',
        date: 'Feb 10, 2026',
        deckTitle: 'BioNanox_Pitch_Deck_Cohort_2026.1.pdf',
        reviewers: INITIAL_REVIEWERS.map((r) => ({
          ...r,
          scores: {
            team_coachability: 4,
            team_qualifications: 4,
            team_skillset: 3,
            market_pmf: 4,
            market_competitive: 4,
            market_traction: 3,
            market_ecosystem: 4,
            fit_labspace: 5,
            fit_abifit: 4,
            fit_students: 4,
            fit_goodcitizen: 4,
            risk_regulatory: 3,
            risk_commercial: 3,
            risk_ip: 4,
            risk_funding: 3,
            risk_revenue: 3,
          },
          notes: {
            team_coachability: 'Founders receptive to guidance on diagnostic sensitivity assays.',
            fit_labspace: 'Direct match for BSL-2 biosafety hoods and spectrophotometers.',
          },
          keyStrengths: 'High technical aptitude in microfluidic engineering and point-of-care diagnostics.',
          supportNeeded: 'Regulatory guidance on CLIA waiver submission.',
          isSubmitted: false,
        })),
        feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
        status: 'In Progress',
      },
    ],
  },
  {
    id: 'austin_cell',
    name: 'Austin Cell Therapeutics',
    round: 'Round 2 Evaluation',
    cohort: 'Cohort 2025.2 Review',
    reviewDate: 'Nov 14, 2025',
    domain: 'Allogeneic Stem Cell Preservation',
    admissionStatus: 'Approved',
    thresholdScore: 3.5,
    contactDetails: {
      ...DEFAULT_CONTACT_DETAILS,
      primaryContactName: 'Marcus Vance',
      roleOrTitle: 'Co-Founder & COO',
      email: 'm.vance@austincelltx.com',
      phone: '(512) 991-3840',
      website: 'https://austincelltx.com',
    },
    applicationInfo: {
      ...DEFAULT_APPLICATION_INFO,
      submittedAt: 'Oct 20, 2025',
      executiveSummary: 'Cryopreservation reagents extending allogeneic stem cell viability post-thaw.',
      spaceRequirements: '2 benches, liquid nitrogen storage dewar, flow cytometer.',
    },
    contractDetails: {
      status: 'Active',
      agreementDate: 'Dec 01, 2025',
      effectiveStartDate: 'Jan 01, 2026',
      termEndDate: 'Dec 31, 2026',
      monthlyFee: '$2,200 / month',
      securityDeposit: '$4,400',
      billingCadence: 'Monthly (Net 30)',
      rooms: ['Room 216 (Stem Cell Suite)'],
      benches: ['Bench C-01', 'Bench C-02'],
      instrumentAccess: ['Flow Cytometer (BD Accuri C6 Plus)', 'Cryogenic Liquid Nitrogen Storage Dewar'],
      specialConditions: 'Liquid nitrogen cryogenic dewars calibration supervised by ABI Lab Operations.',
    },
    contractDocuments: [
      {
        id: 'doc_austin_cell_contract',
        organizationId: 'austin_cell',
        title: 'ABI Resident Facility License Agreement - Austin Cell Therapeutics.pdf',
        documentType: 'Original Contract',
        uploadedAt: 'Dec 01, 2025',
        fileSize: '2.1 MB',
        fileType: 'application/pdf',
        uploadedDuringMeetingId: 'austin_cell_initial_pitch',
      },
    ],
    meetings: [
      {
        id: 'austin_cell_initial_pitch',
        organizationId: 'austin_cell',
        type: 'Initial Pitch',
        title: 'Austin Cell Therapeutics - Round 2 Evaluation Pitch',
        date: 'Nov 14, 2025',
        deckTitle: 'Austin_Cell_Pitch_Deck_2025.2.pdf',
        reviewers: INITIAL_REVIEWERS.map((r) => ({
          ...r,
          scores: {
            team_coachability: 5,
            team_qualifications: 5,
            team_skillset: 4,
            market_pmf: 4,
            market_competitive: 4,
            market_traction: 4,
            market_ecosystem: 4,
            fit_labspace: 4,
            fit_abifit: 5,
            fit_students: 5,
            fit_goodcitizen: 5,
            risk_regulatory: 4,
            risk_commercial: 4,
            risk_ip: 4,
            risk_funding: 4,
            risk_revenue: 4,
          },
          notes: {},
          keyStrengths: 'Serial biotech entrepreneurs with proven track record in stem cell biology.',
          supportNeeded: 'Liquid nitrogen cryogenic dewars calibration.',
          isSubmitted: true,
        })),
        feedbackSummary: DEFAULT_FEEDBACK_SECTIONS,
        status: 'Completed',
      },
    ],
  },
];


export const KEY_PRIORITIES_DATA: KeyPriority[] = [
  {
    id: 1,
    categoryTag: 'Value Proposition',
    title: 'Prove Mechanism of Action',
    badge: 'Top Pre-Clinical Hurdle',
    badgeIcon: 'biotech',
    companyAction:
      'Provide real clinical proof that the formulation penetrates deep into chronic biofilms and remains active for 6 to 12 months, rather than relying solely on early microscope slides.',
    accSupport:
      'Grant full access to the ACC Impact Microbiology Lab and pair the team with our Scientific Advisory Board to validate in-vitro bacterial eradication tests.',
  },
  {
    id: 2,
    categoryTag: 'Reimbursement',
    title: 'Clarify Insurance & Billing',
    badge: 'Commercial Readiness',
    badgeIcon: 'payments',
    companyAction:
      'Demonstrate direct hospital cost savings. Insurance companies often bundle new ENT procedures unless there is clear financial evidence of fewer repeat surgeries.',
    accSupport:
      "Connect the founders with ABI's dedicated health economics and billing advisors to model outpatient surgical reimbursement codes early on.",
  },
  {
    id: 3,
    categoryTag: 'Market Adoption',
    title: 'Educate Ear, Nose & Throat Doctors',
    badge: 'Doctor Adoption',
    badgeIcon: 'school',
    companyAction:
      'Overcome physician skepticism about sinus biofilms through published peer data and ensure the drug adds zero additional time during routine sinus surgery.',
    accSupport:
      'Facilitate conference presentations at the American Rhinologic Society (ARS) and arrange discussions with regional ENT surgical leaders in Central Texas.',
  },
  {
    id: 4,
    categoryTag: 'Team Capacity',
    title: 'Reinforce Lab Staff & Daily Bench Work',
    badge: 'Hands-On Execution',
    badgeIcon: 'science',
    companyAction:
      'Both founders have executive and medical duties. They need dependable, trained hands at the lab bench to handle daily microbial cultures consistently.',
    accSupport:
      "Place top student interns from ACC's advanced biotechnology program and set up bi-weekly quality check-ins supervised by ACC laboratory staff.",
  },
  {
    id: 5,
    categoryTag: 'Patent & Moat',
    title: 'Strengthen Patent Defensibility',
    badge: 'Intellectual Property',
    badgeIcon: 'shield',
    companyAction:
      'Broaden patent claims around their specific drug-delivery mechanism so large pharmaceutical or medical device corporations cannot design an easy workaround.',
    accSupport:
      "Provide a free audit with ABI's partner patent attorneys to draft broader continuation claims and bulletproof the company's intellectual property.",
  },
];

export const TOPIC_REVIEWS_DATA: EvaluationTopic[] = [
  {
    id: 'coachability',
    label: 'Coachability & Leadership',
    icon: 'psychology',
    quotes: [
      {
        reviewerName: 'Nancy Lyon',
        reviewerInitials: 'NL',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Founders showed great poise under pressure during technical cross-examination. Receptive to feedback regarding their clinical timeline, acknowledging that 12 months is unrealistically aggressive for multi-center assays.”',
      },
      {
        reviewerName: 'Shane Allen',
        reviewerInitials: 'SA',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Strong executive baseline. The CEO immediately recognized gaps in their reimbursement assumptions and explicitly requested introductions to ABI health economics advisors.”',
      },
      {
        reviewerName: 'Nancy Patterson',
        reviewerInitials: 'NP',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Willingness to pivot protocol design is apparent. However, need to ensure the clinician co-founder has enough bandwidth away from practice to absorb steering committee guidance.”',
      },
      {
        reviewerName: 'Kevin Smith',
        reviewerInitials: 'KS',
        reviewerRole: 'Steering Committee',
        score: 5.0,
        isTopScore: true,
        quote:
          '“Exemplary responsiveness. Team demonstrated a rare humility for medical device inventors, actively seeking operational critique rather than defending outdated deck assertions.”',
      },
      {
        reviewerName: 'Cam Houser',
        reviewerInitials: 'CH',
        reviewerRole: 'Steering Committee',
        score: 5.0,
        isTopScore: true,
        quote:
          '“High entrepreneurial quotient. The pitch evolved substantially between preliminary screening and this formal committee review based strictly on ABI mentor inputs.”',
      },
    ],
  },
  {
    id: 'pmf',
    label: 'Product-Market Fit & Demand',
    icon: 'storefront',
    quotes: [
      {
        reviewerName: 'Nancy Lyon',
        reviewerInitials: 'NL',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Clear clinical need exists for recalcitrant chronic rhinosinusitis. However, surgeon workflow integration must require zero procedural time extension to achieve true market penetration.”',
      },
      {
        reviewerName: 'Shane Allen',
        reviewerInitials: 'SA',
        reviewerRole: 'Steering Committee',
        score: 3.0,
        quote:
          '“Commercial sizing looks overstated. They assume 40% initial penetration into FESS procedures without factoring in existing steroid-eluting stent contracts held by incumbents.”',
      },
      {
        reviewerName: 'Nancy Patterson',
        reviewerInitials: 'NP',
        reviewerRole: 'Steering Committee',
        score: 3.0,
        quote:
          '“ENTs are notoriously conservative adopters. Until Vayim publishes peer-reviewed human histology showing durable biofilm reduction, adoption will stay confined to clinical trials.”',
      },
      {
        reviewerName: 'Kevin Smith',
        reviewerInitials: 'KS',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Value proposition is fundamentally strong if the delivery mechanism is foolproof. Patient population is desperate for solutions after 2+ failed revision surgeries.”',
      },
      {
        reviewerName: 'Cam Houser',
        reviewerInitials: 'CH',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Compelling founder-market fit. Having an active ENT surgeon as co-founder provides credible direct access to early clinical validation networks.”',
      },
    ],
  },
  {
    id: 'labspace',
    label: 'Lab Space & Equipment Fit',
    icon: 'biotech',
    quotes: [
      {
        reviewerName: 'Nancy Lyon',
        reviewerInitials: 'NL',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“ABI BSL-2 lab capacity aligns well with their initial assay pipeline. They will need dedicated incubator space for microbial plating and sustained culture analysis.”',
      },
      {
        reviewerName: 'Shane Allen',
        reviewerInitials: 'SA',
        reviewerRole: 'Steering Committee',
        score: 3.0,
        quote:
          '“They need clear supervision protocol. Biofilm models require high consistency; relying strictly on student interns without a senior lab manager will create reproducibility issues.”',
      },
      {
        reviewerName: 'Nancy Patterson',
        reviewerInitials: 'NP',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Equipment requirements match ACC resources: spectrophotometers, plate readers, and confocal microscopes are ready on site. Zero capital expense required for early assays.”',
      },
      {
        reviewerName: 'Kevin Smith',
        reviewerInitials: 'KS',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Great fit for ACC biotechnology workforce development. Student placement in Vayim’s lab operations offers mutual value if structured under faculty oversight.”',
      },
      {
        reviewerName: 'Cam Houser',
        reviewerInitials: 'CH',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Immediate occupancy feasible. No hazardous volatiles or specialized exhaust hoods required beyond standard biosafety benching.”',
      },
    ],
  },
  {
    id: 'regulatory',
    label: 'Regulatory & IP Runway',
    icon: 'gavel',
    quotes: [
      {
        reviewerName: 'Nancy Lyon',
        reviewerInitials: 'NL',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“FDA combination product classification remains an open question. If treated as a drug delivery system rather than device with ancillary drug, timeline jumps by 36 months.”',
      },
      {
        reviewerName: 'Shane Allen',
        reviewerInitials: 'SA',
        reviewerRole: 'Steering Committee',
        score: 5.0,
        isTopScore: true,
        quote:
          '“Well protected on provisional filings. Recommend an accelerated formal Q-submission meeting with FDA CDRH to establish primary jurisdiction before Series A closing.”',
      },
      {
        reviewerName: 'Nancy Patterson',
        reviewerInitials: 'NP',
        reviewerRole: 'Steering Committee',
        score: 3.0,
        quote:
          '“Utility claims must be tightened. There is enough prior art around surfactant sinus irrigations that strategic competitors could engineer around without infringing.”',
      },
      {
        reviewerName: 'Kevin Smith',
        reviewerInitials: 'KS',
        reviewerRole: 'Steering Committee',
        score: 3.0,
        quote:
          '“Audit current patent assignment records. Ensure medical school IP policies do not cloud title given the co-founder\'s clinical appointment.”',
      },
      {
        reviewerName: 'Cam Houser',
        reviewerInitials: 'CH',
        reviewerRole: 'Steering Committee',
        score: 4.0,
        quote:
          '“Clean baseline path. ABI regulatory mentorship can help formalize their pre-submission briefing document within the first 60 days of cohort residency.”',
      },
    ],
  },
];
