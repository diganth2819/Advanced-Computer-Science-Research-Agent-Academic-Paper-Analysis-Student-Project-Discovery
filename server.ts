import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialise GoogleGenAI according to skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to extract arXiv ID
function extractArxivId(input: string): string | null {
  const match = input.match(/(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([0-9]{4}\.[0-9]{4,5}(?:v[0-9]+)?)/i);
  return match ? match[1] : null;
}

// Fetch arXiv metadata via export.arxiv.org API
async function fetchArxivMetadata(arxivId: string) {
  try {
    const cleanId = arxivId.replace(/v[0-9]+$/, '');
    const apiUrl = `https://export.arxiv.org/api/query?id_list=${cleanId}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const xml = await res.text();
    
    // Parse title, summary, authors from XML
    const titleMatch = xml.match(/<title>([\s\S]*?)<\/title>/g);
    const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/);
    const authorMatches = [...xml.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)];
    const publishedMatch = xml.match(/<published>([\s\S]*?)<\/published>/);
    
    // The first <title> is usually the feed title, second is entry title
    let title = '';
    if (titleMatch && titleMatch.length > 1) {
      title = titleMatch[1].replace(/<\/?title>/g, '').trim().replace(/\s+/g, ' ');
    } else if (titleMatch && titleMatch.length === 1) {
      title = titleMatch[0].replace(/<\/?title>/g, '').trim().replace(/\s+/g, ' ');
    }

    const abstract = summaryMatch ? summaryMatch[1].trim().replace(/\s+/g, ' ') : '';
    const authors = authorMatches.map(m => m[1].trim()).slice(0, 8);
    const published = publishedMatch ? publishedMatch[1].trim().slice(0, 10) : '';

    if (title && abstract) {
      return { title, abstract, authors, published, arxivId };
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch from arXiv API:', err);
    return null;
  }
}

// Landmark Sample Papers catalog
const SAMPLE_PAPERS = [
  {
    id: 'attention',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'et al.'],
    year: '2017',
    url: 'https://arxiv.org/abs/1706.03762',
    category: 'Computation and Language (cs.CL)',
    tags: ['Transformer', 'Self-Attention', 'NLP', 'Foundational'],
    blurb: 'Replaces recurrence and convolutions entirely with multi-head self-attention mechanisms, spawning modern LLMs.'
  },
  {
    id: 'mamba',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    authors: ['Albert Gu', 'Tri Dao'],
    year: '2023',
    url: 'https://arxiv.org/abs/2312.00752',
    category: 'Machine Learning (cs.LG)',
    tags: ['SSM', 'Linear Time', 'Selective State Space', 'Edge AI'],
    blurb: 'Hardware-aware selective state space model achieving 5x throughput of Transformers with linear O(N) context scaling.'
  },
  {
    id: 'deepseek-r1',
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    authors: ['DeepSeek-AI', 'Daya Guo', 'Dejian Yang', 'Haowei Zhang', 'et al.'],
    year: '2025',
    url: 'https://arxiv.org/abs/2501.12948',
    category: 'Artificial Intelligence (cs.AI)',
    tags: ['Reasoning', 'Pure RL', 'GRPO', 'Distillation'],
    blurb: 'Explores pure reinforcement learning (GRPO) without cold-start SFT to elicit emergence of sophisticated multi-step reasoning.'
  },
  {
    id: 'lora',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'et al.'],
    year: '2021',
    url: 'https://arxiv.org/abs/2106.09685',
    category: 'Machine Learning (cs.LG)',
    tags: ['PEFT', 'Low Rank', 'Fine-Tuning', 'Efficiency'],
    blurb: 'Freezes pre-trained model weights and injects trainable rank decomposition matrices, reducing trainable parameters by 10,000x.'
  },
  {
    id: 'flashattention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    authors: ['Tri Dao', 'Daniel Y. Fu', 'Stefano Ermon', 'Atri Rudra', 'Christopher Ré'],
    year: '2022',
    url: 'https://arxiv.org/abs/2205.14135',
    category: 'Machine Learning (cs.LG)',
    tags: ['Systems', 'GPU SRAM', 'Tiling', 'Kernel Optimization'],
    blurb: 'IO-aware exact attention algorithm tiling computation across GPU SRAM and HBM to eliminate memory-bound bottlenecks.'
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: ['Patrick Lewis', 'Ethan Perez', 'Aleksandra Piktus', 'Fabio Petroni', 'et al.'],
    year: '2020',
    url: 'https://arxiv.org/abs/2005.11401',
    category: 'Computation and Language (cs.CL)',
    tags: ['RAG', 'Dense Retrieval', 'Knowledge Base', 'DPR'],
    blurb: 'Combines pre-trained parametric memory with non-parametric dense vector index for factual generation with attribution.'
  }
];

// Endpoint: Sample papers
app.get('/api/sample-papers', (_req, res) => {
  res.json({ papers: SAMPLE_PAPERS });
});

// Endpoint: Analyze Paper
app.post('/api/analyze-paper', async (req, res) => {
  try {
    const { url, titleOrText } = req.body;

    if (!url && !titleOrText) {
      return res.status(400).json({ error: 'Please provide a research paper URL, title, or text.' });
    }

    let resolvedTitle = titleOrText || '';
    let resolvedAbstract = '';
    let authors: string[] = [];
    let arxivId: string | null = null;
    let publishDate = '';

    if (url) {
      arxivId = extractArxivId(url);
      if (arxivId) {
        const meta = await fetchArxivMetadata(arxivId);
        if (meta) {
          resolvedTitle = meta.title;
          resolvedAbstract = meta.abstract;
          authors = meta.authors;
          publishDate = meta.published;
        }
      }
    }

    // Prepare system instructions and prompt enforcing operational constraints
    const systemInstruction = `You are an advanced Computer Science Research Agent specializing in parsing academic papers, extracting system architectures, and identifying student developer opportunities.

OPERATIONAL CONSTRAINTS:
- You must always prioritize token efficiency. Ensure your total analysis and tool execution stays well under 25,000 tokens - if a paper is too long to ingest entirely, use the Web Search tool to look up summaries, abstracts, and open-source implementations (e.g. GitHub) of the paper's title to gather context efficiently.

When a user provides a research paper URL or title, execute these steps:
1. CORE CONCEPT EXTRACTION:
Summarize the problem statement, the primary methodology introduced, and the key mathematical/algorithmic breakthroughs in under 300 words using plain, accessible language.
2. ARCHITECTURAL FLOWCHART (Mermaid.js):
Generate a clean, syntactically correct Mermaid.js flowchart (graph TD) that charts the components, data inputs, model layers, and data outputs of the system described in the paper. Do not use Markdown code blocks inside the Mermaid string itself; output it as a clear text segment labeled [FLOWCHART].
3. FUTURE WORK & INTERNSHIP OPPORTUNITIES:
Brainstorm 3 concrete, realistic ways a 3rd-year CS student could build upon, extend, or optimize this paper for a resume project. For each idea provide:
- The exact extension (e.g., "Replacing the heavy transformer layer with a lightweight Mamba block for edge deployment")
- The targeted performance metric (e.g., latency reduction, accuracy trade-off)
- The recommended tech stack (e.g., PyTorch, ONNX Runtime).

Respond with valid JSON conforming to the following structure so the research workbench can render diagrams, badges, and code:
{
  "paper": {
    "title": "Full accurate title of the paper",
    "authors": ["Author 1", "Author 2"],
    "year": "2024",
    "venueOrCategory": "Conference or arXiv category",
    "primaryDomain": "e.g. LLM Reasoning / Systems ML / Model Compression",
    "oneSentencePitch": "High-impact 1-sentence summary"
  },
  "coreConcept": {
    "problemStatement": "Clear problem statement in plain language (what was broken or inefficient)",
    "primaryMethodology": "The primary methodology introduced to solve it",
    "mathematicalAlgorithmicBreakthroughs": "The key mathematical or algorithmic breakthroughs (formulations, loss functions, recurrence vs convolution, IO-tiling, etc.)",
    "plainLanguageSummary": "Under 300 words total synthesizing problem, method, and breakthrough in accessible language",
    "wordCount": 240
  },
  "mermaidFlowchart": "graph TD\\n  ...clean syntactically correct Mermaid graph TD code without markdown ticks or backticks inside...",
  "futureWorkOpportunities": [
    {
      "id": 1,
      "projectTitle": "Clear, catchy project title for student resume",
      "exactExtension": "Exact extension described clearly (e.g. Replacing X with Y)",
      "targetedPerformanceMetric": "Targeted performance metric (e.g. 40% memory reduction, latency, FLOPs)",
      "recommendedTechStack": ["PyTorch", "vLLM", "Triton"],
      "difficultyLevel": "Intermediate | Advanced | Hard",
      "estimatedWeeks": "3-4 weeks",
      "resumeBullet": "Engineered [Extension] using [TechStack], achieving [Metric] benchmarked on [Dataset]...",
      "starterGithubIdea": "Recommended base repository or baseline repo to fork",
      "milestones": [
        "Phase 1: Setup baseline and benchmark pipeline",
        "Phase 2: Implement custom kernel or layer replacement",
        "Phase 3: Evaluate latency and accuracy Pareto frontier"
      ]
    }
  ],
  "tokenEfficiencyStats": {
    "estimatedTokensIngested": 1850,
    "maxTokenConstraint": 25000,
    "efficiencyMethod": "Abstract + arXiv metadata + targeted search synthesis",
    "savingsPercentage": "92.6%"
  }
}`;

    const promptContext = `Analyze the following academic paper:
URL: ${url || 'N/A'}
arXiv ID: ${arxivId || 'N/A'}
Paper Title / Input: ${resolvedTitle || 'Derive from URL'}
Fetched Abstract / Snippet: ${resolvedAbstract ? resolvedAbstract.slice(0, 3000) : 'None provided; use Google Search tool to search for paper title, official repository, and architecture.'}

Follow all instructions. Make sure the Mermaid flowchart is strictly valid syntax with graph TD, proper node shapes like [text] or (text) or [(database)], and arrows -->. Avoid parenthesis or quotes inside node labels that break Mermaid parsing (use brackets or sanitized text). Ensure the future work has exactly 3 realistic, high-impact resume projects for a 3rd-year CS student.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContext,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean JSON formatting if markdown blocks appeared
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse agent response as structured JSON');
      }
    }

    // Fallbacks if arXiv metadata gave better title/authors
    if (resolvedTitle && (!parsedData.paper?.title || parsedData.paper?.title.length < 5)) {
      parsedData.paper = parsedData.paper || {};
      parsedData.paper.title = resolvedTitle;
    }
    if (authors.length > 0 && (!parsedData.paper?.authors || parsedData.paper.authors.length === 0)) {
      parsedData.paper = parsedData.paper || {};
      parsedData.paper.authors = authors;
    }

    // Ensure raw [FLOWCHART] string representation is also preserved as per spec
    let rawFlowchart = parsedData.mermaidFlowchart || '';
    // Clean any backticks if present
    rawFlowchart = rawFlowchart.replace(/^```mermaid\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    parsedData.mermaidFlowchart = rawFlowchart;
    parsedData.rawFlowchartSegment = `[FLOWCHART]\n${rawFlowchart}`;

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/analyze-paper:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while analyzing the academic paper.',
    });
  }
});

// Endpoint: Interrogate / Deep-Dive into the paper
app.post('/api/interrogate-paper', async (req, res) => {
  try {
    const { question, paperTitle, paperContext, conversationHistory } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const systemInstruction = `You are an advanced Computer Science Research Agent specializing in academic papers, system architectures, mathematical formulations, and engineering implementations.
You are assisting a Computer Science student or researcher in understanding the paper "${paperTitle || 'the paper'}".
Keep answers clear, technically precise, and actionable (e.g. providing PyTorch code snippets, mathematical derivations, ablation insights, or interview explanations when relevant).
Maintain operational token efficiency.`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Paper Context:
${paperContext || 'Paper under discussion: ' + paperTitle}

User Question: ${question}`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in /api/interrogate-paper:', error);
    res.status(500).json({ error: error.message || 'Failed to generate answer.' });
  }
});

// Vite Middleware for Development / Static for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`PaperArchitect Research Agent running on http://localhost:${port}`);
  });
}

startServer();
