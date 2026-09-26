export interface PaperMetadata {
  title: string;
  authors?: string[];
  year?: string;
  venueOrCategory?: string;
  primaryDomain?: string;
  oneSentencePitch?: string;
  url?: string;
}

export interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  mathematicalAlgorithmicBreakthroughs: string;
  plainLanguageSummary: string;
  wordCount?: number;
}

export interface FutureWorkOpportunity {
  id: number;
  projectTitle: string;
  exactExtension: string;
  targetedPerformanceMetric: string;
  recommendedTechStack: string[];
  difficultyLevel: 'Intermediate' | 'Advanced' | 'Hard';
  estimatedWeeks: string;
  resumeBullet: string;
  starterGithubIdea?: string;
  milestones?: string[];
}

export interface TokenEfficiencyStats {
  estimatedTokensIngested: number;
  maxTokenConstraint: number;
  efficiencyMethod: string;
  savingsPercentage: string;
}

export interface AnalysisResult {
  paper: PaperMetadata;
  coreConcept: CoreConcept;
  mermaidFlowchart: string;
  rawFlowchartSegment?: string;
  futureWorkOpportunities: FutureWorkOpportunity[];
  tokenEfficiencyStats: TokenEfficiencyStats;
}

export interface SamplePaper {
  id: string;
  title: string;
  authors: string[];
  year: string;
  url: string;
  category: string;
  tags: string[];
  blurb: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
