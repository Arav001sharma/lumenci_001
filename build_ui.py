import os

CONTENT = """<!DOCTYPE html>
<html class="light" lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>Lumenci Assistant - Secure Workspace</title>
  
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

  <script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface": "#f7f9fb",
            "surface-container": "#eceef0",
            "surface-container-high": "#e6e8ea",
            "surface-container-lowest": "#ffffff",
            "primary": "#1e40af",
            "primary-container": "#dbeafe",
            "on-primary": "#ffffff",
            "secondary": "#059669",
            "secondary-container": "#c3ccfe",
            "on-surface": "#0f172a",
            "on-surface-variant": "#475569",
            "outline": "#cbd5e1",
            "outline-variant": "#e2e8f0",
            "background": "#f1f5f9"
          },
          fontFamily: {
            "headline": ["Manrope", "Plus Jakarta Sans", "sans-serif"],
            "body": ["Inter", "sans-serif"],
            "label": ["Inter", "sans-serif"]
          },
          boxShadow: {
            'high-end': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            'vibrant': '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -4px rgba(30, 64, 175, 0.1)'
          }
        }
      }
    }
  </script>

  <style>
    body { font-family: 'Inter', sans-serif; min-height: 100vh; }
    h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
    .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
    .hero-pattern { background-image: radial-gradient(circle at 2px 2px, rgba(30, 64, 175, 0.05) 1px, transparent 0); background-size: 24px 24px; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); }
    .message-bubble-ai { background: #ffffff; box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.05), 0 2px 6px -2px rgba(0, 0, 0, 0.05); }
    .message-bubble-user { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.2); }
    .row-hover:hover { transform: scale(1.002); transition: all 0.2s ease; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body class="bg-surface text-on-surface flex flex-col min-h-screen">
  <div id="root" class="flex flex-col flex-1"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    const GEMINI_KEY = "[I WILL ADD LATER]";
    const OPENAI_KEY = "[I WILL ADD LATER]";

    const initialData = [
      { id: 1, element: "A thermostat system comprising:", feature: "Acme SmartTemp base unit", reasoning: "Strong match. The base unit acts as the primary control center." },
      { id: 2, element: "A temperature sensor for detecting ambient temperature;", feature: "Acme TempSensor 2.0 module", reasoning: "Clear equivalence. The TS 2.0 module actively monitors ambient temp." },
      { id: 3, element: "A wireless transmitter to send temperature data to a remote server.", feature: "Acme Wi-Fi transmitter chip", reasoning: "Needs further review. It transmits data, but unclear if it routes to a 'remote server' or local hub.", weak: true },
    ];

    function LoginScreen({ onLogin }) {
      const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
      };
      
      return (
        <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12 bg-surface">
          <div className="w-full max-w-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary to-blue-400"></div>
              <div className="p-8 md:p-10">
                <div className="mb-10 space-y-2 text-center">
                  <div className="flex justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Welcome back</h1>
                  <p className="text-on-surface-variant text-sm font-medium">Sign in to your secure patent workspace</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-[0.05em] font-bold text-on-surface-variant">Work Email</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                          <span className="material-symbols-outlined text-[20px]">mail</span>
                        </div>
                        <input required className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-high border-0 rounded-xl text-on-surface placeholder:text-slate-400 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="name@company.com" type="email" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-[0.05em] font-bold text-on-surface-variant">Password</label>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                          <span className="material-symbols-outlined text-[20px]">lock</span>
                        </div>
                        <input required className="block w-full pl-11 pr-11 py-3.5 bg-surface-container-high border-0 rounded-xl text-on-surface placeholder:text-slate-400 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="••••••••" type="password" />
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-br from-primary to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all" type="submit">
                    Sign In <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      );
    }

    function DashboardScreen({ onSelectProject }) {
      return (
        <div className="min-h-screen pt-4 bg-background">
          <header className="w-full px-8 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
              <span className="font-extrabold text-primary font-headline tracking-tight text-xl">Lumenci</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition" onClick={onSelectProject}>
                <span className="material-symbols-outlined text-sm">add</span> New Analysis
              </button>
            </div>
          </header>
          <main className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-12">
             <h1 className="text-4xl font-extrabold font-headline mb-4">Welcome back, Counselor</h1>
             <p className="text-lg text-slate-500 mb-12">You have 3 active legal analyses in your workspace.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div onClick={onSelectProject} className="cursor-pointer card-hover flex flex-col bg-white p-8 rounded-[2rem] transition-all border border-slate-100 shadow-high-end group">
                 <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">gavel</span>
                   </div>
                   <span className="bg-blue-50 text-primary text-[11px] font-bold px-4 py-1.5 rounded-full border border-blue-100">IN PROGRESS</span>
                 </div>
                 <h3 className="text-xl font-extrabold font-headline text-slate-800 mb-3 hover:text-primary">Patent US123456 vs Acme Corp</h3>
                 <p className="text-sm text-slate-500 mb-8 font-medium">Infringement analysis regarding thermostat hardware capabilities.</p>
                 <div className="mt-auto pt-6 border-t border-slate-50 text-xs text-slate-400 font-bold flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">schedule</span> Last updated 2h ago
                 </div>
               </div>

               {/* Card 2 */}
               <div onClick={onSelectProject} className="cursor-pointer card-hover flex flex-col bg-white p-8 rounded-[2rem] transition-all border border-slate-100 shadow-high-end group">
                 <div className="flex justify-between items-start mb-8">
                   <div className="w-12 h-12 bg-emerald-50 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                     <span className="material-symbols-outlined text-2xl">verified</span>
                   </div>
                   <span className="bg-emerald-50 text-secondary text-[11px] font-bold px-4 py-1.5 rounded-full border border-emerald-100">REVIEW READY</span>
                 </div>
                 <h3 className="text-xl font-extrabold font-headline text-slate-800 mb-3 hover:text-secondary">Patent US789012 vs TechCo Inc</h3>
                 <p className="text-sm text-slate-500 mb-8 font-medium">Final validation of claims related to autonomous logic.</p>
                 <div className="mt-auto pt-6 border-t border-slate-50 text-xs text-slate-400 font-bold flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">schedule</span> Last updated Yesterday
                 </div>
               </div>
             </div>
          </main>
        </div>
      );
    }

    function AnalysisScreen({ onBack }) {
      // APP STATE
      const [chartData, setChartData] = useState(initialData);
      const [history, setHistory] = useState([]);
      
      const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Welcome to Lumenci Assistant. I have loaded the claim chart for US123456. How can I help you refine the analysis today?' }
      ]);
      const [inputText, setInputText] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [acceptedUpdates, setAcceptedUpdates] = useState(new Set());
      const [rejectedUpdates, setRejectedUpdates] = useState(new Set());
      const messagesEndRef = useRef(null);

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      const parseUpdates = (text) => {
        const updateRegex = /<UPDATE>([\s\S]*?)<\/UPDATE>/g;
        let match;
        const updates = [];
        while ((match = updateRegex.exec(text)) !== null) {
          try {
            const json = JSON.parse(match[1].trim());
            updates.push({ json, raw: match[0], id: Math.random().toString(36).substr(2, 9) });
          } catch (e) {
            console.error("Failed to parse update", e);
          }
        }
        return updates;
      }

      const applyUpdate = (updateId, u) => {
        if (acceptedUpdates.has(updateId) || rejectedUpdates.has(updateId)) return;
        setHistory([...history, JSON.parse(JSON.stringify(chartData))]);
        setChartData(prevData => {
          return prevData.map(row => {
            if (row.id === u.json.elementId || row.id == parseInt(u.json.elementId)) {
              return { ...row, [u.json.field]: u.json.newValue, weak: false };
            }
            return row;
          });
        });
        setAcceptedUpdates(new Set([...acceptedUpdates, updateId]));
      };

      const rejectUpdate = (updateId) => {
        setRejectedUpdates(new Set([...rejectedUpdates, updateId]));
      };

      const handleUndo = () => {
        if (history.length > 0) {
          const prevData = history[history.length - 1];
          setChartData(prevData);
          setHistory(history.slice(0, -1));
          return true;
        }
        return false;
      };

      const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;
        
        const userMessage = { role: 'user', content: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        
        if (inputText.toLowerCase().trim() === 'undo') {
          const success = handleUndo();
          setMessages(prev => [...prev, { role: 'assistant', content: success ? 'Last change has been reverted.' : 'Cannot undo further - no previous history found.' }]);
          return;
        }
        
        setIsLoading(true);
        
        const systemPrompt = `You are a patent analyst assistant.
Here is the current claim chart data in JSON format:
${JSON.stringify(chartData, null, 2)}

If the user wants you to update the chart (for instance, editing the reasoning or evidence), you should explain your thought process first. Then, for the actual change you wish to make, output an update tag in exactly this format:
<UPDATE>{"elementId": 1, "field": "reasoning", "newValue": "updated text here"}</UPDATE>

You MUST use valid JSON inside the <UPDATE></UPDATE> block. Valid fields are "element", "feature", and "reasoning". "elementId" must match an existing row ID. You can issue multiple updates at once if needed.`;

        try {
          const conversationText = messages.map(m => m.role + ": " + m.content).join("\n");
          const userMessageText = "user: " + inputText;
          const combinedText = systemPrompt + "\n\n" + (conversationText ? conversationText + "\n" : "") + userMessageText;

          let assistantReply = null;
          let apiError = false;

          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: combinedText }] }]
              })
            });
            const geminiData = await geminiRes.json();
            if (!geminiRes.ok || geminiData.error) throw new Error("Gemini failed");
            assistantReply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          } catch (geminiError) {
            apiError = true;
          }

          if (apiError && OPENAI_KEY.trim() && OPENAI_KEY !== '[I WILL ADD LATER]') {
            try {
              const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { "Authorization": "Bearer " + OPENAI_KEY, "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: (conversationText ? conversationText + "\n" : "") + userMessageText }
                  ]
                })
              });
              const openAiData = await openAiRes.json();
              if (!openAiRes.ok || openAiData.error) throw new Error("OpenAI failed");
              assistantReply = openAiData.choices?.[0]?.message?.content || '';
              apiError = false;
            } catch (openAiError) {
              apiError = true;
            }
          }

          if (apiError || !assistantReply) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Unable to process request. Please check your API keys." }]);
          } else {
            const updates = parseUpdates(assistantReply);
            setMessages(prev => [...prev, { role: 'assistant', content: assistantReply, updates }]);
          }
        } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, { role: 'assistant', content: "Unable to process request. Please check your API keys." }]);
        }
        setIsLoading(false);
      };

      const renderMessageContent = (text, role) => {
        let displayContent = text;
        if (role === 'assistant') displayContent = text.replace(/<UPDATE>([\s\S]*?)<\/UPDATE>/g, '').trim();
        return <p className="whitespace-pre-wrap m-0 leading-relaxed text-[13px]">{displayContent || "I have prepared an update for you."}</p>;
      };

      return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
          <header className="flex justify-between items-center w-full px-8 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace</span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Claim Analysis</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-semibold text-slate-600">Model Active</span>
              </div>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* LEFT PANEL */}
            <section className="flex-1 lg:flex-[1.2] flex flex-col bg-white overflow-hidden relative border-r border-slate-100">
              <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden">
                <div className="mb-6 shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Patent: US123456</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Acme Thermostat Comparison</h2>
                </div>

                <div className="flex-1 overflow-auto -mx-2 px-2">
                  <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left hidden md:table-row">
                        <th className="px-6 pb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Claim Element</th>
                        <th className="px-6 pb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Technical Evidence</th>
                        <th className="px-6 pb-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 w-1/4">Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-4">
                      {chartData.map((row) => (
                        <tr key={row.id} className={`row-hover group border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] rounded-2xl md:rounded-2xl flex flex-col md:table-row mb-4 md:mb-0 ${row.weak ? 'bg-amber-50/30 border-amber-100 shadow-[0_2px_10px_-4px_rgba(245,158,11,0.2)]' : 'bg-white border-slate-100'}`}>
                          <td className={`p-4 md:px-6 md:py-6 md:first:rounded-l-2xl border-y border-x md:border-r-0 md:border-l ${row.weak ? 'border-amber-100/50' : 'border-slate-100'}`}>
                            <span className="md:hidden text-[10px] uppercase font-bold text-slate-400 block mb-1">Claim Element</span>
                            <p className="text-sm leading-relaxed text-slate-700 font-medium">{row.element}</p>
                          </td>
                          <td className={`p-4 md:px-6 md:py-6 border-y border-x md:border-x-0 ${row.weak ? 'border-amber-100/50' : 'border-slate-100'}`}>
                            <span className="md:hidden text-[10px] uppercase font-bold text-slate-400 block mb-1">Evidence</span>
                            <p className="text-sm leading-relaxed text-slate-600">{row.feature}</p>
                          </td>
                          <td className={`p-4 md:px-6 md:py-6 md:last:rounded-r-2xl border-y border-x md:border-l-0 md:border-r ${row.weak ? 'border-amber-100/50' : 'border-slate-100'}`}>
                            <span className="md:hidden text-[10px] uppercase font-bold text-slate-400 block mb-1">Assessment</span>
                            <div className="flex flex-col gap-1.5">
                              {row.weak ? (
                                <div className="flex items-center gap-1.5 text-amber-600">
                                   <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>error</span>
                                   <span className="text-xs font-bold uppercase tracking-wider block">Ambiguous</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-emerald-600">
                                   <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                                   <span className="text-xs font-bold uppercase tracking-wider block">Strong Match</span>
                                </div>
                              )}
                              <p className={`text-[11px] font-medium leading-relaxed ${row.weak ? 'text-amber-700/60' : 'text-slate-400'}`}>{row.reasoning}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 pt-4 md:mt-8 md:pt-6 border-t border-slate-100 shrink-0">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm transition-all hover:bg-blue-800 shadow-lg shadow-blue-900/10 active:scale-95">
                    <span className="material-symbols-outlined text-sm">download</span> Export Analysis
                  </button>
                </div>
              </div>
            </section>

            {/* RIGHT PANEL: AI Chat */}
            <section className="flex-1 lg:flex-[0.8] flex flex-col bg-slate-50 overflow-hidden relative">
              <div className="p-4 md:p-6 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-xl">smart_toy</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">AI Analyst Assistant</h3>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Expert Mode</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 md:gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''}`}>
                    <div className={`${msg.role === 'user' ? 'message-bubble-user rounded-tr-none text-white' : 'message-bubble-ai border-slate-100 rounded-tl-none text-slate-700'} p-3 md:p-4 rounded-2xl border`}>
                      {renderMessageContent(msg.content, msg.role)}
                      
                      {msg.updates && msg.updates.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                           {msg.updates.map((u, uidx) => {
                             const isAccepted = acceptedUpdates.has(u.id);
                             const isRejected = rejectedUpdates.has(u.id);
                             return (
                               <div key={uidx} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                                 <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
                                   <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
                                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Update (Element {u.json.elementId})</span>
                                 </div>
                                 <p className="text-secondary text-xs font-semibold mb-1">Proposed {u.json.field}:</p>
                                 <p className="text-sm text-slate-700 mb-3 bg-white p-2 border border-slate-100 rounded">{u.json.newValue}</p>
                                 {(!isAccepted && !isRejected) && (
                                   <div className="flex gap-2">
                                     <button onClick={() => applyUpdate(u.id, u)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-all shadow-md">
                                       Accept
                                     </button>
                                     <button onClick={() => rejectUpdate(u.id)} className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-300 transition-all">
                                       Dismiss
                                     </button>
                                   </div>
                                 )}
                                 {isAccepted && <span className="text-xs text-emerald-600 font-bold">✓ Applied to chart</span>}
                                 {isRejected && <span className="text-xs text-red-600 font-bold">✗ Dismissed</span>}
                               </div>
                             );
                           })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 max-w-[90%]">
                    <div className="message-bubble-ai border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-500 text-sm">
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 md:p-6 bg-white border-t border-slate-200/50 shrink-0">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner relative">
                  <div className="flex items-center gap-3 px-2">
                    <input 
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-900 placeholder:text-slate-400" 
                      placeholder="Ask AI to refine arguments or type 'undo'..." 
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputText.trim()}
                      className={`h-10 w-10 text-white rounded-xl flex items-center justify-center transition-all ${isLoading || !inputText.trim() ? 'bg-blue-300' : 'bg-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'}`}
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      );
    }

    function AppController() {
      const [currentScreen, setCurrentScreen] = useState('login');
      if (currentScreen === 'login') return <LoginScreen onLogin={() => setCurrentScreen('dashboard')} />;
      if (currentScreen === 'dashboard') return <DashboardScreen onSelectProject={() => setCurrentScreen('analysis')} />;
      return <AnalysisScreen onBack={() => setCurrentScreen('dashboard')} />;
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<AppController />);
  </script>
</body>
</html>
"""

with open('/Users/aravsharma/Desktop/lumenci-assistant/index_test.html', 'w', encoding='utf-8') as f:
    f.write(CONTENT)
