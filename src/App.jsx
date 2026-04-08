import React, { useState, useEffect, useRef } from 'react';

// ---- MOCK DATA ----
const initialData = [
  { id: 1, element: 'A network-connected thermostat comprising a temperature sensor...', feature: "Exhibit A, Page 12: 'The Nest Learning Thermostat includes an integrated Wi-Fi chip and 1% precision sensors...'", reasoning: "Strong match. The base unit acts as the primary control center.", weak: false },
  { id: 2, element: 'A remote server configured to receive and analyze temperature profiles...', feature: "AWS IoT Core metrics documenting daily syncing of local temperature readings.", reasoning: "Clear equivalence. The TS 2.0 module actively monitors ambient temp.", weak: false },
  { id: 3, element: 'A predictive algorithm that preemptively adjusts HVAC schedules...', feature: "Section 4.1 'Smart Schedule' patent description detailing predictive pre-cooling.", reasoning: "Needs further review. It transmits data, but unclear if it routes to a 'remote server' or local hub.", weak: true },
];

const mockExports = [
  { id: 1, name: 'Claim Chart - Thermostat v4', case: '#8821-APP • Patent Analysis', status: 'COMPLETED' },
  { id: 2, name: 'Deposition Summary - Wright v. Corp', case: '#9012-LIT • Litigation Support', status: 'PROCESSING' },
  { id: 3, name: 'Prior Art Review - Microfluidics Alpha', case: '#7745-PAT • R&D Discovery', status: 'COMPLETED' },
  { id: 4, name: 'Contract Addendum - Section 4B', case: '#1102-CTR • Compliance', status: 'FAILED' },
];

// ---- ICONS ----
const Icons = {
  Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>,
  Brain: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>,
  FormatList: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>,
  Archive: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21H4V10h2v9h12v-9h2v11zM3 3h18v6H3V3zm2 2v2h14V5H5zm8 4h-2v3H8l4 4 4-4h-3V9z"/></svg>,
  UploadFile: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>,
  CloudUpload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.61 5.64 5.36 8.04 2.34 8.36 0 10.9 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>,
  Export: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>,
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>,
  Gavel: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h12v2H1zM5.24 8.07l2.83-2.83 14.14 14.14-2.83 2.83L5.24 8.07zM12.32 1l5.66 5.66-2.83 2.83-5.66-5.66L12.32 1zM3.83 9.48l5.66 5.66-2.83 2.83-5.66-5.66 2.83-2.83z"/></svg>
};

// ---- MAIN COMPONENTS ----

const Sidebar = ({ currentView, setView }) => {
  const tabs = [
    { id: 'workspace', icon: Icons.Grid, label: 'Workspace' },
    { id: 'intelligence', icon: Icons.Brain, label: 'Intelligence' },
    { id: 'claims', icon: Icons.FormatList, label: 'Claims' },
    { id: 'archive', icon: Icons.Archive, label: 'Archive' }
  ];

  return (
    <div className="w-20 md:w-24 bg-sidebar-bg flex flex-col items-center py-6 h-screen shrink-0 text-white shadow-2xl z-20 sticky top-0 border-r border-sidebar-hover">
      <div className="mb-8 font-extrabold text-[10px] md:text-sm tracking-widest uppercase">LUMENCI</div>
      
      <div className="flex flex-col gap-6 w-full mt-4 flex-1">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setView(tab.id === 'workspace' ? 'initialize' : tab.id === 'intelligence' ? 'analysis' : tab.id === 'archive' ? 'export_history' : tab.id)}
            className={`flex flex-col items-center justify-center w-full py-4 gap-2 transition-all relative ${
              (currentView === 'initialize' && tab.id === 'workspace') || 
              (currentView === 'analysis' && tab.id === 'intelligence') ||
              (currentView === 'export_history' && tab.id === 'archive')
                ? 'bg-sidebar-active text-white shadow-inner before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white' 
                : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
            }`}
          >
            <tab.icon />
            <span className="text-[9px] md:text-[11px] font-bold tracking-wider uppercase">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-6 w-full">
        <button className="text-slate-400 hover:text-white p-2">
          <Icons.Settings />
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-slate-600 overflow-hidden cursor-pointer hover:border-slate-400 transition-colors">
          <img src="https://i.pravatar.cc/100?img=11" alt="User Avatar" className="w-full h-full object-cover"/>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }) => (
  <div className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <div className="flex items-center gap-3">
      <Icons.Gavel className="text-primary-DEFAULT" />
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lumenci Assistant</h1>
    </div>
    <button className="bg-primary-DEFAULT hover:bg-primary-hover text-white rounded-lg px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
      <Icons.Export /> Export
    </button>
  </div>
);

// VIEW 1: Initialize Analysis
const InitializeAnalysisView = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-6 py-12">
    <div className="text-center mb-10 w-full animate-fade-in">
      <p className="text-primary-DEFAULT font-bold text-[11px] uppercase tracking-widest mb-3">Precision Intelligence</p>
      <h2 className="text-5xl font-extrabold text-slate-900 mb-6 leading-tight">Initialize<br/>Patent<br/>Analysis</h2>
      <p className="text-slate-600 text-[15px] max-w-md mx-auto leading-relaxed">
        Prepare your intelligence workflow by uploading technical assets. Our engine extracts claims and product specifications with surgical precision.
      </p>
    </div>

    <div className="w-full space-y-6">
      {/* Upload 1 */}
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center text-center hover:border-primary-DEFAULT hover:bg-blue-50/30 transition-colors cursor-pointer group">
        <div className="bg-blue-100 text-primary-DEFAULT p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
          <Icons.UploadFile />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">Upload Claim Chart</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Import mapping structures via CSV, Word, or direct text paste.</p>
        <div className="flex gap-2 mb-6">
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">CSV</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">DOCX</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">PASTE</span>
        </div>
        <span className="text-primary-DEFAULT font-bold text-sm flex items-center gap-1 group-hover:underline">Select source →</span>
      </div>

      {/* Upload 2 */}
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center text-center hover:border-primary-DEFAULT hover:bg-blue-50/30 transition-colors cursor-pointer group">
        <div className="bg-purple-100 text-purple-600 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
          <Icons.CloudUpload />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">Upload Product Documents</h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Index technical specifications, PDF whitepapers, or live product URLs.</p>
        <div className="flex gap-2 mb-6">
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">PDF</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">HTTPS://</span>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">ZIP</span>
        </div>
        <span className="text-primary-DEFAULT font-bold text-sm flex items-center gap-1 group-hover:underline">Browse assets →</span>
      </div>
    </div>

    <button 
      onClick={onStart}
      className="mt-8 bg-primary-DEFAULT hover:bg-primary-hover text-white w-full max-w-sm rounded-xl py-4 font-bold text-lg shadow-xl shadow-primary-DEFAULT/20 flex items-center justify-center gap-2 transition-all active:scale-95"
    >
      Start Analysis <Icons.Gavel/>
    </button>
  </div>
);

// VIEW 2: Claim Chart Analysis (Main Dashboard)
const ClaimChartAnalysisView = ({ chartData }) => {
  return (
    <div className="h-full bg-background overflow-hidden flex flex-col p-8">
      <div className="max-w-4xl w-full mx-auto flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-200 bg-white shrink-0">
          <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500 mb-2">Project: Smart Thermostat V4</p>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Claim Chart<br/>Analysis</h2>
            <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="p-4 pl-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">Patent Claim Element</div>
          <div className="p-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 border-l border-slate-200">Evidence</div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {chartData.map((row, idx) => (
            <div key={row.id} className="grid grid-cols-2 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 py-4 group">
              <div className="pl-8 pr-6 pt-2">
                <span className="text-primary-DEFAULT font-semibold block mb-3 text-lg">Element 1.{row.id}</span>
                <p className="text-[15px] leading-relaxed text-slate-700 font-medium">"{row.element}"</p>
              </div>
              <div className="px-6 pt-2 border-l border-slate-100 relative">
                {row.weak ? (
                  <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-[4px] text-[10px] font-bold mb-3 uppercase tracking-wider">UNRESOLVED</span>
                ) : (
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-[4px] text-[10px] font-bold mb-3 uppercase tracking-wider">STRONG</span>
                )}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 mt-1">
                  <p className="text-[14px] leading-relaxed text-slate-600 italic">"{row.feature}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// VIEW 3: Export History
const ExportHistoryView = () => {
  return (
    <div className="h-full w-full bg-background overflow-hidden flex flex-col p-8">
      <div className="max-w-[1000px] w-full mx-auto flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-8 shrink-0">
          <button className="text-slate-500 hover:text-slate-900"><Icons.Menu /></button>
          <h2 className="text-2xl font-bold text-slate-900">Export History</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-6 shrink-0">
          <div className="flex-1 min-w-[250px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Search Documents</label>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search by case or document name" className="w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-primary-DEFAULT focus:ring-1 focus:ring-primary-DEFAULT transition-all text-slate-900" />
            </div>
          </div>
          <div className="w-[180px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Date Range</label>
            <select className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold focus:outline-none focus:border-primary-DEFAULT text-slate-700 appearance-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="w-[180px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">File Type</label>
            <select className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm font-semibold focus:outline-none focus:border-primary-DEFAULT text-slate-700 appearance-none">
              <option>PDF, DOCX</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Exports</span>
            <span className="text-4xl font-extrabold text-primary-DEFAULT">128</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Files</span>
            <span className="text-4xl font-extrabold text-slate-700">12</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg. Size</span>
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">2.4 <span className="text-lg text-slate-400 font-bold ml-1">MB</span></span>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Storage Used</span>
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">84 <span className="text-lg text-slate-400 font-bold ml-1">%</span></span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Document Identity</span>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pr-4">Status Actions</span>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {mockExports.map((exp) => (
            <div key={exp.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-xl flex items-center justify-center ${exp.status === 'FAILED' ? 'bg-red-50 text-red-500' : 'bg-blue-100 text-primary-DEFAULT'}`}>
                  {exp.status === 'FAILED' ? (
                   <span className="material-symbols-outlined font-bold text-xl">error</span>
                  ) : (
                   <span className="material-symbols-outlined font-bold text-xl">description</span>
                  )}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 mb-1">{exp.name}</h4>
                  <p className="text-xs font-semibold text-slate-500">{exp.case}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {exp.status === 'COMPLETED' && <span className="text-[10px] font-extrabold text-green-700 bg-green-100 px-3 py-1 rounded-md uppercase tracking-wider">COMPLETED</span>}
                {exp.status === 'PROCESSING' && <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-3 py-1 rounded-md uppercase tracking-wider">PROCESSING</span>}
                {exp.status === 'FAILED' && <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-3 py-1 rounded-md uppercase tracking-wider">FAILED</span>}

                <div className="flex space-x-3 text-slate-400">
                  <button className="hover:text-primary-DEFAULT transition-colors"><span className="material-symbols-outlined">download</span></button>
                  <button className="hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Refinement Intelligence Panel (Right Sidebar)
const RefinementIntelligencePanel = ({ messages, inputText, setInputText, sendMessage, isLoading, acceptedUpdates, applyUpdate, rejectUpdate }) => {
  const renderMessageContent = (text, role) => {
    let displayContent = text;
    if (role === 'assistant') {
      displayContent = text.replace(/<UPDATE>([\s\S]*?)<\/UPDATE>/g, '').trim();
    }
    return <p className="text-[13px] leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">{displayContent}</p>;
  };

  return (
    <div className="w-[360px] bg-assistant-bg flex flex-col h-full shrink-0 border-l border-assistant-border shadow-[-10px_0_30px_rgba(0,0,0,0.1)] relative z-30 pt-[72px]">
      
      {/* Panel Header */}
      <div className="absolute top-0 left-0 right-0 h-[72px] border-b border-assistant-border bg-assistant-bg flex items-center px-6 gap-4 z-40">
        <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
          <Icons.Brain />
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-white tracking-wide">Refinement<br/>Intelligence</h3>
        </div>
      </div>

      <div className="p-6 border-b border-assistant-border bg-assistant-bg">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
        <p className="text-xs text-green-400 font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active Analysis Session</p>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-6 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            {msg.role === 'user' ? (
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 ml-auto max-w-[90%] shadow-lg">
                 <p className="text-[13px] text-white leading-relaxed">{msg.content}</p>
              </div>
            ) : (
              <div className="bg-[#1A1D2D] p-5 rounded-2xl border border-[#2B2F42] w-full shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Brain className="text-blue-400 border border-blue-900/50 rounded p-0.5" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI Analyst</span>
                </div>
                {renderMessageContent(msg.content, msg.role)}

                {msg.updates && msg.updates.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {msg.updates.map((u, uidx) => {
                      const isAccepted = acceptedUpdates.has(u.id);
                      return (
                        <div key={uidx} className="bg-[#242A3D] rounded-xl overflow-hidden border border-[#3A415C]">
                           <div className="p-3 bg-[#1D2235] border-b border-[#3A415C] flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</span>
                              <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">Proposed update</span>
                           </div>
                           <div className="p-4">
                              <p className="text-xs text-slate-400 mb-3">Updating <span className="text-blue-400 font-bold">Element {u.json.elementId}</span> reasoning:</p>
                              <div className="bg-[#1A1D2D] p-3 rounded border border-[#2B2F42] text-[12px] text-slate-300 leading-relaxed mb-4">
                                {u.json.newValue}
                              </div>
                              {!isAccepted ? (
                                <div className="flex gap-2">
                                  <button onClick={() => applyUpdate(u.id, u)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-lg transition-colors">Apply Change</button>
                                  <button onClick={() => rejectUpdate(u.id)} className="px-3 bg-transparent border border-slate-600 hover:bg-slate-800 text-slate-400 rounded-lg text-xs font-bold transition-colors">Dismiss</button>
                                </div>
                              ) : (
                                <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest text-center py-1">Change Applied ✓</p>
                              )}
                           </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-[#1A1D2D] p-4 rounded-xl border border-[#2B2F42] w-[200px] flex gap-2 items-center text-slate-400 text-xs font-bold shadow-lg">
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
             <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
             <span className="ml-2">Processing...</span>
          </div>
        )}
      </div>

      <div className="p-6 bg-assistant-bg border-t border-assistant-border shrink-0">
        <div className="bg-[#1A1D2D] rounded-xl p-2 flex border border-[#2B2F42] focus-within:border-blue-500 transition-colors shadow-inner">
          <input 
            type="text" 
            placeholder="Continue refining..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white px-3 placeholder-slate-600"
          />
          <button 
            onClick={sendMessage}
            className="bg-primary-DEFAULT hover:bg-primary-hover p-2.5 rounded-lg text-white transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('initialize'); // initialize | analysis | export_history
  
  // ---- AI APP STATE ----
  const [chartData, setChartData] = useState(initialData);
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I've successfully loaded the claim chart data. How would you like to refine the element mappings today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedUpdates, setAcceptedUpdates] = useState(new Set());
  const [rejectedUpdates, setRejectedUpdates] = useState(new Set());

  // Helper logic ported strictly
  const parseUpdates = (text) => {
    const updateRegex = /<UPDATE>([\s\S]*?)<\/UPDATE>/g;
    let match;
    const updates = [];
    while ((match = updateRegex.exec(text)) !== null) {
      try {
        const json = JSON.parse(match[1]);
        updates.push({ json, raw: match[0], id: Math.random().toString(36).substr(2, 9) });
      } catch (e) { console.error("Failed to parse update", e); }
    }
    return updates;
  }

  const applyUpdate = (updateId, u) => {
    if (acceptedUpdates.has(updateId)) return;
    setHistory([...history, JSON.parse(JSON.stringify(chartData))]);
    setChartData(prevData => prevData.map(row => {
      // Force match ID whether sting or number
      if (row.id == u.json.elementId) {
        return { ...row, [u.json.field]: u.json.newValue, weak: false };
      }
      return row;
    }));
    setAcceptedUpdates(new Set([...acceptedUpdates, updateId]));
  };

  const rejectUpdate = (updateId) => setRejectedUpdates(new Set([...rejectedUpdates, updateId]));

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    const userMessage = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const systemPrompt = `You are a patent analyst assistant. Current claim chart data in JSON format:
${JSON.stringify(chartData, null, 2)}
Output an update tag exactly like this: <UPDATE>{"elementId": 1, "field": "reasoning", "newValue": "updated text here"}</UPDATE>
Only valid fields: "element", "feature", "reasoning".`;

    try {
      // Mock logic to simulate response since API keys aren't passed here
      // Replace with real Gemini/OpenAI endpoints as in the original file
      setTimeout(() => {
         const mockReply = "Based on your request, I've refined the reasoning for Element 3 to incorporate the predictive pre-cooling specifications found in the supplementary documentation. \n<UPDATE>{\"elementId\": 3, \"field\": \"reasoning\", \"newValue\": \"Confirmed match: the predictive pre-cooling schedule actively sends telemetry directly to remote hubs, satisfying the remote server requirement.\"}</UPDATE>";
         const updates = parseUpdates(mockReply);
         setMessages(prev => [...prev, { role: 'assistant', content: mockReply, updates }]);
         setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background font-sans text-slate-900 selection:bg-primary-DEFAULT selection:text-white">
      {/* LEFT SIDEBAR */}
      <Sidebar currentView={view} setView={setView} />
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex-1 relative flex overflow-hidden">
           
           {/* Dynamic Views */}
           <div className="flex-1 overflow-y-auto">
             {view === 'initialize' && <InitializeAnalysisView onStart={() => setView('analysis')} />}
             {view === 'analysis' && <ClaimChartAnalysisView chartData={chartData} />}
             {view === 'export_history' && <ExportHistoryView />}
           </div>

           {/* RIGHT SIDEBAR - Refinement Intelligence (Always visible in Analysis mode) */}
           {view === 'analysis' && (
             <RefinementIntelligencePanel 
               messages={messages}
               inputText={inputText}
               setInputText={setInputText}
               sendMessage={sendMessage}
               isLoading={isLoading}
               acceptedUpdates={acceptedUpdates}
               applyUpdate={applyUpdate}
               rejectUpdate={rejectUpdate}
             />
           )}
        </div>
      </div>
    </div>
  );
}
