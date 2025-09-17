import { Shield, Sprout, CheckCircle } from "lucide-react";

export default function Research() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-research">R&D & Advisory</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Defense R&D */}
          <div className="bg-card p-8 rounded-lg border border-border" data-testid="research-defense">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">Defense R&D</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-3" data-testid="research-naval-avatar-title">Naval AI Avatar System</h4>
                <p className="text-muted-foreground mb-3" data-testid="research-naval-avatar-description">
                  Lead developer for real-time AI avatar system with offline capabilities. 
                  Integrated Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS for lip-sync.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-stt-reduction">75% STT latency reduction</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-tts-reduction">52% TTS latency reduction</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-3" data-testid="research-predictive-title">Predictive Maintenance</h4>
                <p className="text-muted-foreground mb-3" data-testid="research-predictive-description">
                  Built anomaly detection pipelines for naval systems using accelerometer data 
                  with features like RMS, FFT, and kurtosis analysis.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-fault-detection">Early fault detection capabilities</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-conference">Presented at defense R&D conference</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Agritech Advisory */}
          <div className="bg-card p-8 rounded-lg border border-border" data-testid="research-agritech">
            <div className="flex items-center gap-3 mb-6">
              <Sprout className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">Agritech Advisory</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-3" data-testid="research-llm-benchmarking-title">LLM Benchmarking</h4>
                <p className="text-muted-foreground mb-3" data-testid="research-llm-benchmarking-description">
                  Conducted comprehensive benchmarking of commercial (OpenAI, Anthropic) and 
                  open-source LLMs (LLaMA, Mistral) for agriculture-specific QA systems.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-bilingual-support">English and Telugu language support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-andhra-cases">Andhra agriculture use cases</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-foreground mb-3" data-testid="research-stt-pipeline-title">Speech-to-Text Pipeline</h4>
                <p className="text-muted-foreground mb-3" data-testid="research-stt-pipeline-description">
                  Designed automated STT fine-tuning pipeline with audio collection, 
                  transcription, and diarization for agriculture-specific vocabulary.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-bilingual-context">Bilingual context support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span data-testid="research-farmer-accuracy">Improved farmer query accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
