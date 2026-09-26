import { AnalysisResult } from '../types';

export const INITIAL_PAPER_ANALYSIS: AnalysisResult = {
  paper: {
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    year: '2017',
    venueOrCategory: 'NeurIPS 2017 / cs.CL',
    primaryDomain: 'Natural Language Processing & Sequence Modeling',
    oneSentencePitch: 'Replaces recurrence and convolutions entirely with multi-head self-attention, establishing the foundational architecture for modern Large Language Models.',
    url: 'https://arxiv.org/abs/1706.03762'
  },
  coreConcept: {
    problemStatement: 'Existing sequence transduction models relied heavily on complex recurrent or convolutional neural networks (RNNs/LSTMs). Their sequential nature prevented parallelization during training and struggled with long-range dependencies because gradient paths grew linearly with sequence length.',
    primaryMethodology: 'The paper introduces the Transformer, an architecture eschewing recurrence entirely in favor of stacked Multi-Head Self-Attention mechanisms combined with sinusoidal Positional Encodings and Pointwise Feed-Forward networks in an encoder-decoder topology.',
    mathematicalAlgorithmicBreakthroughs: 'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V, dividing dot products by sqrt(d_k) to counteract vanishing softmax gradients in high dimensions. Multi-Head Attention projects queries, keys, and values into h lower-dimensional subspaces, allowing the model to jointly attend to information from different representation subspaces at different positions.',
    plainLanguageSummary: 'Before this paper, AI processed sentences like reading one word at a time through a narrow straw (RNNs), which was slow and forgot early words. The Transformer changes this completely: every word looks at every other word simultaneously in one parallel snapshot using "Self-Attention". Scaled dot-product math computes relevance scores between all token pairs at once, while positional encodings retain word order without step-by-step looping.',
    wordCount: 228
  },
  mermaidFlowchart: `graph TD
  subgraph Input_Processing["1. Input & Positional Encoding"]
    In_Tok["Input Tokens [B, S]"] --> In_Emb["Input Embedding [B, S, d_model]"]
    Pos_Enc["Sinusoidal Positional Encoding"] --> In_Sum["Add & Dropout"]
    In_Emb --> In_Sum
  end

  subgraph Encoder_Stack["2. Transformer Encoder Block (Nx)"]
    In_Sum --> Norm1["LayerNorm 1"]
    Norm1 --> QKV_Proj["Q, K, V Linear Projections"]
    QKV_Proj --> MHA["Multi-Head Self-Attention (h heads)"]
    MHA --> ScaledDot["Scaled Dot-Product: softmax(QK^T / sqrt(d_k))V"]
    ScaledDot --> Res1["Residual Connection (+)"]
    Norm1 -.-> Res1
    Res1 --> Norm2["LayerNorm 2"]
    Norm2 --> FFN["Feed-Forward Network (Linear -> ReLU -> Linear)"]
    FFN --> Res2["Residual Connection (+)"]
    Norm2 -.-> Res2
  end

  subgraph Decoder_Stack["3. Transformer Decoder Block (Nx)"]
    Out_Tok["Shifted Output Tokens [B, T]"] --> Out_Emb["Output Embedding"]
    Out_Emb --> Out_Sum["Add Positional Encoding"]
    Out_Sum --> Masked_MHA["Masked Multi-Head Attention (Causal Mask)"]
    Masked_MHA --> Cross_MHA["Cross-Attention (Keys & Values from Encoder)"]
    Res2 --> Cross_MHA
    Cross_MHA --> Dec_FFN["Decoder Feed-Forward Network"]
  end

  subgraph Output_Head["4. Output Generation"]
    Dec_FFN --> Final_Norm["Final LayerNorm"]
    Final_Norm --> Linear_Proj["Linear Projection to Vocab [B, T, V]"]
    Linear_Proj --> Softmax_Out["Softmax -> Token Probabilities"]
  end`,
  rawFlowchartSegment: `[FLOWCHART]
graph TD
  subgraph Input_Processing["1. Input & Positional Encoding"]
    In_Tok["Input Tokens [B, S]"] --> In_Emb["Input Embedding [B, S, d_model]"]
    Pos_Enc["Sinusoidal Positional Encoding"] --> In_Sum["Add & Dropout"]
    In_Emb --> In_Sum
  end

  subgraph Encoder_Stack["2. Transformer Encoder Block (Nx)"]
    In_Sum --> Norm1["LayerNorm 1"]
    Norm1 --> QKV_Proj["Q, K, V Linear Projections"]
    QKV_Proj --> MHA["Multi-Head Self-Attention (h heads)"]
    MHA --> ScaledDot["Scaled Dot-Product: softmax(QK^T / sqrt(d_k))V"]
    ScaledDot --> Res1["Residual Connection (+)"]
    Norm1 -.-> Res1
    Res1 --> Norm2["LayerNorm 2"]
    Norm2 --> FFN["Feed-Forward Network (Linear -> ReLU -> Linear)"]
    FFN --> Res2["Residual Connection (+)"]
    Norm2 -.-> Res2
  end

  subgraph Decoder_Stack["3. Transformer Decoder Block (Nx)"]
    Out_Tok["Shifted Output Tokens [B, T]"] --> Out_Emb["Output Embedding"]
    Out_Emb --> Out_Sum["Add Positional Encoding"]
    Out_Sum --> Masked_MHA["Masked Multi-Head Attention (Causal Mask)"]
    Masked_MHA --> Cross_MHA["Cross-Attention (Keys & Values from Encoder)"]
    Res2 --> Cross_MHA
    Cross_MHA --> Dec_FFN["Decoder Feed-Forward Network"]
  end

  subgraph Output_Head["4. Output Generation"]
    Dec_FFN --> Final_Norm["Final LayerNorm"]
    Final_Norm --> Linear_Proj["Linear Projection to Vocab [B, T, V]"]
    Linear_Proj --> Softmax_Out["Softmax -> Token Probabilities"]
  end`,
  futureWorkOpportunities: [
    {
      id: 1,
      projectTitle: 'Sub-Quadratic Edge-Transformer via Mamba Hybridization',
      exactExtension: 'Replacing the heavy quadratic O(N^2) multi-head attention layers in lower decoder blocks with lightweight bidirectional Mamba/SSM blocks for edge and low-power deployment.',
      targetedPerformanceMetric: '65% reduction in decoding latency and 3.4x lower KV-cache memory consumption on sequences >= 4,096 tokens.',
      recommendedTechStack: ['PyTorch', 'Mamba-SSM', 'ONNX Runtime', 'HuggingFace Transformers'],
      difficultyLevel: 'Intermediate',
      estimatedWeeks: '3-4 weeks',
      resumeBullet: 'Architected a hybrid Transformer-Mamba sequence model in PyTorch; substituted quadratic self-attention layers with hardware-aware selective state space blocks, cutting decoding latency by 65% on Jetson Orin edge devices.',
      starterGithubIdea: 'state-spaces/mamba or huggingface/transformers (Llama-style architecture fork)',
      milestones: [
        'Phase 1: Profile baseline standard Transformer inference latency and memory ceiling across 512, 1024, and 4096 context tokens.',
        'Phase 2: Implement drop-in MambaBlock replacement for alternate Transformer layers using PyTorch autograd.',
        'Phase 3: Evaluate perplexity on WikiText-103 and export quantized ONNX model for mobile deployment.'
      ]
    },
    {
      id: 2,
      projectTitle: 'Flash-Tiled IO-Aware Custom CUDA Attention Kernel',
      exactExtension: 'Re-implementing the scaled dot-product attention step using custom Triton / CUDA kernel tiling (FlashAttention-style) to fuse QK^T matrix multiplication, scaling, masking, and softmax directly in GPU SRAM without writing intermediate N x N matrices back to HBM.',
      targetedPerformanceMetric: '4.2x speedup on backward pass runtime and elimination of O(N^2) memory footprint on consumer GPUs (RTX 4090 / T4).',
      recommendedTechStack: ['Triton', 'CUDA C++', 'PyTorch C++ Extensions', 'NVIDIA Nsight Compute'],
      difficultyLevel: 'Advanced',
      estimatedWeeks: '4-5 weeks',
      resumeBullet: 'Engineered a fused IO-aware attention kernel in OpenAI Triton; eliminated GPU memory bandwidth bottlenecks by tiling softmax computations in SRAM, attaining a 4.2x speedup and zero memory overflow on 8K context lengths.',
      starterGithubIdea: 'openai/triton tutorials & Dao-AILab/flash-attention',
      milestones: [
        'Phase 1: Write Triton fused forward kernel tiling queries into 64x64 blocks with running online softmax normalizer.',
        'Phase 2: Implement custom backward pass recomputing attention matrix on-the-fly during backprop.',
        'Phase 3: Benchmark against torch.nn.functional.scaled_dot_product_attention using PyTorch Benchmark Timer and Nsight.'
      ]
    },
    {
      id: 3,
      projectTitle: 'Int8 Post-Training Quantization with Weight-Activation SVD Decomposition',
      exactExtension: 'Applying structured low-rank adaptation (LoRA) and post-training Int8/FP8 weight-only quantization specifically on the Q, K, V projection matrices and the FFN expansion layer to enable full-precision quality at 1/4th storage footprint.',
      targetedPerformanceMetric: '75% reduction in model disk footprint and 2.1x increase in throughput on memory-constrained client CPUs.',
      recommendedTechStack: ['BitsAndBytes', 'AutoGPTQ', 'PyTorch', 'Intel OpenVINO'],
      difficultyLevel: 'Intermediate',
      estimatedWeeks: '2-3 weeks',
      resumeBullet: 'Quantized Transformer projection weights to Int8 using SmoothQuant and SVD decomposition; preserved 99.2% of full-precision BLEU score while reducing RAM requirements from 16GB to 3.8GB for local deployment.',
      starterGithubIdea: 'TimDettmers/bitsandbytes or mit-han-lab/smoothquant',
      milestones: [
        'Phase 1: Measure layer-wise weight outlier distributions in trained Transformer checkpoints.',
        'Phase 2: Apply activation scaling factors and Int8 dynamic quantization across feedforward layers.',
        'Phase 3: Benchmark end-to-end translation latency and evaluate BLEU score on WMT14 En-De.'
      ]
    }
  ],
  tokenEfficiencyStats: {
    estimatedTokensIngested: 1920,
    maxTokenConstraint: 25000,
    efficiencyMethod: 'arXiv metadata API + selective abstract & architecture synthesis',
    savingsPercentage: '92.3%'
  }
};
