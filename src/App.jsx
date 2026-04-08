import React, { useState, useRef, useEffect } from 'react';

// ---- CONSTANTS ----
const CLAIMS = [
  { id: 'CLM-001', patent: 'US123456', element: 'Wireless module', status: 'ACTIVE', conf: 92, updated: '2 hours ago' },
  { id: 'CLM-002', patent: 'US123456', element: 'Motion sensor', status: 'ACTIVE', conf: 88, updated: '2 hours ago' },
  { id: 'CLM-003', patent: 'US123456', element: 'ML Algorithm', status: 'NEEDS_REVIEW', conf: 45, updated: '3 hours ago' },
  { id: 'CLM-004', patent: 'US789012', element: 'Temperature sensor', status: 'IN_REVIEW', conf: 78, updated: 'Yesterday' },
  { id: 'CLM-005', patent: 'US345678', element: 'Data processor', status: 'DRAFT', conf: 20, updated: '3 days ago' }
];

const TEAM = [
  { n: 'Elena Vance', e: 'elena.vance@lumenci.com', r: 'Admin', s: 'Active', j: 'Jan 12, 2024', i: 'EV', c: '#1e40af' },
  { n: 'Marcus Thorne', e: 'm.thorne@lumenci.com', r: 'Analyst', s: 'Active', j: 'Feb 05, 2024', i: 'MT', c: '#047857' },
  { n: 'Sarah Chen', e: 's.chen@lumenci.com', r: 'Reviewer', s: 'Pending', j: 'Mar 18, 2024', i: 'SC', c: '#7c3aed' },
  { n: 'David Miller', e: 'd.miller@lumenci.com', r: 'Analyst', s: 'Active', j: 'Apr 02, 2024', i: 'DM', c: '#b45309' }
];

const INTS = [
  { name: 'Microsoft Word', desc: 'Draft legal briefs with AI citation.', status: 'CONNECTED', sync: '2m ago' },
  { name: 'Google Drive', desc: 'Auto-index PDFs to case folders.', status: 'CONNECTED', sync: '1h ago' },
  { name: 'Slack', desc: 'Instant case notifications.', status: 'CONNECT' },
  { name: 'Westlaw', desc: 'Premium legal research.', status: 'CONNECTED', sync: 'Active' },
  { name: 'LexisNexis', desc: 'Citations and litigation analytics.', status: 'CONNECT' }
];

const DEMO_CONVERSATIONS = [
  { id: 1, category: "Strengthen Evidence", userMessage: "The AI reasoning for the ML algorithm element is weak - add more technical details", aiResponse: "I have analyzed Element 3. The current reasoning lacks technical depth. Here is a stronger version referencing specific ML architecture terminology.", update: { elementId: 3, field: "aiReasoning", newValue: "Acme Auto-Schedule feature demonstrates supervised machine learning behavior consistent with a neural network or decision tree model trained on temporal user interaction data. The system adapts setpoint temperatures based on historical patterns, satisfying the claim requirement for an algorithm that learns preferences over time. Technical patent literature confirms this maps directly to claim element 3." } },
  { id: 2, category: "Strengthen Evidence", userMessage: "Strengthen the evidence for the wireless communication module", aiResponse: "The current evidence for Element 1 is adequate but can be technically reinforced. Here is an improved version.", update: { elementId: 1, field: "evidence", newValue: "Acme Thermostat FCC filing ID: 2ABCD-THERMO1 confirms 802.11 b/g/n WiFi radio module operating at 2.4GHz. Product teardown by iFixit (Oct 2023) identified Broadcom BCM43362 wireless chip. This satisfies the wireless communication module claim element." } },
  { id: 3, category: "Strengthen Evidence", userMessage: "Add technical documentation for the motion sensor claim", aiResponse: "I found stronger technical evidence for the motion sensor element. Here is the updated evidence.", update: { elementId: 2, field: "evidence", newValue: "Acme Engineering Datasheet v2.1 page 14 specifies: Passive Infrared sensor PIR model SR501 with 120 degree detection angle and 7 meter range. Firmware changelog v3.2.1 confirms occupancy detection algorithm using PIR interrupt signals mapped directly to HVAC scheduling logic." } },
  { id: 4, category: "Strengthen Evidence", userMessage: "The evidence for element 2 is from marketing only, need technical proof", aiResponse: "You are correct. Marketing materials alone are weak evidence. Here is technical documentation evidence instead.", update: { elementId: 2, field: "evidence", newValue: "Acme SmartHome SDK documentation section 4.3 states: OccupancyDetector class uses hardware interrupt from PIR sensor pin GPIO17 to trigger presence detection events. This is direct technical evidence of the motion sensor for occupancy detection as claimed." } },
  { id: 5, category: "Strengthen Evidence", userMessage: "Can you find better evidence from a technical specification document", aiResponse: "Based on typical product documentation patterns, here is what stronger technical spec evidence would look like for this claim chart.", update: { elementId: 3, field: "evidence", newValue: "Acme firmware source code repository (GitHub acmecorp/thermostat commit a3f91b2) contains TempPreferenceLearning Module with gradient descent optimizer updating weights every 24 hours based on manual override events. This is direct source code evidence of the ML algorithm learning user preferences." } },
  { id: 6, category: "Fix Reasoning", userMessage: "The AI reasoning for element 3 is vague, need more specific analysis", aiResponse: "Agreed. The current reasoning is too general. Here is specific technical analysis for the ML algorithm element.", update: { elementId: 3, field: "aiReasoning", newValue: "The Auto-Schedule feature constitutes a machine learning algorithm under the doctrine of equivalents. Specifically, the adaptive temperature scheduling performs function (learn preferences), way (analyzing historical setpoint adjustments), result (predicting future preferred temperatures) identical to the claimed ML algorithm. Federal Circuit precedent in Graver Tank supports this mapping." } },
  { id: 7, category: "Fix Reasoning", userMessage: "Rewrite the reasoning to address potential claim construction arguments from the defense", aiResponse: "Here is a legally robust version of the reasoning that anticipates and addresses common defense arguments.", update: { elementId: 3, field: "aiReasoning", newValue: "Even under the narrowest claim construction of machine learning algorithm, the Acme Auto-Schedule satisfies this limitation. Defense argument that marketing language is insufficient is pre-empted by firmware v3.2 release notes which explicitly reference a trained model with configurable learning rate parameter. This constitutes direct infringement under 35 USC 271(a)." } },
  { id: 8, category: "Fix Reasoning", userMessage: "The reasoning for element 1 does not mention the specific WiFi standard", aiResponse: "Good catch. Here is updated reasoning that includes the specific wireless standard details.", update: { elementId: 1, field: "aiReasoning", newValue: "The Acme Thermostat implements IEEE 802.11 WiFi protocol which falls squarely within the claim scope of wireless communication module. The claimed invention does not limit the wireless standard, therefore 802.11 WiFi satisfies this limitation both literally and under doctrine of equivalents. FCC certification confirms RF transmission capability." } },
  { id: 9, category: "Fix Reasoning", userMessage: "Make the reasoning more formal for use in legal proceedings", aiResponse: "Here is a formally structured legal reasoning suitable for court submission documents.", update: { elementId: 2, field: "aiReasoning", newValue: "The accused product literally infringes the motion sensor claim limitation. Claim element requires: (1) a motion sensor and (2) for detecting occupancy. The Acme technical datasheet confirms presence of PIR sensor satisfying element (1). The firmware OccupancyDetector class satisfies element (2). Both limitations are met literally. No claim construction dispute anticipated." } },
  { id: 10, category: "Fix Reasoning", userMessage: "The reasoning does not cite any legal standards or precedents", aiResponse: "Here is updated reasoning with proper legal citation framework.", update: { elementId: 1, field: "aiReasoning", newValue: "Under the Phillips v AWH claim construction standard, wireless communication module is construed in light of the specification to include any radio frequency communication system. The Acme WiFi module satisfies this construction. See also parties agreed claim construction in pretrial order defining wireless as including IEEE 802.11 protocols." } },
  { id: 11, category: "Add Missing Features", userMessage: "AI missed that Acme also has a temperature sensor array", aiResponse: "You are correct. This is an important missing feature. I will add a new claim element for the temperature sensor array.", update: { elementId: 1, field: "evidence", newValue: "Acme product page confirms primary temperature sensor plus secondary ambient sensor array with 3 distributed measurement points. Datasheet shows NTC thermistor array model TMP36 at locations: main unit, remote sensor 1, remote sensor 2. This exceeds the single temperature control device claimed in the patent." } },
  { id: 12, category: "Add Missing Features", userMessage: "What features am I missing in the accused product analysis", aiResponse: "Based on my analysis of the current claim chart I have identified 3 potentially missing features that should be mapped to claim elements: 1. Remote access via mobile app 2. Energy usage reporting dashboard 3. Integration with smart home platforms like Amazon Alexa and Google Home. Would you like me to add evidence for any of these?" },
  { id: 13, category: "Add Missing Features", userMessage: "Add the geofencing feature to the claim chart", aiResponse: "Geofencing is an important feature. Here is the evidence mapping for geofencing capability.", update: { elementId: 1, field: "evidence", newValue: "Acme app v4.2 release notes confirm geofencing feature using device GPS coordinates to trigger temperature adjustments when user is within 1 mile of home. This extends the wireless communication module claim to include location-aware remote control functionality." } },
  { id: 14, category: "Add Missing Features", userMessage: "The voice control feature is not mapped in the chart", aiResponse: "Voice control is a relevant feature for the wireless communication module claim. Here is the evidence.", update: { elementId: 1, field: "evidence", newValue: "Acme Thermostat supports Amazon Alexa and Google Assistant voice commands via WiFi. User manual page 23 confirms: Set temperature using voice command through your smart speaker. This is additional evidence of the wireless communication module operating as claimed." } },
  { id: 15, category: "Add Missing Features", userMessage: "Include the over the air update feature as evidence", aiResponse: "OTA updates are strong additional evidence for the wireless communication module. Here is the updated evidence.", update: { elementId: 1, field: "evidence", newValue: "Acme support documentation confirms automatic firmware updates delivered over WiFi connection. Version history shows 12 OTA updates since product launch. This demonstrates bidirectional wireless communication capability beyond what is claimed, strengthening the infringement analysis." } },
  { id: 16, category: "Legal Language", userMessage: "Rewrite element 3 reasoning using doctrine of equivalents", aiResponse: "Here is the reasoning rewritten using doctrine of equivalents legal framework.", update: { elementId: 3, field: "aiReasoning", newValue: "Under the doctrine of equivalents per Hilton Davis Chemical Co v Warner Jenkinson, the Acme Auto-Schedule performs substantially the same function (learning temperature preferences) in substantially the same way (analyzing historical user inputs) to achieve substantially the same result (automated temperature optimization) as the claimed ML algorithm. Infringement established under DOE." } },
  { id: 17, category: "Legal Language", userMessage: "Add prosecution history estoppel analysis to element 1", aiResponse: "Here is prosecution history estoppel analysis for the wireless communication module claim.", update: { elementId: 1, field: "aiReasoning", newValue: "Review of prosecution history for patent US123456 shows no amendments were made to the wireless communication module limitation during examination. Therefore no prosecution history estoppel applies and the full range of equivalents is available. The Acme WiFi module falls within both literal scope and equivalents of this claim." } },
  { id: 18, category: "Legal Language", userMessage: "Does the accused product literally infringe all claim elements", aiResponse: "Based on current evidence in the chart, here is my literal infringement analysis for all 3 elements: Element 1 (Wireless Module): YES - literal infringement confirmed by FCC filing and product specs. Element 2 (Motion Sensor): YES - literal infringement confirmed by technical datasheet. Element 3 (ML Algorithm): PARTIAL - marketing evidence suggests literal infringement but technical documentation needed to confirm. Recommend obtaining firmware source code or technical specs." },
  { id: 19, category: "Legal Language", userMessage: "Write a claim construction argument for machine learning algorithm", aiResponse: "Here is a claim construction argument for the ML algorithm element.", update: { elementId: 3, field: "aiReasoning", newValue: "Claim construction: Machine learning algorithm should be construed broadly per Phillips standard to include any computational system that improves performance based on experience or training data. The specification supports this broad construction at col 4 lines 12-28. Under this construction, the Acme Auto-Schedule which adapts based on historical user interactions satisfies the limitation literally." } },
  { id: 20, category: "Legal Language", userMessage: "Add invalidity risk assessment to the reasoning", aiResponse: "Here is an invalidity risk assessment added to element 3 reasoning.", update: { elementId: 3, field: "aiReasoning", newValue: "Infringement analysis: Auto-Schedule maps to ML algorithm claim. Invalidity risk assessment: MEDIUM. Potential prior art includes Nest Learning Thermostat patent US8620841 (2012) and Ecobee SmartThermostat US9696733 (2014). Recommend prior art search focused on adaptive HVAC scheduling before proceeding with litigation. Current evidence supports infringement but invalidity defense is anticipated." } }
];

const DEMO_CATEGORIES = [...new Set(DEMO_CONVERSATIONS.map(d => d.category))];
const GEMINI_KEY = "";
const OPENAI_KEY = "";

// ---- UI PRIMITIVES ----
const Tog = ({ on, set }) => (
  <label className="tog">
    <input type="checkbox" checked={on} onChange={e => set(e.target.checked)} />
    <span className="sld"></span>
  </label>
);

const Badge = ({ s }) => {
  const m = {
    ACTIVE: 'bg-blue-50 text-blue-700',
    NEEDS_REVIEW: 'bg-orange-100 text-orange-700',
    IN_REVIEW: 'bg-purple-100 text-purple-700',
    DRAFT: 'bg-gray-100 text-gray-600',
    PAID: 'bg-blue-50 text-blue-700',
    CONNECTED: 'bg-green-100 text-green-700',
    CONNECT: 'bg-gray-100 text-gray-700',
    Active: 'bg-green-50 text-green-700',
    Pending: 'bg-orange-50 text-orange-700',
    READY: 'bg-green-100 text-green-700',
    PROCESSING: 'bg-blue-50 text-blue-700'
  };
  const l = {
    NEEDS_REVIEW: 'NEEDS REVIEW',
    IN_REVIEW: 'IN REVIEW'
  };
  return (
    <span className={"text-[10px] font-bold px-2.5 py-1 rounded " + (m[s] || 'bg-gray-100 text-gray-700')}>
      {l[s] || s}
    </span>
  );
};

const CB = ({ v }) => {
  const b = v >= 80 ? '#22c55e' : v >= 50 ? '#f97316' : '#ef4444';
  const t = v >= 80 ? 'text-green-600' : v >= 50 ? 'text-orange-500' : 'text-red-500';
  return (
    <div className="flex items-center gap-2">
      <span className={"text-sm font-bold " + t}>{v}%</span>
      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: v + "%", background: b }}></div>
      </div>
    </div>
  );
};

const SI = ({ id, label, icon, view, setView }) => (
  <button onClick={() => setView(id)} className={"flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full text-left " + (view === id ? "text-blue-700 font-semibold bg-blue-50" : "text-slate-600 hover:bg-gray-100")}>
    <span>{icon}</span>{label}
  </button>
);

// ---- LAYOUT COMPONENTS ----
const TopNav = ({ view, setView }) => {
  const nb = a => "px-4 py-2 text-sm font-semibold rounded-md " + (a ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:bg-gray-100");
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-8">
        <button onClick={() => setView('allClaims')} className="flex items-center gap-2 font-bold focus:outline-none">
          <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center justify-center text-white text-xs font-black">L</div>
          Lumenci Assistant
        </button>
        <nav className="flex gap-1">
          <button onClick={() => setView('allClaims')} className={nb(['allClaims', 'claimDetail', 'analysis'].includes(view))}>Claims</button>
          <button onClick={() => setView('usage')} className={nb(view === 'usage')}>Reports</button>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 w-44 text-sm text-slate-400">🔍 Search...</div>
        <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-gray-100 rounded-full">🔔</button>
        <button onClick={() => setView('settings')} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-gray-100 rounded-full">⚙️</button>
        <button onClick={() => setView('profile')} className="w-9 h-9 rounded-full bg-blue-800 text-white font-bold text-sm flex items-center justify-center">AS</button>
      </div>
    </header>
  );
};

const ClaimsSidebar = ({ view, setView }) => (
  <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
    <div className="p-4 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">My Workspace</p>
      <div className="space-y-0.5">
        <SI id="allClaims" label="All Claims" icon="📋" view={view} setView={setView} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-5 mb-2">Projects</p>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>Patent Portfolio A
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>Mobile Tech Audit
        </div>
      </div>
    </div>
    <div className="p-4 border-t border-gray-100">
      <button onClick={() => setView('allClaims')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-bold mb-2 hover:bg-blue-800">
        + New Claim
      </button>
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:bg-gray-100 rounded-lg w-full">❓ Help</button>
    </div>
  </aside>
);

const WorkspaceSidebar = ({ view, setView }) => (
  <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
    <div className="p-4 flex-1">
      <p className="font-bold text-blue-700">Lumenci</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-4">Premium Legal Intel</p>
      <div className="space-y-0.5">
        <SI id="workspace" label="Workspace" icon="🏠" view={view} setView={setView} />
        <SI id="activeProjects" label="Active Projects" icon="📁" view={view} setView={setView} />
        <SI id="caseFiles" label="Case Files" icon="📄" view={view} setView={setView} />
        <SI id="archive" label="Archive" icon="📦" view={view} setView={setView} />
        <SI id="team" label="Team" icon="👥" view={view} setView={setView} />
      </div>
    </div>
  </aside>
);

const SettingsSidebar = ({ view, setView }) => {
  const items = [
    ['settings', 'Account', '👤'],
    ['notifications', 'Notifications', '🔔'],
    ['integrations', 'Integrations', '🔗'],
    ['preferences', 'AI Preferences', '🤖'],
    ['exportSettings', 'Export', '📤'],
    ['team', 'Team', '👥'],
    ['security', 'Security', '🛡️'],
    ['billing', 'Billing', '💳'],
    ['usage', 'Usage & Analytics', '📊']
  ];
  return (
    <aside className="w-52 bg-white border-r border-gray-200 shrink-0 p-4">
      <p className="text-sm font-bold text-slate-700 mb-1">Settings</p>
      <p className="text-xs text-slate-400 mb-4">Manage workspace</p>
      {items.map(([id, label, icon]) => (
        <SI key={id} id={id} label={label} icon={icon} view={view} setView={setView} />
      ))}
    </aside>
  );
};

// ---- VIEWS ----
const AllClaims = ({ sv }) => {
  const [q, setQ] = useState('');
  const rows = CLAIMS.filter(c => c.element.toLowerCase().includes(q.toLowerCase()) || c.id.includes(q));
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Claims</h1>
          <p className="text-slate-500 text-sm mt-1">24 total claims across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 w-52">
            <input value={q} onChange={e => setQ(e.target.value)} className="border-none outline-none text-sm flex-1 bg-transparent" placeholder="Search claims..." />
          </div>
          <button className="border bg-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Filter</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['CLAIM ID', 'PATENT', 'ELEMENT', 'STATUS', 'CONFIDENCE', 'UPDATED', 'ACTIONS'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[11px] text-slate-400 font-bold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr key={c.id} className={"hover:bg-gray-50 " + (i < rows.length - 1 ? "border-b border-gray-50" : "")}>
                <td className="px-5 py-4"><button onClick={() => sv('claimDetail')} className="text-blue-700 font-bold text-sm hover:underline">{c.id}</button></td>
                <td className="px-4 py-4 text-sm font-medium">{c.patent}</td>
                <td className="px-4 py-4 text-sm">{c.element}</td>
                <td className="px-4 py-4"><Badge s={c.status} /></td>
                <td className="px-4 py-4"><CB v={c.conf} /></td>
                <td className="px-4 py-4 text-sm text-slate-500">{c.updated}</td>
                <td className="px-4 py-4">
                  <button onClick={() => sv('claimDetail')} className="mr-2 text-slate-400 hover:text-blue-600">👁</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClaimDetail = ({ sv }) => (
  <div className="flex-1 overflow-y-auto p-6">
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-5">
      <button onClick={() => sv('allClaims')} className="hover:text-blue-700">Home</button>
      <span>›</span><span>US123456</span><span>›</span><span className="text-slate-700 font-semibold">CLM-003</span>
    </nav>
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold uppercase tracking-tight">CLM-003 – ML Algorithm</h1>
          <Badge s="NEEDS_REVIEW" />
        </div>
        <CB v={45} />
      </div>
      <div className="flex gap-2">
        <button className="border border-gray-300 bg-white px-4 py-2.5 rounded-xl text-sm font-semibold">Export</button>
        <button onClick={() => sv('analysis')} className="bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold">✨ AI Refine</button>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-5">
      <div className="bg-blue-800 text-white rounded-2xl p-5">
        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-3">📋 Patent Claim</p>
        <p className="text-sm">"Machine learning algorithm that learns user temperature preferences over time"</p>
      </div>
      <div className="bg-blue-700 text-white rounded-2xl p-5">
        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-3">📁 Evidence</p>
        <p className="text-sm">"Acme marketing materials claim: Auto-Schedule learns your preferred temperatures"</p>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <p className="text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-3">⚠ AI Reasoning</p>
        <p className="text-sm text-orange-800">Learning behavior suggests ML algorithm, details undisclosed.</p>
      </div>
    </div>
    <button onClick={() => sv('analysis')} className="w-full bg-blue-800 text-white p-6 rounded-2xl font-bold text-left hover:bg-blue-900 shadow-lg">
      <p className="text-blue-300 text-xs mb-1 uppercase tracking-widest">Interactive Session</p>
      <div className="text-xl flex justify-between items-center">
        <span>Click to start AI refinement on this claim...</span>
        <span>💬</span>
      </div>
    </button>
  </div>
);

const AnalysisView = ({ sv }) => {
  const INITIAL = [
    { id: 1, element: 'Adaptive Feedback Loop', desc: 'Regulating temp via sensor array...', spec: 'Col. 4, Ln. 12-45', conf: 'HIGH', st: 'strong' },
    { id: 2, element: 'Network Interface', desc: 'Mesh protocol networking...', spec: 'Col. 8, Ln. 4-15', conf: 'HIGH', st: 'strong' },
    { id: 3, element: 'ML Processing Element', desc: 'Deep neural network logic...', spec: 'Inconclusive Search', conf: '45%', st: 'weak' }
  ];
  const [chartData, setChartData] = useState(INITIAL);
  const [history, setHistory] = useState([]);
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: "Loaded US123456. Element 3 has weak evidence. Should we refine it?" }]);
  const [inp, setInp] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return;
    setMsgs(m => [...m, { role: 'user', content: userMessage }]);
    setInp('');
    setLoading(true);

    if (demoMode) {
      await new Promise(r => setTimeout(r, 800));
      const demo = DEMO_CONVERSATIONS.find(d => d.userMessage.toLowerCase().trim() === userMessage.toLowerCase().trim()) 
                 || DEMO_CONVERSATIONS.find(d => userMessage.toLowerCase().includes(d.category.toLowerCase().split(' ')[0]));
      setLoading(false);
      if (demo) setMsgs(m => [...m, { role: 'assistant', content: demo.aiResponse, amendment: demo.update }]);
      else setMsgs(m => [...m, { role: 'assistant', content: "Try a question from the Demo Panel." }]);
      return;
    }

    // Live AI Logic (Ported from index_test.html)
    const systemPrompt = `Expert Patent AI. Chart: ${JSON.stringify(chartData)}. Response format: <UPDATE>{"elementId":N,"field":"spec","newValue":"..."}</UPDATE>`;
    try {
      if (!GEMINI_KEY && !OPENAI_KEY) throw new Error();
      // Implementation omitted for brevity to focus on Demo Mode functionality
      setMsgs(m => [...m, { role: 'assistant', content: "Live API response simulation. Please configure keys in App.jsx." }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'assistant', content: "Demo Mode is recommended for testing. Toggle it in the sidebar." }]);
    }
    setLoading(false);
  };

  const handleAccept = (idx) => {
    const am = msgs[idx].amendment;
    setHistory([...history, [...chartData]]);
    setChartData(chartData.map(c => c.id === am.elementId ? { ...c, spec: am.newValue, conf: '92%', st: 'strong' } : c));
    setMsgs([...msgs.map((m, i) => i === idx ? { ...m, accepted: true } : m)]);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col p-5 overflow-hidden">
        <div className="flex justify-between items-center mb-5">
           <h1 className="text-2xl font-bold">Analysis: US123456</h1>
           <button onClick={()=>sv('allClaims')} className="text-blue-700 font-bold">← Back</button>
        </div>
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200">
           <table className="w-full text-sm">
             <thead className="bg-gray-50 border-b border-gray-100">
               <tr>{['Element','Specification','Confidence'].map(h=><th key={h} className="px-4 py-3 text-left font-bold text-slate-400 uppercase text-[10px] tracking-widest">{h}</th>)}</tr>
             </thead>
             <tbody>
               {chartData.map(r=><tr key={r.id} className="border-b border-gray-50">
                 <td className="px-4 py-4 font-bold">{r.element}</td>
                 <td className="px-4 py-4 italic text-slate-600">{r.spec}</td>
                 <td className="px-4 py-4 font-bold uppercase" style={{color:r.st==='strong'?'#16a34a':r.st==='weak'?'#ea580c':'#94a3b8'}}>{r.conf}</td>
               </tr>)}
             </tbody>
           </table>
        </div>
      </div>
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-bold">AI Assistant</span>
            <button onClick={()=>setDemoMode(!demoMode)} className={`text-[10px] px-2 py-1 rounded-full border font-bold ${demoMode?'bg-purple-600 text-white':'bg-white text-slate-400'}`}>DEMO {demoMode?'ON':'OFF'}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {msgs.map((m,i)=> (
             <div key={i} className={`p-3 rounded-xl text-sm ${m.role==='user'?'bg-blue-700 text-white ml-6':'bg-white border border-gray-200'}`}>
                {m.content}
                {m.amendment && !m.accepted && (
                  <div className="mt-3 bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <p className="text-[10px] font-black text-blue-700 uppercase mb-2">Proposed Update</p>
                    <p className="text-xs mb-3 font-medium">{m.amendment.newValue}</p>
                    <button onClick={()=>handleAccept(i)} className="w-full bg-blue-700 text-white py-1.5 rounded-lg font-bold text-xs">Accept Change</button>
                  </div>
                )}
             </div>
           ))}
           <div ref={endRef}/>
        </div>
        {demoMode && <div className="p-2 border-t border-gray-200 bg-purple-50">
            <button onClick={()=>setDemoPanelOpen(!demoPanelOpen)} className="w-full text-[10px] font-black uppercase text-purple-700 py-1">Browse Demo Questions {demoPanelOpen?'▲':'▼'}</button>
            {demoPanelOpen && <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                {DEMO_CONVERSATIONS.map(d=><button key={d.id} onClick={()=>sendMessage(d.userMessage)} className="w-full text-left p-2 text-[10px] border border-purple-200 rounded bg-white hover:bg-purple-100">{d.userMessage}</button>)}
            </div>}
        </div>}
        <div className="p-4 border-t border-gray-200 bg-white">
           <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage(inp)} placeholder="Ask AI..." className="w-full bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
      </div>
    </div>
  );
};

// ---- SECONDARY VIEWS ----
const SettingsView = () => (
  <div className="p-8 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">Settings</h1>
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
       <div className="flex items-center justify-between">
          <div><p className="font-bold">AI Auto-Suggestions</p><p className="text-xs text-slate-400">Improve claims automatically</p></div>
          <Tog on={true} set={()=>{}} />
       </div>
       <div className="flex items-center justify-between border-t pt-6">
          <div><p className="font-bold">Confidence Threshold</p><p className="text-xs text-slate-400">Strictness of evidence matching</p></div>
          <select className="bg-gray-100 rounded-lg p-2 text-sm font-bold"><option>Strict (90%+)</option><option>Standard (70%+)</option></select>
       </div>
    </div>
  </div>
);

const UsageView = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Usage & Analytics</h1>
        <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tokens Used</p>
                <p className="text-3xl font-black">422.1k</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reports Generated</p>
                <p className="text-3xl font-black">12</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Storage</p>
                <p className="text-3xl font-black text-blue-700">82%</p>
            </div>
        </div>
    </div>
);

const BillingView = () => (
    <div className="p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Billing & Credits</h1>
            <Badge s="Professional Plan" />
        </div>
        <div className="bg-blue-800 text-white p-8 rounded-3xl shadow-xl">
            <p className="text-blue-300 font-bold uppercase tracking-widest text-[10px] mb-2">Account Balance</p>
            <p className="text-5xl font-black">$4,200.00</p>
            <p className="mt-4 text-blue-200 text-sm">Next billing cycle: Oct 24, 2024</p>
        </div>
    </div>
);

// ---- MAIN APP ----
export default function App() {
  const [v, sv] = useState('allClaims');
  const cV = ['allClaims', 'claimDetail', 'analysis'];
  const wV = ['team', 'workspace', 'activeProjects', 'caseFiles', 'archive'];
  const sV = ['settings', 'notifications', 'integrations', 'preferences', 'exportSettings', 'security', 'billing', 'usage'];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#f8fafc] overflow-hidden">
      <TopNav view={v} setView={sv} />
      <div className="flex flex-1 overflow-hidden">
        {cV.includes(v) ? <ClaimsSidebar view={v} setView={sv} /> : 
         wV.includes(v) ? <WorkspaceSidebar view={v} setView={sv} /> : 
         sV.includes(v) ? <SettingsSidebar view={v} setView={sv} /> : null}
        
        <main className="flex-1 overflow-auto flex flex-col">
          {v === 'allClaims' && <AllClaims sv={sv} />}
          {v === 'claimDetail' && <ClaimDetail sv={sv} />}
          {v === 'analysis' && <AnalysisView sv={sv} />}
          {v === 'settings' && <SettingsView />}
          {v === 'usage' && <UsageView />}
          {v === 'billing' && <BillingView />}
          
          {['notifications', 'integrations', 'preferences', 'exportSettings', 'security', 'team', 'profile', 'activeProjects', 'caseFiles', 'archive'].includes(v) && 
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
               <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center text-3xl mb-4 font-bold">
                 {v.charAt(0).toUpperCase()}
               </div>
               <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">{v}</h1>
               <p className="text-slate-500 max-w-md">This high-fidelity intelligence screen is active and ready for data population in your next session.</p>
            </div>
          }
        </main>
      </div>
    </div>
  );
}
