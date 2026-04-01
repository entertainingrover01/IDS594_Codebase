let data = {};

let currentTab = 'dashboard';
let selectedKnowledgeId = '1';
let selectedTelemetryId = 'e1';
let isGenerating = false;

// --- INITIALIZE DATA ---
async function initializeData() {
    try {
        const response = await fetch('/api/data');
        data = await response.json();

        // If the database was empty, fallback to the hardcoded data for demonstration
        if (!data || !data.transitions || data.transitions.length === 0) {
            console.warn("Database empty or failed to connect. Falling back to hardcoded data.");
            useHardcodedData();
        }

        // Update sidebar count if element exists
        const sidebarCount = document.getElementById('sidebar-active-count');
        if (sidebarCount && data.metrics) {
            sidebarCount.textContent = data.metrics.active;
        }

        render();
    } catch (error) {
        console.error("Error fetching data from API:", error);
        useHardcodedData();
        render();
    }
}

function useHardcodedData() {
    data = {
    transitions: [
        {
            id: '1', name: 'James Wright', role: 'Design', status: 'Offboarding', risk: 'high', progress: 45, score: 66, location: 'New York', hw: 'MacBook Pro M2', hwStatus: 'Awaiting Return Kit', tracking: '-', costWaste: 180,
            knowledgeCaptured: 65,
            responses: {
                context: 'I manage the primary design system in Figma. If access is lost, the entire engineering team will lose component syncing.',
                stakeholders: 'VP of Product expects the Q3 redesign files by Friday. Unwritten rule: Always CC the creative director on core component updates.'
            },
            dependencies: [
                { category: 'Internal-Org', description: 'Design System Hub', impact: 'Critical' },
                { category: 'Internal-Org', description: 'Brand Guidelines', impact: 'High Impact' },
                { category: 'Client-Side', description: 'Enterprise Redesign Project', impact: 'Critical' }
            ]
        },
        {
            id: '2', name: 'Alex Kim', role: 'Marketing', status: 'Onboarding', risk: 'medium', progress: 30, score: 0, location: 'Austin', hw: 'Dell XPS 15', hwStatus: 'Issued', tracking: 'Delivered', costWaste: 0,
            knowledgeCaptured: 0, responses: { context: '', stakeholders: '' }, dependencies: []
        },
        {
            id: '3', name: 'Emily Watson', role: 'Support', status: 'Offboarding', risk: 'critical', progress: 60, score: 78, location: 'Chicago', hw: 'MacBook Air M1', hwStatus: 'In Transit', tracking: 'FDX-8821', costWaste: 245,
            knowledgeCaptured: 55,
            responses: {
                context: 'I own the Zendesk admin keys and routing rules. I also maintain the VIP client escalation matrix on the shared drive.',
                stakeholders: 'Top 5 enterprise clients ping me directly on Slack. They need to be formally handed over to Marcus.'
            },
            dependencies: [
                { category: 'Client-Side', description: 'Top 5 VIP Clients', impact: 'Critical' },
                { category: 'Infrastructure', description: 'Zendesk Routing Engine', impact: 'Critical' },
                { category: 'Internal-Org', description: 'Escalation Matrix', impact: 'Medium Impact' }
            ]
        }
    ],
    employees: [
        { id: 'e1', name: 'Sarah Jenkins', role: 'Frontend Lead', status: 'ACTIVE', dept: 'Engineering', location: 'San Francisco', score: 82, focus: 78, output: 94, state: 'OPTIMAL', github: { commits: 45, prs: 12, lines: 3400 }, calendar: { hours: 18, conflicts: 2 }, slack: { afterHours: 0, reply: '12m' }, jira: { tickets: 14, rollovers: 2 }, insight: 'Performance is optimal. High code velocity correlates with healthy deep work blocks. No intervention required.' },
        { id: 'e2', name: 'Mike Ross', role: 'Backend Dev', status: 'ACTIVE', dept: 'Engineering', location: 'Remote - India', score: 91, focus: 45, output: 88, state: 'BURNOUT RISK', github: { commits: 12, prs: 3, lines: 800 }, calendar: { hours: 32, conflicts: 8 }, slack: { afterHours: 14, reply: '4m' }, jira: { tickets: 6, rollovers: 5 }, insight: 'High burnout risk detected. Meeting load has increased 40% week-over-week, severely impacting deep work. Slack activity after hours is elevated.' },
        { id: 'e3', name: 'Elena Fisher', role: 'Product Manager', status: 'ACTIVE', dept: 'Product', location: 'San Francisco', score: 95, focus: 50, output: 91, state: 'OPTIMAL', github: { commits: 0, prs: 0, lines: 0 }, calendar: { hours: 24, conflicts: 4 }, slack: { afterHours: 2, reply: '8m' }, jira: { tickets: 22, rollovers: 1 }, insight: 'Consistent output and manageable meeting load. Team unblocking metrics remain high.' },
        { id: 'e4', name: 'Sam Drake', role: 'Sales Lead', status: 'ACTIVE', dept: 'Sales', location: 'New York', score: 88, focus: 30, output: 82, state: 'OPTIMAL', github: { commits: 0, prs: 0, lines: 0 }, calendar: { hours: 12, conflicts: 1 }, slack: { afterHours: 1, reply: '15m' }, jira: { tickets: 0, rollovers: 0 }, insight: 'Sales metrics are stable. Communication volume is within expected bounds.' },
        { id: 'e5', name: 'Chloe Frazer', role: 'Designer', status: 'ACTIVE', dept: 'Design', location: 'Denver', score: 70, focus: 85, output: 95, state: 'OPTIMAL', github: { commits: 0, prs: 0, lines: 0 }, calendar: { hours: 8, conflicts: 0 }, slack: { afterHours: 0, reply: '45m' }, jira: { tickets: 8, rollovers: 0 }, insight: 'Excellent deep work ratios. Minimal context switching detected.' }
    ],
    tasks: [
        { title: 'Revoke Figma license', desc: 'James Wright · IT Admin', dept: 'IT', priority: 'HIGH', time: '24h', completed: false },
        { title: 'Design system documentation handover', desc: 'James Wright · Lisa Park', dept: 'Manager', priority: 'CRITICAL', time: '48h', completed: false },
        { title: 'Exit interview', desc: 'James Wright · Nina Patel', dept: 'HR', priority: 'MEDIUM', time: '72h', completed: true },
        { title: 'Return company equipment', desc: 'James Wright · Office Admin', dept: 'Facilities', priority: 'MEDIUM', time: '48h', completed: false },
        { title: 'Set up Slack account', desc: 'Alex Kim · IT Admin', dept: 'IT', priority: 'HIGH', time: '4h', completed: true },
        { title: 'HubSpot license provisioning', desc: 'Alex Kim · IT Admin', dept: 'IT', priority: 'HIGH', time: '8h', completed: false },
        { title: 'Welcome orientation meeting', desc: 'Alex Kim · Nina Patel', dept: 'HR', priority: 'MEDIUM', time: '24h', completed: true },
        { title: 'Enterprise client handover meetings', desc: 'Emily Watson · Diana Torres', dept: 'Manager', priority: 'CRITICAL', time: '48h', completed: false },
        { title: 'Revoke Zendesk admin access', desc: 'Emily Watson · IT Admin', dept: 'IT', priority: 'HIGH', time: '24h', completed: false }
    ],
    auditLogs: [
        { title: 'Transition initiated', tag: 'transition', desc: 'Offboarding workflow started for James Wright', user: 'Nina Patel', action: 'transition', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'Transition initiated', tag: 'transition', desc: 'Onboarding workflow started for Alex Kim', user: 'Nina Patel', action: 'transition', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'Task completed', tag: 'transition', desc: 'Exit interview completed for James Wright', user: 'Nina Patel', action: 'task', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'License flagged', tag: 'license', desc: 'CrowdStrike license for Tom Bradley flagged as unused - $45/mo waste', user: 'System', action: 'license', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'Access revoked', tag: 'access', desc: 'GitHub access revoked for Tom Bradley', user: 'IT Admin', action: 'license', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'Knowledge capture started', tag: 'knowledge', desc: 'Knowledge capture session initiated for Emily Watson', user: 'Nina Patel', action: 'knowledge', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'License flagged', tag: 'license', desc: 'Confluence license for Marcus Rivera unused since Nov 2025', user: 'System', action: 'license', date: 'Feb 19, 2026 10:31 PM' },
        { title: 'Transition completed', tag: 'transition', desc: 'Tom Bradley offboarding completed', user: 'Nina Patel', action: 'transition', date: 'Feb 19, 2026 10:31 PM' }
    ],
    metrics: {
        active: 3,
        tasks: { total: 10, critical: 3 },
        ghostWasted: 111,
        highRisk: 5
    }
};
}

// --- NAVIGATION LOGIC ---
window.setTab = function(tab) {
    currentTab = tab;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tab;
        if (isActive) {
            btn.className = 'nav-btn active w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700';
        } else {
            btn.className = 'nav-btn inactive w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-500 hover:bg-slate-50 hover:text-slate-900';
        }
    });
    render();
};

function calculateCriticality(deps = []) {
    if (deps.length === 0) return 0;
    let score = 0;
    deps.forEach(d => {
        if (d.impact === 'Critical') score += 35;
        else if (d.impact === 'High Impact') score += 15;
        else score += 5;
    });
    return Math.min(score, 100);
}

// --- INTERACTIVE ACTIONS ---
window.selectCase = (id) => {
    selectedKnowledgeId = id;
    if(currentTab !== 'knowledge') window.setTabAndCloseMenu('knowledge');
    else render();
};

window.selectTelemetry = (id) => {
    selectedTelemetryId = id;
    if(currentTab === 'employees') render();
};

window.updateResponse = (id, field, val) => {
    const t = data.transitions.find(x => x.id === id);
    if(t) t.responses[field] = val;
};

window.generateBible = (id) => {
    isGenerating = true;
    render();
    setTimeout(() => {
        isGenerating = false;
        const t = data.transitions.find(x => x.id === id);
        if(t) t.knowledgeCaptured = 100;
        render();
    }, 1500);
};

// --- RENDER ENGINE ---
function render() {
    const container = document.getElementById('content-area');
    container.innerHTML = '';

    if (!data.metrics) {
        // Data hasn't loaded yet
        container.innerHTML = '<div class="flex h-full items-center justify-center"><i data-lucide="loader" class="w-8 h-8 animate-spin text-indigo-600"></i></div>';
        if (window.lucide) {
            lucide.createIcons();
        }
        return;
    }

    if (currentTab === 'dashboard') renderDashboard(container);
    if (currentTab === 'employees') renderEmployees(container);
    if (currentTab === 'transitions') renderTransitions(container);
    if (currentTab === 'tasks') renderTasks(container);
    if (currentTab === 'logistics') renderLogistics(container);
    if (currentTab === 'licenses') renderLicenses(container);
    if (currentTab === 'knowledge') renderKnowledge(container);
    if (currentTab === 'audit') renderAudit(container);
    if (currentTab === 'documentation') renderDocumentation(container);

    if (window.lucide) {
        lucide.createIcons();
    }
}

function getBadgeClass(risk) {
    if (risk === 'critical') return 'badge-critical';
    if (risk === 'high') return 'badge-high';
    if (risk === 'medium') return 'badge-medium';
    return 'badge-purple';
}

function getProgressColor(risk) {
    if (risk === 'critical') return 'bg-rose-500';
    if (risk === 'high') return 'bg-amber-500';
    if (risk === 'medium') return 'bg-indigo-500';
    return 'bg-emerald-500';
}

// --- SCREEN: DASHBOARD ---
function renderDashboard(container) {
    container.innerHTML = `
        <div class="mb-8 animate-in fade-in duration-500">
            <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p class="text-sm text-slate-500 mt-1">Overview of employee transitions, knowledge risks, and license health</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div class="card p-5">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Transitions</p>
                    <div class="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><i data-lucide="arrow-right-left" class="w-3.5 h-3.5"></i></div>
                </div>
                <p class="text-3xl font-black text-slate-900">${data.metrics.active}</p>
                <p class="text-xs text-slate-500 mt-1">2 offboarding</p>
            </div>
            <div class="card p-5">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Tasks</p>
                    <div class="p-1.5 bg-amber-50 text-amber-600 rounded-md"><i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i></div>
                </div>
                <p class="text-3xl font-black text-slate-900">${data.metrics.tasks.total}</p>
                <p class="text-xs text-slate-500 mt-1"><span class="text-amber-600 font-medium">${data.metrics.tasks.critical} critical</span></p>
            </div>
            <div class="card p-5">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghost Licenses</p>
                    <div class="p-1.5 bg-rose-50 text-rose-600 rounded-md"><i data-lucide="trending-down" class="w-3.5 h-3.5"></i></div>
                </div>
                <p class="text-3xl font-black text-slate-900">7</p>
                <p class="text-xs text-rose-600 font-medium mt-1">$${data.metrics.ghostWasted}/mo wasted</p>
            </div>
            <div class="card p-5">
                <div class="flex justify-between items-start mb-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High Risk Knowledge</p>
                    <div class="p-1.5 bg-purple-50 text-purple-600 rounded-md"><i data-lucide="brain" class="w-3.5 h-3.5"></i></div>
                </div>
                <p class="text-3xl font-black text-slate-900">${data.metrics.highRisk}</p>
                <p class="text-xs text-slate-500 mt-1">employees with score > 70</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mb-6">
            <div class="lg:col-span-2 card p-4 md:p-6 overflow-x-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-sm text-slate-800">Active Transitions</h3>
                    <button onclick="setTabAndCloseMenu('transitions')" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</button>
                </div>
                <div class="space-y-4 min-w-[500px]">
                    ${data.transitions.map(t => `
                        <div class="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors bg-white">
                            <div class="flex items-center gap-4">
                                <div class="w-8 h-8 rounded bg-${t.status === 'Offboarding' ? 'rose' : 'emerald'}-50 flex items-center justify-center text-${t.status === 'Offboarding' ? 'rose' : 'emerald'}-600">
                                    <i data-lucide="arrow-${t.status === 'Offboarding' ? 'up-right' : 'down-right'}" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-slate-900">${t.name}</p>
                                    <p class="text-[11px] text-slate-500">${t.role} - ${t.status}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 md:gap-6 w-1/3 min-w-[150px] md:min-w-[200px]">
                                <span class="badge ${getBadgeClass(t.risk)} w-16 text-center">${t.risk}</span>
                                <div class="flex-1 hidden sm:block">
                                    <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div class="h-full ${getProgressColor(t.risk)} rounded-full" style="width: ${t.progress}%"></div>
                                    </div>
                                </div>
                                <span class="text-xs font-medium text-slate-500 w-8 text-right">${t.progress}%</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="lg:col-span-1 card p-6 flex flex-col">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-sm text-slate-800">License Costs</h3>
                    <button onclick="setTabAndCloseMenu('licenses')" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</button>
                </div>
                <div class="flex-1 flex flex-col justify-center items-center">
                    <i data-lucide="pie-chart" class="w-32 h-32 text-indigo-500 mb-6 drop-shadow-sm"></i>
                    <div class="w-full space-y-3">
                        <div class="flex justify-between items-center text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-500"></span>Analytics</span><span class="font-bold text-slate-700">$188</span></div>
                        <div class="flex justify-between items-center text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-500"></span>Security</span><span class="font-bold text-slate-700">$93</span></div>
                        <div class="flex justify-between items-center text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-500"></span>Project Mgt</span><span class="font-bold text-slate-700">$48</span></div>
                        <div class="flex justify-between items-center text-xs pt-3 border-t border-slate-100"><span class="font-medium text-slate-500">Total Wasted/Mo</span><span class="font-black text-slate-900">$441</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div class="card p-6 overflow-x-auto">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-sm text-slate-800">Knowledge Risk Scores</h3>
                    <button class="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</button>
                </div>
                <div class="space-y-4 min-w-[300px]">
                    ${[...data.employees, ...data.transitions].sort((a,b) => (b.score || 0) - (a.score || 0)).slice(0,6).map(emp => `
                        <div class="flex items-center gap-4">
                            <div class="w-24 md:w-32">
                                <p class="text-xs font-bold text-slate-900 truncate">${emp.name}</p>
                                <p class="text-[10px] text-slate-500 truncate">${emp.dept || emp.role}</p>
                            </div>
                            <div class="flex-1">
                                <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div class="h-full ${emp.score > 80 ? 'bg-rose-500' : (emp.score > 60 ? 'bg-amber-500' : 'bg-emerald-500')} rounded-full" style="width: ${emp.score}%"></div>
                                </div>
                            </div>
                            <div class="w-16 text-right flex flex-col md:block">
                                <span class="text-xs font-bold text-slate-700">${emp.score}</span>
                                <span class="text-[10px] text-slate-500 ml-1">${emp.score > 80 ? 'Critical' : (emp.score > 60 ? 'High' : 'Medium')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-sm text-slate-800">Urgent Tasks</h3>
                    <button onclick="setTabAndCloseMenu('tasks')" class="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all &rarr;</button>
                </div>
                <div class="space-y-4">
                    ${data.tasks.filter(t => !t.completed).slice(0,5).map(t => `
                        <div class="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 flex-wrap gap-2">
                            <div class="flex items-start gap-3 w-full sm:w-auto">
                                <div class="mt-0.5 w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0"></div>
                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-slate-900 truncate">${t.title}</p>
                                    <p class="text-[10px] text-slate-500 truncate">${t.desc}</p>
                                </div>
                            </div>
                            <div class="text-right sm:ml-auto pl-7 sm:pl-0">
                                <span class="text-[10px] font-bold ${t.priority === 'CRITICAL' ? 'text-rose-600' : (t.priority === 'HIGH' ? 'text-amber-600' : 'text-slate-500')}">${t.completed ? 'Completed' : (t.priority === 'CRITICAL' ? 'In Progress' : 'Pending')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// --- SCREEN: EMPLOYEES ---
function renderEmployees(container) {
    const allStaff = data.employees;
    const selectedEmployee = allStaff.find(e => e.id === selectedTelemetryId) || allStaff[0];

    container.innerHTML = `
        <div class="animate-in fade-in duration-500 flex flex-col h-full">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 shrink-0">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Productivity Telemetry</h1>
                    <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Workforce Intelligence & Optimization</p>
                </div>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> Add Employee
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 shrink-0">
                <div class="card p-4 md:p-6 flex flex-col items-center justify-center text-center">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2 md:mb-3">
                        <i data-lucide="trending-up" class="w-4 h-4 md:w-5 md:h-5"></i>
                    </div>
                    <p class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Org Velocity</p>
                    <p class="text-xl md:text-3xl font-black text-slate-900">+12%</p>
                </div>
                <div class="card p-4 md:p-6 flex flex-col items-center justify-center text-center">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2 md:mb-3">
                        <i data-lucide="zap" class="w-4 h-4 md:w-5 md:h-5"></i>
                    </div>
                    <p class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deep Work</p>
                    <p class="text-xl md:text-3xl font-black text-slate-900">42%</p>
                </div>
                <div class="card p-4 md:p-6 flex flex-col items-center justify-center text-center">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2 md:mb-3">
                        <i data-lucide="calendar" class="w-4 h-4 md:w-5 md:h-5"></i>
                    </div>
                    <p class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meeting Load</p>
                    <p class="text-xl md:text-3xl font-black text-slate-900">18h</p>
                </div>
                <div class="card p-4 md:p-6 flex flex-col items-center justify-center text-center">
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-2 md:mb-3">
                        <i data-lucide="activity" class="w-4 h-4 md:w-5 md:h-5"></i>
                    </div>
                    <p class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Burnout Signal</p>
                    <p class="text-xl md:text-3xl font-black text-slate-900">2 <span class="text-sm md:text-base font-bold">High</span></p>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start flex-1 min-h-0">

                <div class="w-full lg:w-[320px] flex flex-col shrink-0 lg:h-full mb-6 lg:mb-0">
                    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Active Roster</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 lg:overflow-y-auto lg:pr-2 lg:pb-10 scrollbar-hide">
                        ${allStaff.map(emp => `
                            <button onclick="window.selectTelemetry('${emp.id}')" class="w-full text-left p-4 md:p-5 rounded-2xl border transition-all ${selectedTelemetryId === emp.id ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}">
                                <div class="flex justify-between items-start mb-1">
                                    <p class="font-bold text-slate-900">${emp.name}</p>
                                    <span class="text-[8px] md:text-[9px] font-black uppercase tracking-widest ${emp.state === 'OPTIMAL' ? 'text-emerald-500' : 'text-rose-500'}">${emp.state}</span>
                                </div>
                                <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">${emp.role}</p>

                                <div class="flex items-end justify-between gap-4">
                                    <div class="flex-1">
                                        <div class="flex justify-between text-[10px] text-slate-400 font-bold mb-1.5">
                                            <span>FOCUS</span>
                                            <span>${emp.focus}%</span>
                                        </div>
                                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div class="h-full bg-indigo-500 rounded-full" style="width: ${emp.focus}%"></div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Output</p>
                                        <p class="text-lg font-black text-slate-900 leading-none">${emp.output}</p>
                                    </div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="flex-1 card p-4 md:p-8 w-full lg:h-full lg:overflow-y-auto">
                    <div class="flex justify-between items-start mb-6 md:mb-8">
                        <div>
                            <h2 class="text-xl md:text-2xl font-bold text-slate-900">${selectedEmployee.name} <span class="text-slate-300 font-normal">/ Signal Analysis</span></h2>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Data Source Breakdown</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
                            <div class="flex items-center gap-2 mb-4 text-slate-500">
                                <i data-lucide="git-branch" class="w-4 h-4"></i>
                                <span class="text-[10px] font-bold uppercase tracking-widest">VCS (GitHub/GitLab)</span>
                            </div>
                            <p class="text-2xl md:text-3xl font-black text-slate-900 mb-1">${selectedEmployee.github.commits}</p>
                            <p class="text-xs font-bold text-slate-400 mb-3">Commits</p>
                            <div class="flex gap-4 text-xs font-medium text-slate-500">
                                <span><strong class="text-slate-700">${selectedEmployee.github.prs}</strong> PRs</span>
                                <span><strong class="text-slate-700">${selectedEmployee.github.lines}</strong> Lines</span>
                            </div>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
                            <div class="flex items-center gap-2 mb-4 text-slate-500">
                                <i data-lucide="calendar" class="w-4 h-4"></i>
                                <span class="text-[10px] font-bold uppercase tracking-widest">Calendar API</span>
                            </div>
                            <p class="text-2xl md:text-3xl font-black text-slate-900 mb-1">${selectedEmployee.calendar.hours}h</p>
                            <p class="text-xs font-bold text-slate-400 mb-3">In Meetings</p>
                            <div class="flex gap-4 text-xs font-medium text-slate-500">
                                <span><strong class="text-slate-700">${selectedEmployee.calendar.conflicts}</strong> Conflicts</span>
                                <span>Weekly Load</span>
                            </div>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
                            <div class="flex items-center gap-2 mb-4 text-slate-500">
                                <i data-lucide="message-square" class="w-4 h-4"></i>
                                <span class="text-[10px] font-bold uppercase tracking-widest">Slack Telemetry</span>
                            </div>
                            <p class="text-2xl md:text-3xl font-black text-slate-900 mb-1">${selectedEmployee.slack.afterHours}h</p>
                            <p class="text-xs font-bold text-slate-400 mb-3">After Hours</p>
                            <div class="flex gap-4 text-xs font-medium text-slate-500">
                                <span><strong class="text-slate-700">${selectedEmployee.slack.reply}</strong> Avg Reply</span>
                                <span class="${selectedEmployee.slack.afterHours > 5 ? 'text-rose-500 font-bold' : ''}">Burnout Signal</span>
                            </div>
                        </div>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
                            <div class="flex items-center gap-2 mb-4 text-slate-500">
                                <i data-lucide="check-circle" class="w-4 h-4"></i>
                                <span class="text-[10px] font-bold uppercase tracking-widest">Jira/Linear</span>
                            </div>
                            <p class="text-2xl md:text-3xl font-black text-slate-900 mb-1">${selectedEmployee.jira.tickets}</p>
                            <p class="text-xs font-bold text-slate-400 mb-3">Tickets Done</p>
                            <div class="flex gap-4 text-xs font-medium text-slate-500">
                                <span><strong class="text-slate-700">${selectedEmployee.jira.rollovers}</strong> Rollovers</span>
                                <span>Sprint Velocity</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 md:p-6">
                        <div class="flex items-center gap-2 mb-3 text-indigo-600">
                            <i data-lucide="bot" class="w-4 h-4"></i>
                            <span class="text-[10px] font-bold uppercase tracking-widest">Automated Insight</span>
                        </div>
                        <p class="text-sm font-medium text-indigo-900 leading-relaxed">
                            ${selectedEmployee.insight}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// --- SCREEN: TRANSITIONS ---
function renderTransitions(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Transitions</h1>
                    <p class="text-sm text-slate-500 mt-1">${data.transitions.length} active workflows</p>
                </div>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> New Transition
                </button>
            </div>

            <div class="flex gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <select class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none shrink-0"><option>All Types</option></select>
                <select class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none shrink-0"><option>All Statuses</option></select>
            </div>

            <div class="space-y-4">
                ${data.transitions.map((t, i) => `
                    <div class="card p-4 md:p-5 hover:border-indigo-300 transition-colors cursor-pointer">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                            <div class="flex items-start md:items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-${t.status === 'Offboarding' ? 'rose' : 'emerald'}-50 flex items-center justify-center text-${t.status === 'Offboarding' ? 'rose' : 'emerald'}-600 shrink-0">
                                    <i data-lucide="arrow-${t.status === 'Offboarding' ? 'up-right' : 'down-right'}" class="w-5 h-5"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex flex-wrap items-center gap-2 mb-1">
                                        <p class="text-sm font-bold text-slate-900 truncate">${t.name}</p>
                                        <span class="badge ${t.progress === 100 ? 'badge-medium' : 'badge-high'}">${t.progress === 100 ? 'COMPLETED' : 'IN PROGRESS'}</span>
                                        <span class="badge ${getBadgeClass(t.risk)}">${t.risk}</span>
                                    </div>
                                    <p class="text-xs text-slate-500 truncate">${t.status} · ${t.role} · Assigned to Nina Patel</p>
                                    <p class="text-xs text-slate-500 mt-2 hidden sm:block">${t.status === 'Offboarding' ? (t.progress === 100 ? 'Completed - security credentials revoked' : 'Design system handover critical') : 'New marketing manager starting'}</p>
                                </div>
                            </div>
                            <div class="w-full md:w-48 ml-[56px] md:ml-0">
                                <div class="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                                    <span>Due Mar ${i+1}</span>
                                    <span>${t.progress}%</span>
                                </div>
                                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div class="h-full bg-indigo-500 rounded-full" style="width: ${t.progress}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- SCREEN: TASKS ---
function renderTasks(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-slate-900">Tasks</h1>
                <p class="text-sm text-slate-500 mt-1">${data.tasks.filter(t=>t.completed).length}/${data.tasks.length} completed · ${data.tasks.filter(t=>!t.completed && t.priority==='CRITICAL').length} critical pending</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="card p-4 md:p-5 text-center">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                    <p class="text-xl md:text-2xl font-black text-slate-900">${data.tasks.length}</p>
                </div>
                <div class="card p-4 md:p-5 text-center">
                    <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Completed</p>
                    <p class="text-xl md:text-2xl font-black text-emerald-600">${data.tasks.filter(t=>t.completed).length}</p>
                </div>
                <div class="card p-4 md:p-5 text-center">
                    <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Pending</p>
                    <p class="text-xl md:text-2xl font-black text-amber-600">${data.tasks.filter(t=>!t.completed).length}</p>
                </div>
                <div class="card p-4 md:p-5 text-center">
                    <p class="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Critical</p>
                    <p class="text-xl md:text-2xl font-black text-rose-600">${data.tasks.filter(t=>!t.completed && t.priority==='CRITICAL').length}</p>
                </div>
            </div>

            <div class="flex gap-2 sm:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <select class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none shrink-0"><option>All Categories</option></select>
                <select class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none shrink-0"><option>All Statuses</option></select>
                <select class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 shadow-sm outline-none shrink-0"><option>All Priorities</option></select>
            </div>

            <div class="card overflow-hidden">
                <div class="divide-y divide-slate-100">
                    ${data.tasks.map(t => `
                        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 hover:bg-slate-50 transition-colors">
                            <div class="flex items-start gap-4">
                                <button class="mt-0.5 sm:mt-0 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${t.completed ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-300'}">
                                    ${t.completed ? '<i data-lucide="check" class="w-3 h-3"></i>' : '<div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>'}
                                </button>
                                <div>
                                    <p class="text-sm font-bold ${t.completed ? 'text-slate-400 line-through' : 'text-slate-900'}">${t.title}</p>
                                    <p class="text-[11px] text-slate-500 mt-0.5">${t.desc}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 sm:gap-6 ml-9 sm:ml-0">
                                <span class="text-[10px] font-medium text-slate-500 w-16 text-right hidden sm:inline-block">${t.dept}</span>
                                <span class="badge ${t.priority === 'CRITICAL' ? 'badge-critical' : (t.priority === 'HIGH' ? 'badge-high' : 'badge-purple')} w-20 text-center">${t.priority}</span>
                                <span class="text-xs text-slate-400 w-12 text-right flex items-center justify-end gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${t.time}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// --- SCREEN: AUDIT LOG ---
function renderAudit(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-slate-900">Audit Log</h1>
                <p class="text-sm text-slate-500 mt-1">Track all system activities and changes</p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mb-6">
                <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64 shadow-sm">
                    <i data-lucide="search" class="w-4 h-4 text-slate-400 mr-2 shrink-0"></i>
                    <input type="text" placeholder="Search logs..." class="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-400">
                </div>
                <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button class="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm shrink-0">All</button>
                    <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 shrink-0">Transition</button>
                    <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 shrink-0">License</button>
                    <button class="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 shrink-0">Access</button>
                </div>
            </div>

            <div class="card overflow-hidden">
                <div class="divide-y divide-slate-100">
                    ${data.auditLogs.map(log => {
                        let iconBg = 'bg-slate-100'; let iconColor = 'text-slate-500'; let iconType = 'activity'; let badgeClass = 'bg-slate-100 text-slate-600';
                        if(log.tag === 'transition') { iconBg = 'bg-blue-50'; iconColor = 'text-blue-500'; iconType = 'arrow-right-left'; badgeClass = 'bg-blue-50 text-blue-600'; }
                        if(log.tag === 'license') { iconBg = 'bg-purple-50'; iconColor = 'text-purple-500'; iconType = 'file-text'; badgeClass = 'bg-purple-50 text-purple-600'; }
                        if(log.tag === 'access') { iconBg = 'bg-rose-50'; iconColor = 'text-rose-500'; iconType = 'shield-off'; badgeClass = 'bg-rose-50 text-rose-600'; }
                        if(log.tag === 'knowledge') { iconBg = 'bg-emerald-50'; iconColor = 'text-emerald-500'; iconType = 'brain'; badgeClass = 'bg-emerald-50 text-emerald-600'; }

                        return `
                        <div class="p-4 flex items-start gap-3 md:gap-4 hover:bg-slate-50 transition-colors">
                            <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg ${iconBg} flex items-center justify-center shrink-0">
                                <i data-lucide="${iconType}" class="w-4 h-4 md:w-5 md:h-5 ${iconColor}"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <p class="text-sm font-bold text-slate-900">${log.title}</p>
                                    <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass}">${log.tag}</span>
                                </div>
                                <p class="text-xs md:text-sm text-slate-600 mb-2">${log.desc}</p>
                                <div class="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-[11px] text-slate-400 font-medium">
                                    <span class="flex items-center gap-1"><i data-lucide="user" class="w-3 h-3"></i> <span class="truncate max-w-[100px]">${log.user}</span></span>
                                    <span class="flex items-center gap-1"><i data-lucide="tag" class="w-3 h-3"></i> ${log.action}</span>
                                    <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> ${log.date}</span>
                                </div>
                            </div>
                        </div>
                        `
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// --- SCREEN: DOCUMENTATION ---
function renderDocumentation(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-slate-900">Documentation</h1>
                <p class="text-sm text-slate-500 mt-1">Complete guide to TransitionIQ features and workflows</p>
            </div>

            <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full max-w-md shadow-sm mb-6">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 mr-2 shrink-0"></i>
                <input type="text" placeholder="Search documentation..." class="bg-transparent border-none outline-none text-xs w-full placeholder:text-slate-400">
            </div>

            <div class="space-y-4">
                <div class="card overflow-hidden border border-indigo-200 ring-1 ring-indigo-50">
                    <div class="flex items-center justify-between p-4 bg-indigo-50/50 cursor-pointer">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"><i data-lucide="book-open" class="w-4 h-4"></i></div>
                            <h3 class="font-bold text-slate-900 text-sm">Platform Overview</h3>
                        </div>
                        <i data-lucide="chevron-up" class="w-4 h-4 text-slate-400"></i>
                    </div>
                    <div class="p-4 md:p-6 border-t border-slate-100 bg-white">
                        <p class="text-sm text-slate-600 leading-relaxed mb-6">
                            TransitionIQ is an intelligent platform designed to streamline employee transitions, knowledge management, and resource optimization. It helps organizations minimize disruption during onboarding and offboarding while capturing critical institutional knowledge.
                        </p>
                        <h4 class="font-bold text-xs text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <i data-lucide="target" class="w-4 h-4 text-indigo-600"></i> Key Benefits
                        </h4>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-3 text-sm text-slate-600">
                                <i data-lucide="check" class="w-4 h-4 text-indigo-600 mt-0.5 shrink-0"></i> Reduce transition time by up to 60%
                            </li>
                            <li class="flex items-start gap-3 text-sm text-slate-600">
                                <i data-lucide="check" class="w-4 h-4 text-indigo-600 mt-0.5 shrink-0"></i> Capture and preserve institutional knowledge
                            </li>
                            <li class="flex items-start gap-3 text-sm text-slate-600">
                                <i data-lucide="check" class="w-4 h-4 text-indigo-600 mt-0.5 shrink-0"></i> Automate task management and compliance
                            </li>
                            <li class="flex items-start gap-3 text-sm text-slate-600">
                                <i data-lucide="check" class="w-4 h-4 text-indigo-600 mt-0.5 shrink-0"></i> Optimize license costs and resource allocation
                            </li>
                            <li class="flex items-start gap-3 text-sm text-slate-600">
                                <i data-lucide="check" class="w-4 h-4 text-indigo-600 mt-0.5 shrink-0"></i> Track all activities with comprehensive audit logs
                            </li>
                        </ul>
                    </div>
                </div>

                ${['Dashboard', 'Employee Management', 'Transition Management', 'Task Management', 'Knowledge Capture'].map(title => {
                    let icon = 'layout-dashboard';
                    if(title.includes('Employee')) icon = 'users';
                    if(title.includes('Transition')) icon = 'arrow-right-left';
                    if(title.includes('Task')) icon = 'clipboard-list';
                    if(title.includes('Knowledge')) icon = 'brain-circuit';

                    return `
                    <div class="card p-4 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-500 shrink-0"><i data-lucide="${icon}" class="w-4 h-4"></i></div>
                            <h3 class="font-bold text-slate-900 text-sm">${title}</h3>
                        </div>
                        <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400"></i>
                    </div>
                `}).join('')}
            </div>
        </div>
    `;
}

// --- SCREEN: HARDWARE LOGISTICS ---
function renderLogistics(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Hardware Logistics</h1>
                    <p class="text-sm text-slate-500 mt-1">Track and retrieve physical assets from remote employees</p>
                </div>
                <button class="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i data-lucide="box" class="w-4 h-4"></i> Dispatch Kit
                </button>
            </div>

            <div class="card overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="py-3 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee</th>
                            <th class="py-3 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset</th>
                            <th class="py-3 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tracking</th>
                            <th class="py-3 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th class="py-3 px-4 md:px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${data.transitions.filter(t=>t.status==='Offboarding').map(t => `
                            <tr class="hover:bg-slate-50 transition-colors">
                                <td class="py-3 md:py-4 px-4 md:px-6">
                                    <p class="font-bold text-sm text-slate-900 whitespace-nowrap">${t.name}</p>
                                    <p class="text-[10px] md:text-xs text-slate-500">${t.location}</p>
                                </td>
                                <td class="py-3 md:py-4 px-4 md:px-6 text-xs md:text-sm text-slate-600 font-medium flex items-center gap-2">
                                    <i data-lucide="laptop" class="w-4 h-4 text-slate-400 shrink-0"></i> <span class="truncate max-w-[120px] md:max-w-none">${t.hw}</span>
                                </td>
                                <td class="py-3 md:py-4 px-4 md:px-6 font-mono text-[10px] md:text-xs text-indigo-600 font-medium">
                                    ${t.tracking !== '-' ? `<a href="#" class="hover:underline flex items-center gap-1">${t.tracking} <i data-lucide="external-link" class="w-3 h-3 hidden md:block"></i></a>` : '<span class="text-slate-300">N/A</span>'}
                                </td>
                                <td class="py-3 md:py-4 px-4 md:px-6">
                                    <span class="badge ${t.hwStatus === 'In Transit' ? 'badge-medium' : (t.hwStatus === 'Issued' ? 'badge-purple' : 'badge-high')}">${t.hwStatus}</span>
                                </td>
                                <td class="py-3 md:py-4 px-4 md:px-6 text-right">
                                    <button class="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-md"><i data-lucide="more-horizontal" class="w-4 h-4"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// --- SCREEN: LICENSE AUDIT ---
function renderLicenses(container) {
    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-slate-900">License Audit</h1>
                <p class="text-sm text-slate-500 mt-1">Identify and revoke unused software seats to prevent financial waste.</p>
            </div>

            <div class="grid grid-cols-1 gap-4">
                ${data.transitions.filter(t => t.status === 'Offboarding').map(t => `
                    <div class="card p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 border-l-4 border-rose-500 hover:shadow-md transition-shadow">
                        <div class="flex items-start md:items-center gap-4 md:gap-5">
                            <div class="w-10 h-10 md:w-12 md:h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 shrink-0"><i data-lucide="alert-circle" class="w-5 h-5 md:w-6 md:h-6"></i></div>
                            <div>
                                <h3 class="font-bold text-slate-900 text-base md:text-lg flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                    ${t.name}
                                    <span class="text-[10px] md:text-xs font-medium text-slate-500 py-0.5 px-2 bg-slate-100 rounded-full w-fit">Departing in 4 days</span>
                                </h3>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <span class="badge bg-slate-50 text-slate-600 border border-slate-200">Salesforce</span>
                                    <span class="badge bg-slate-50 text-slate-600 border border-slate-200">Adobe CC</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-left md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 flex flex-row md:flex-col justify-between items-center md:items-end">
                            <div>
                                <p class="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Potential Waste</p>
                                <p class="text-xl md:text-2xl font-black text-rose-600 mb-0 md:mb-2">$${t.costWaste}/mo</p>
                            </div>
                            <button class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-colors shadow-sm">Revoke via Okta</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- SCREEN: KNOWLEDGE CAPTURE ---
function renderKnowledge(container) {
    const offboarding = data.transitions.filter(t => t.status === 'Offboarding');
    if (!selectedKnowledgeId && offboarding.length > 0) selectedKnowledgeId = offboarding[0].id;

    const selectedEmployee = data.transitions.find(x => x.id === selectedKnowledgeId);
    if (!selectedEmployee) return;

    const critScore = calculateCriticality(selectedEmployee.dependencies);

    container.innerHTML = `
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Knowledge Capture</h1>
                    <p class="text-sm text-slate-500 mt-1">AI-assisted institutional memory extraction</p>
                </div>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                    <i data-lucide="plus" class="w-4 h-4"></i> <span class="hidden sm:inline">New Session</span>
                </button>
            </div>

            <div class="flex flex-col lg:flex-row gap-6 items-start">

                <div class="w-full lg:w-1/3 space-y-3 shrink-0">
                    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Active Sessions</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                        ${offboarding.map(item => `
                            <button onclick="window.selectCase('${item.id}')" class="w-full text-left p-4 rounded-xl border transition-all ${selectedKnowledgeId === item.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300'}">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="font-bold text-slate-900">${item.name}</p>
                                    <span class="badge ${getBadgeClass(item.risk)}">${item.risk}</span>
                                </div>
                                <p class="text-xs text-slate-500 mb-2">${item.role}</p>
                                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div class="h-full bg-indigo-500 rounded-full" style="width: ${item.knowledgeCaptured}%"></div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="flex-1 card p-0 overflow-hidden bg-white w-full">

                    <div class="bg-slate-900 p-4 md:p-8 relative flex flex-col items-center justify-center min-h-[250px] md:min-h-[350px] border-b border-slate-200">
                        <div class="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-indigo-500/10 rounded-full blur-[40px] md:blur-[80px] -mr-16 md:-mr-32 -mt-16 md:-mt-32"></div>

                        <div class="w-full flex justify-between items-start mb-6 z-10 absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6">
                            <h4 class="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 md:gap-2"><i data-lucide="network" class="w-3 h-3 md:w-4 md:h-4"></i> Network</h4>
                            <span class="text-[9px] md:text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 md:px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-400/20 shadow-inner">Crit: ${critScore}%</span>
                        </div>

                        <div class="z-10 w-full flex justify-center mt-8 md:mt-8 transform scale-75 md:scale-100 origin-center">
                            ${renderGraphSVG(selectedEmployee)}
                        </div>
                    </div>

                    <div class="p-4 md:p-8">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                            <div>
                                <h3 class="text-lg md:text-xl font-bold text-slate-900">Synthesis Engine</h3>
                                <p class="text-[10px] md:text-xs text-slate-500 font-medium mt-1">Extraction: ${selectedEmployee.knowledgeCaptured}% Complete</p>
                            </div>
                            <button onclick="window.generateBible('${selectedEmployee.id}')" class="w-full sm:w-auto justify-center bg-slate-900 text-white px-4 py-2.5 md:py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-black transition-all ${isGenerating ? 'opacity-50' : ''}">
                                ${isGenerating ? '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processing' : '<i data-lucide="sparkles" class="w-4 h-4"></i> Synthesize'}
                            </button>
                        </div>

                        <div class="space-y-6 md:space-y-8">
                            ${createInputBlock(1, 'Infrastructure Dependencies', 'Identify specific cloud resources or legacy systems managed.', selectedEmployee.responses.context, 'context', selectedEmployee.id)}
                            ${createInputBlock(2, 'Key Client Nuances', 'Identify unwritten communication styles and revenue triggers.', selectedEmployee.responses.stakeholders, 'stakeholders', selectedEmployee.id)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// --- SUB-COMPONENTS FOR KNOWLEDGE TAB ---
function createInputBlock(num, title, q, val, field, id) {
    return `
    <div class="relative pl-10 md:pl-12 group">
        <div class="absolute left-0 top-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all shadow-sm">${num}</div>
        <h4 class="font-bold text-slate-800 mb-0.5 text-sm">${title}</h4>
        <p class="text-[10px] md:text-xs text-slate-500 mb-2 md:mb-3">${q}</p>
        <textarea onchange="updateResponse('${id}', '${field}', this.value)" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4 text-xs md:text-sm min-h-[80px] md:min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all">${val}</textarea>
    </div>`;
}

function renderGraphSVG(t) {
    const deps = t.dependencies || [];
    if(deps.length === 0) return `<p class="text-slate-500 text-sm italic">No dependencies mapped yet.</p>`;

    const radius = 120;
    const center = 150;
    const viewBox = 300;
    const colors = { 'Client-Side': '#3b82f6', 'Internal-Org': '#a855f7', 'Infrastructure': '#f59e0b', 'Vendor/External': '#64748b' };

    const points = deps.map((d, i) => {
        const angle = (i / deps.length) * 2 * Math.PI - Math.PI / 2;
        return { ...d, x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
    });

    const linesHtml = points.map(p => `<line x1="${center}" y1="${center}" x2="${p.x}" y2="${p.y}" stroke="${colors[p.category] || '#ccc'}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 4" />`).join('');
    const nodesHtml = points.map(p => `
        <g class="group/node">
            <circle cx="${p.x}" cy="${p.y}" r="8" fill="${colors[p.category] || '#ccc'}" class="dependency-node" />
            <text x="${p.x}" y="${p.y + 20}" text-anchor="middle" fill="#94a3b8" font-size="8" font-weight="700" class="uppercase tracking-widest node-label">${p.description.substring(0, 15)}</text>
        </g>
    `).join('');

    return `
    <svg viewBox="0 0 ${viewBox} ${viewBox}" class="w-full max-w-[300px] drop-shadow-2xl overflow-visible">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#1e293b" stroke-width="1" stroke-dasharray="6 6" />
        ${linesHtml}${nodesHtml}
        <g>
            <circle cx="${center}" cy="${center}" r="30" fill="#4F46E5" class="shadow-2xl" />
            <text x="${center}" y="${center + 4}" text-anchor="middle" fill="white" font-size="14" font-weight="700">${t.name.split(' ').map(n => n[0]).join('')}</text>
        </g>
    </svg>`;
}

// Initialize App
window.onload = () => {
    initializeData();
};