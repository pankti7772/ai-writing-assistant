import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  SlidersHorizontal, 
  Users, 
  AlignLeft, 
  FileText, 
  Wand2,
  Cpu
} from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import type { MLCEngineInterface, ChatCompletionMessageParam } from "@mlc-ai/web-llm";

const TONES = ['Formal', 'Casual', 'Persuasive', 'Professional', 'Witty'];
const LENGTHS = ['Short', 'Medium', 'Long'];
const FORMATS = ['Email', 'Blog Post', 'Social Media', 'Essay'];
const MODEL_ID = "Llama-3-8B-Instruct-q4f16_1-MLC"; // Efficient WebGPU compatible model

function App() {
  const [input, setInput] = useState('');
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [audience, setAudience] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // WebLLM Engine State
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initText, setInitText] = useState('Preparing local engine...');
  const initStarted = useRef(false);

  useEffect(() => {
    // Only initialize once
    if (initStarted.current) return;
    initStarted.current = true;

    const initializeEngine = async () => {
      try {
        const mlcEngine = await CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report) => {
            setInitText(report.text);
            // Limit progress to max 100
            setInitProgress(Math.min(100, Math.round(report.progress * 100)));
          },
        });
        
        setEngine(mlcEngine);
        setIsEngineReady(true);
      } catch (error) {
        console.error("Failed to initialize engine:", error);
        setInitText("Initialization failed. Please ensure your browser supports WebGPU.");
      }
    };

    initializeEngine();
  }, []);

  const handleGenerate = async () => {
    if (!input.trim() || !engine) return;
    
    setIsGenerating(true);
    setOutput('');
    
    const targetAudience = audience.trim() || 'general';
    const systemPrompt = `You are an expert writing assistant. Rewrite the user input using a ${tone} tone, specifically formatted as a ${format} for a ${targetAudience} audience. Ensure the length is ${length}.`;
    
    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ];

      const reply = await engine.chat.completions.create({
        messages,
        temperature: 0.7,
      });

      setOutput(reply.choices[0].message.content || "No response generated.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput('An unknown error occurred during generation.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      {/* Loading Overlay */}
      {!isEngineReady && (
        <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <Cpu className="w-10 h-10 text-indigo-600 animate-pulse" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Initializing Local AI</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Loading <span className="font-semibold text-slate-700">Llama 3 (8B)</span> securely into your browser. This happens entirely on your device for absolute privacy.
              </p>
            </div>

            <div className="w-full space-y-2 mt-4">
              <div className="flex justify-between text-xs font-semibold text-slate-600 px-1">
                <span>Downloading Weights...</span>
                <span>{initProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${initProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 h-8 flex items-center justify-center italic">
                {initText}
              </p>
            </div>
          </div>
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Writeasy AI <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-2 align-middle">Local Mode</span></h1>
              <p className="text-sm text-slate-500 font-medium">100% Private WebGPU Assistant</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <h2 className="text-lg font-semibold flex items-center space-x-2 text-slate-800">
                <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
                <span>Control Panel</span>
              </h2>

              {/* Tone Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <span>Tone</span>
                </label>
                <div className="relative">
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer font-medium"
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Length Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <AlignLeft className="w-4 h-4 text-slate-400" />
                  <span>Length</span>
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {LENGTHS.map(l => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        length === l 
                          ? 'bg-white text-indigo-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Format</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-2 px-3 text-sm font-medium rounded-xl border transition-all text-left ${
                        format === f 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Target Audience</span>
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g., Tech enthusiasts, beginners..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Input Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col flex-grow">
              <label className="text-lg font-semibold text-slate-800 mb-4 block">
                What would you like to write about?
              </label>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your rough notes, draft, or just a few ideas here..."
                className="w-full flex-grow min-h-[240px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400 text-base leading-relaxed"
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !input.trim() || !isEngineReady}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-200 overflow-hidden"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Card */}
            {(output || isGenerating) && (
              <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-800">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-indigo-400 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Generated Output</span>
                  </h3>
                  {output && (
                    <button
                      onClick={handleCopy}
                      className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                      <p className="text-slate-400 text-sm font-medium animate-pulse">Running local inference...</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[15px]">
                        {output}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
