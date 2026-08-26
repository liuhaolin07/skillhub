// ─── i18n ───
const I18N = {
  zh: {
    subtitle: '通用 Agent Skill 管理工具',
    statDisabled: '已禁用',
    statAudited: '已审计',
    searchPlaceholder: '搜索 skill 名称、描述或标签...',
    platformLabel: '平台架构', platformHint: '按 Agent 组织来源与权限',
    workspaceLabel: '工作区', navigation: '导航与筛选', allSkills: '全部 Skills',
    agentsAndSources: 'Agents & Sources', libraryEyebrow: 'Skill Registry',
    skillsLibrary: '技能库', libraryContext: '跨 Agent 浏览、对比与管理技能资产',
    filterButton: '筛选', openNavigation: '打开导航',
    allAgents: '全部平台', manageMode: '可管理', observeMode: '只读',
    agentMeta: (i, s) => `${i} 个实例 · ${s} 个技能`,
    clearFilters: '清除全部', filterAgent: 'Agent', filterSource: 'Source',
    filterCategory: '分类', filterStatus: '状态', filterSearch: '搜索',
    scopedContext: (n, a) => `当前范围 ${n} 个技能 · ${a} 个 Agent`,
    allSources: '所有 Source',
    allCategories: '所有分类',
    anyStatus: '全部状态',
    onlyEnabled: '✅ 仅启用',
    onlyDisabled: '⛔ 仅禁用',
    batchDisable: '⛔ 禁用所选',
    batchEnable: '▶ 启用所选',
    compareBtn: '📊 跨 Source 对比',
    createBtn: '＋ 新建 Skill',
    categories: '分类',
    detailTitle: 'Skill 详情',
    tabInfo: '📋 信息', tabSecurity: '🛡️ 安全', tabEdit: '✏️ 编辑', tabFiles: '📁 文件', tabCompare: '📊 对比',
    // detail info
    secBasic: '基本信息', fName: '名称', fCategory: '分类', fSource: '来源',
    fVersion: '版本', fAuthor: '作者', fPath: '路径', fSize: '大小', fModified: '修改时间',
    secStatus: '状态', enabledBadge: '已启用', disabledBadge: '已禁用',
    btnEnable: '▶ 启用', btnDisable: '⏸ 禁用',
    secPlatforms: '平台', secTags: '标签', noDesc: '(无描述)', none: '-',
    secPreview: '内容预览', emptyBody: '(空)',
    secDesc: '描述', noMatch: '没有匹配的 skill',
    warming: '⏳ 正在扫描 skill 库…',
    // edit form
    eName: '名称', eDesc: '描述', eVersion: '版本', eAuthor: '作者',
    ePlatforms: '平台 (逗号分隔)', eTags: '标签 (逗号分隔)', eBody: 'SKILL.md 正文',
    save: '💾 保存', cancel: '取消', back: '← 返回',
    // files
    filesCount: '文件', noSubfiles: '无子文件', newSubfile: '新建子文件',
    subfileType: '类型', refDoc: 'references (文档)', tmplDoc: 'templates (模板)', scriptDoc: 'scripts (脚本)',
    fileName: '文件名', create: '➕ 创建', editingFile: '编辑',
    // compare
    compareTitle: '跨 Source 对比', compareOf: '跨 Source 对比',
    multiSourceSkills: '多 Source 共存的 Skill',
    noCrossSource: '没有跨 source 的同名 skill',
    noSameOtherSource: '其他 source 中没有同名 skill',
    loading: '加载中...',
    copyVerb: '复制', moveVerb: '移动',
    // create dialog
    newSkill: '新建 Skill', nSource: 'Source', nCategory: '分类', nName: '名称',
    nDesc: '描述', nVersion: '版本', nAuthor: '作者', nBody: 'SKILL.md 正文',
    nBodyPlaceholder: '# 新 Skill\\n\\n在此编写 SKILL.md 正文...',
    phCategory: 'e.g. my-category', phName: 'e.g. my-skill', phDesc: 'Skill 描述', phFilename: 'e.g. api-reference.md',
    // messages
    saved: '✅ 保存成功', fileSaved: '✅ 文件保存成功', fileCreated: '✅ 文件已创建',
    created: '✅ Skill 创建成功', deleted: '✅ 已删除',
    needNameCat: '请填写名称和分类', needFilename: '请输入文件名',
    readFail: '❌ 读取文件失败: ',
    migrateTitle: '📦 迁移到其他 Source', migrateBtn: '📤 迁移',
    migrateTarget: '目标 Source', migrateCategory: '目标分类（留空 = migrated）',
    migrateMode: '方式', copyMode: '📋 复制（保留原件）', moveMode: '✂️ 移动（删除原件）',
    migrateGo: '🚀 执行迁移', migrateOverwrite: '覆盖同名目标', confirmMigrate: (s, d, n) => `确定${s} "${n}" 到 ${d} 吗？`,
    migrated: r => `✅ ${r}`, migrateFail: '❌ 迁移失败: ',
    targetExists: '目标已存在同名 skill，可勾选「覆盖」后重试',
    flatHint: '该 agent 使用平铺目录，无需分类',
    disabledMsg: name => `✅ 已禁用 ${name}`, enabledMsg: name => `✅ 已启用 ${name}`,
    confirmDelete: name => `确定删除 "${name}" 吗？此操作不可恢复。`,
    confirmBatch: (n, a) => a === 'disable' ? `确定禁用 ${n} 个 skill 吗？` : `确定启用 ${n} 个 skill 吗？`,
    batchDone: (n, a) => a === 'disable' ? `✅ 已禁用 ${n} 个 skill` : `✅ 已启用 ${n} 个 skill`,
    selectedN: n => `已选 ${n} 项`,
    loadFail: e => `加载失败: ${e}`,
    errPrefix: '❌ ',
    clickToEnable: '点击启用', clickToDisable: '点击禁用',
    disabledTag: '已禁用',
    // sort & rescan & preview
    tabPreview: '👁️ 预览',
    sortDefault: '默认排序', sortName: '🔤 名称 A→Z', sortNameDesc: '🔤 名称 Z→A',
    sortModified: '🕐 最近修改', sortSize: '📦 体积最大',
    rescanTip: '重新扫描所有 skill 目录（外部改动后用）',
    rescanning: '⏳ 正在重扫…',
    rescanDone: n => `✅ 重扫完成：${n} 个 skill`,
    showingOf: (a, b) => `共 ${b} 个，显示 ${a} 个`,
    mdRenderFail: '⚠️ Markdown 渲染失败，以下为原文：',
    themeTip: '切换深色/浅色主题', darkModeTip: '当前：深色主题', lightModeTip: '当前：浅色主题',
    gridViewTip: '卡片视图', listViewTip: '列表视图',
    securityReady: (v, n) => `agent-skill-scanner ${v || ''} · ${n} 条规则`,
    securityUnavailable: '安全扫描引擎未配置',
    securityQuickScan: '⚡ 快速扫描 SKILL.md', securityDeepScan: '🔬 深度扫描全部文件',
    securityRescan: '↻ 重新扫描', securityScanning: '正在执行静态安全分析…',
    securityQuickHint: '快速扫描只检查 SKILL.md，适合即时预检。',
    securityDeepHint: '深度扫描会检查 Skill 内支持的 Markdown、JSON 与 YAML 文件。',
    securityRisk: '风险等级', securityScore: '风险分数', securityFiles: '扫描文件', securityFindings: '安全信号',
    securityRules: '检测规则', securityNoFindings: '未发现已知高风险模式',
    securityWhy: '为什么危险', securityFix: '修复建议', securityEvidence: '证据',
    securityWarnings: '扫描警告', securityDisclaimer: '静态启发式扫描可能漏掉混淆或间接行为；高影响 Skill 仍需人工复核。',
    securityModeQuick: '快速扫描', securityModeDeep: '深度扫描', securityError: '安全扫描失败: ',
    securityCategoryClear: '通过', securityCategoryFlagged: '命中', securityEngine: '扫描引擎',
  },
  en: {
    subtitle: 'Universal Agent Skill Manager',
    statDisabled: 'disabled',
    statAudited: 'audited',
    searchPlaceholder: 'Search skills by name, description or tag...',
    platformLabel: 'Platform Map', platformHint: 'Sources and permissions by Agent',
    workspaceLabel: 'Workspace', navigation: 'Navigation & filters', allSkills: 'All Skills',
    agentsAndSources: 'Agents & Sources', libraryEyebrow: 'Skill Registry',
    skillsLibrary: 'Skill Library', libraryContext: 'Browse, compare and manage skills across agents',
    filterButton: 'Filters', openNavigation: 'Open navigation',
    allAgents: 'All platforms', manageMode: 'Manage', observeMode: 'Read only',
    agentMeta: (i, s) => `${i} instances · ${s} skills`,
    clearFilters: 'Clear all', filterAgent: 'Agent', filterSource: 'Source',
    filterCategory: 'Category', filterStatus: 'Status', filterSearch: 'Search',
    scopedContext: (n, a) => `${n} skills in scope · ${a} agents`,
    allSources: 'All Sources',
    allCategories: 'All Categories',
    anyStatus: 'Any Status',
    onlyEnabled: '✅ Enabled Only',
    onlyDisabled: '⛔ Disabled Only',
    batchDisable: '⛔ Disable Selected',
    batchEnable: '▶ Enable Selected',
    compareBtn: '📊 Compare Sources',
    createBtn: '＋ New Skill',
    categories: 'Categories',
    detailTitle: 'Skill Details',
    tabInfo: '📋 Info', tabSecurity: '🛡️ Security', tabEdit: '✏️ Edit', tabFiles: '📁 Files', tabCompare: '📊 Compare',
    secBasic: 'Basic Info', fName: 'Name', fCategory: 'Category', fSource: 'Source',
    fVersion: 'Version', fAuthor: 'Author', fPath: 'Path', fSize: 'Size', fModified: 'Modified',
    secStatus: 'Status', enabledBadge: 'Enabled', disabledBadge: 'Disabled',
    btnEnable: '▶ Enable', btnDisable: '⏸ Disable',
    secPlatforms: 'Platforms', secTags: 'Tags', noDesc: '(no description)', none: '-',
    secPreview: 'Content Preview', emptyBody: '(empty)',
    secDesc: 'Description', noMatch: 'No matching skills',
    warming: '⏳ Scanning skill library…',
    eName: 'Name', eDesc: 'Description', eVersion: 'Version', eAuthor: 'Author',
    ePlatforms: 'Platforms (comma separated)', eTags: 'Tags (comma separated)', eBody: 'SKILL.md Body',
    save: '💾 Save', cancel: 'Cancel', back: '← Back',
    filesCount: 'Files', noSubfiles: 'No subfiles', newSubfile: 'New Subfile',
    subfileType: 'Type', refDoc: 'references (docs)', tmplDoc: 'templates (templates)', scriptDoc: 'scripts (scripts)',
    fileName: 'Filename', create: '➕ Create', editingFile: 'Edit',
    compareTitle: 'Compare Sources', compareOf: 'Cross-Source Comparison',
    multiSourceSkills: 'Skills in Multiple Sources',
    noCrossSource: 'No skills shared across sources',
    noSameOtherSource: 'No same-named skill in other sources',
    loading: 'Loading...',
    copyVerb: 'copy', moveVerb: 'move',
    newSkill: 'New Skill', nSource: 'Source', nCategory: 'Category', nName: 'Name',
    nDesc: 'Description', nVersion: 'Version', nAuthor: 'Author', nBody: 'SKILL.md Body',
    nBodyPlaceholder: '# New Skill\\n\\nWrite the SKILL.md body here...',
    phCategory: 'e.g. my-category', phName: 'e.g. my-skill', phDesc: 'Skill description', phFilename: 'e.g. api-reference.md',
    saved: '✅ Saved', fileSaved: '✅ File saved', fileCreated: '✅ File created',
    created: '✅ Skill created', deleted: '✅ Deleted',
    needNameCat: 'Name and category are required', needFilename: 'Filename is required',
    readFail: '❌ Failed to read file: ',
    migrateTitle: '📦 Migrate to Another Source', migrateBtn: '📤 Migrate',
    migrateTarget: 'Target Source', migrateCategory: 'Target category (empty = migrated)',
    migrateMode: 'Mode', copyMode: '📋 Copy (keep original)', moveMode: '✂️ Move (remove original)',
    migrateGo: '🚀 Migrate Now', migrateOverwrite: 'Overwrite existing target', confirmMigrate: (s, d, n) => `Are you sure you want to ${s} "${n}" to ${d}?`,
    migrated: r => `✅ ${r}`, migrateFail: '❌ Migration failed: ',
    targetExists: 'A skill with the same name exists at the target. Check "Overwrite" and retry.',
    flatHint: 'This agent uses a flat directory — no category needed',
    copyVerb: 'copy', moveVerb: 'move',
    disabledMsg: name => `✅ Disabled ${name}`, enabledMsg: name => `✅ Enabled ${name}`,
    confirmDelete: name => `Delete "${name}"? This cannot be undone.`,
    confirmBatch: (n, a) => a === 'disable' ? `Disable ${n} skills?` : `Enable ${n} skills?`,
    batchDone: (n, a) => a === 'disable' ? `✅ Disabled ${n} skills` : `✅ Enabled ${n} skills`,
    selectedN: n => `${n} selected`,
    loadFail: e => `Failed to load: ${e}`,
    errPrefix: '❌ ',
    clickToEnable: 'Click to enable', clickToDisable: 'Click to disable',
    disabledTag: 'Disabled',
    // sort & rescan & preview
    tabPreview: '👁️ Preview',
    sortDefault: 'Default order', sortName: '🔤 Name A→Z', sortNameDesc: '🔤 Name Z→A',
    sortModified: '🕐 Recently modified', sortSize: '📦 Largest first',
    rescanTip: 'Rescan all skill directories (use after external changes)',
    rescanning: '⏳ Rescanning…',
    rescanDone: n => `✅ Rescan done: ${n} skills`,
    showingOf: (a, b) => `Showing ${a} of ${b}`,
    mdRenderFail: '⚠️ Markdown render failed, showing raw text:',
    themeTip: 'Toggle dark/light theme', darkModeTip: 'Current: dark theme', lightModeTip: 'Current: light theme',
    gridViewTip: 'Grid view', listViewTip: 'List view',
    securityReady: (v, n) => `agent-skill-scanner ${v || ''} · ${n} rules`,
    securityUnavailable: 'Security scanner is not configured',
    securityQuickScan: '⚡ Quick scan SKILL.md', securityDeepScan: '🔬 Deep scan all files',
    securityRescan: '↻ Rescan', securityScanning: 'Running static security analysis…',
    securityQuickHint: 'Quick scan checks SKILL.md only for instant preflight feedback.',
    securityDeepHint: 'Deep scan checks supported Markdown, JSON and YAML files in the Skill.',
    securityRisk: 'Risk', securityScore: 'Score', securityFiles: 'Files scanned', securityFindings: 'Signals',
    securityRules: 'Detection rules', securityNoFindings: 'No known risky patterns detected',
    securityWhy: 'Why it matters', securityFix: 'Remediation', securityEvidence: 'Evidence',
    securityWarnings: 'Scan warnings', securityDisclaimer: 'Static heuristics can miss obfuscated or indirect behavior. Review high-impact skills manually.',
    securityModeQuick: 'Quick scan', securityModeDeep: 'Deep scan', securityError: 'Security scan failed: ',
    securityCategoryClear: 'Clear', securityCategoryFlagged: 'Flagged', securityEngine: 'Scanner engine',
  }
};
let LANG = localStorage.getItem('skillhub_lang') || 'zh';
function t(key, ...args) {
  const v = (I18N[LANG] && I18N[LANG][key]) ?? I18N.zh[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}
function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  // select options
  const ss = document.getElementById('sortSel');
  if (ss) {
    const keys = ['sortDefault', 'sortName', 'sortNameDesc', 'sortModified', 'sortSize'];
    [...ss.options].forEach((opt, i) => { if (keys[i]) opt.text = t(keys[i]); });
  }
  const df = document.getElementById('disabledFilter');
  if (df) {
    df.options[0].text = t('anyStatus');
    df.options[1].text = t('onlyEnabled');
    df.options[2].text = t('onlyDisabled');
  }
  const sf = document.getElementById('sourceFilter');
  if (sf && sf.options[0]) sf.options[0].text = t('allSources');
  const cf = document.getElementById('categoryFilter');
  if (cf && cf.options[0]) cf.options[0].text = t('allCategories');
}

// ─── State ───
let state = {
  skills: [],
  sources: [],
  categories: [],
  agents: [],
  overview: null,
  expandedAgents: new Set(['hermes']),
  filters: { agent: '', source: '', category: '', search: '', disabled: '' },
  sort: localStorage.getItem('skillhub_sort') || '',
  view: localStorage.getItem('skillhub_view') || 'grid',
  selectedSkill: null,
  activeTab: 'info',
  editMode: false,
  selection: new Set(),  // 多选：'source|category|name'
  security: {
    available: false, version: null, ruleCount: 0, categories: [], repoUrl: '', error: '',
    reports: new Map(), inflight: new Set(), errors: new Map(),
  },
};

function applySecurityStatus(data = {}) {
  state.security.available = Boolean(data.available);
  state.security.version = data.version || null;
  state.security.ruleCount = Number(data.rule_count || 0);
  state.security.categories = Array.isArray(data.categories) ? data.categories : [];
  state.security.repoUrl = data.repo_url || '';
  state.security.error = data.error || '';
  (data.reports || []).forEach(summary => {
    const current = state.security.reports.get(summary.key);
    if (!current || current.summaryOnly || current.mode !== summary.mode) {
      state.security.reports.set(summary.key, {...summary, summaryOnly: true});
    }
  });
}

// ─── API ───
async function api(url, options = {}) {
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── Toast ───
let toastTimer;
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 3000);
}

// ─── Init ───
function showSkeleton() {
  const grid = document.getElementById('skillGrid');
  grid.innerHTML = '<div class="skeleton-grid">' +
    '<div class="warm-banner" id="warmBanner"></div>' +
    Array.from({length: 8}, (_, i) => `
      <div class="skeleton-card">
        <div style="display:flex;justify-content:space-between;">
          <div class="sk title"></div>
          <div class="sk meta" style="width:64px;"></div>
        </div>
        <div class="sk desc"></div>
        <div class="sk desc2"></div>
        <div class="sk meta"></div>
      </div>
    `).join('') + '</div>';
  pollWarmStatus();
}

async function pollWarmStatus() {
  const banner = document.getElementById('warmBanner');
  if (!banner) return;
  try {
    const st = await api('/api/status');
    if (st.ready) {
      banner.innerHTML = t('loading');
      return; // ready — init() 的下一次轮询会渲染真数据
    }
    const pct = st.total_sources ? Math.round(st.done_sources.length / st.total_sources * 100) : 0;
    banner.innerHTML = `${t('warming')} <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span> ${st.done_sources.length}/${st.total_sources}`;
    setTimeout(pollWarmStatus, 500);
  } catch(e) {
    setTimeout(pollWarmStatus, 1000);
  }
}

async function init() {
  showSkeleton();
  try {
    // 等预热完成（或缓存已就绪），避免拿到空列表
    for (let i = 0; i < 120; i++) {
      const st = await api('/api/status');
      if (st.ready) break;
      await new Promise(r => setTimeout(r, 500));
    }
    const [skillsData, overviewData, securityData] = await Promise.all([
      api('/api/skills'),
      api('/api/overview'),
      api('/api/security/status'),
    ]);
    state.skills = skillsData.skills;
    state.overview = overviewData;
    state.sources = (overviewData.sources || []).map(s => s.label);
    state.categories = overviewData.categories || [];
    state.agents = overviewData.agents || [];
    applySecurityStatus(securityData);

    updateHeaderStats();
    syncFilterOptions();
    renderPlatformOverview();
    renderSidebar();
    renderGrid();
  } catch(e) {
    document.getElementById('skillGrid').innerHTML = `<div class="empty-state">${t('loadFail', e.message)}</div>`;
  }
}

function updateHeaderStats() {
  const total = document.getElementById('statTotal');
  const agents = document.getElementById('statAgents');
  const srcs = document.getElementById('statSources');
  const dis = document.getElementById('statDisabled');
  const audited = document.getElementById('statAudited');
  const securityStat = document.getElementById('securityStat');
  if (!total) return;
  total.textContent = state.skills.length;
  if (agents) agents.textContent = state.agents.length;
  srcs.textContent = state.sources.length;
  // 全局禁用数：按 skill 名去重（同一 skill 在多个 source 中共享禁用状态）
  const disabledNames = new Set(state.skills.filter(s => s.disabled).map(s => s.name));
  dis.textContent = disabledNames.size;
  if (audited) audited.textContent = state.security.available ? state.security.reports.size : '–';
  if (securityStat) {
    securityStat.classList.toggle('offline', !state.security.available);
    securityStat.title = state.security.available
      ? t('securityReady', state.security.version, state.security.ruleCount)
      : `${t('securityUnavailable')}${state.security.error ? ': ' + state.security.error : ''}`;
  }
  const allCount = document.getElementById('allSkillsCount');
  if (allCount) allCount.textContent = state.skills.length;
}

// ─── Platform navigation & filtering ───
function skillsInScope({ignoreCategory = false, ignoreSearch = false, ignoreStatus = false} = {}) {
  const f = state.filters;
  return state.skills.filter(s => {
    if (f.agent && !s.source.startsWith(f.agent + '/')) return false;
    if (f.source && s.source !== f.source) return false;
    if (!ignoreCategory && f.category && s.category !== f.category) return false;
    if (!ignoreStatus && f.disabled === 'true' && !s.disabled) return false;
    if (!ignoreStatus && f.disabled === 'false' && s.disabled) return false;
    if (!ignoreSearch && f.search) {
      const q = f.search.toLowerCase();
      const hay = `${s.name} ${s.description} ${s.category} ${(s.tags || []).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function rerenderWorkspace() {
  syncFilterOptions();
  renderPlatformOverview();
  renderSidebar();
  renderGrid();
}

function setAgentFilter(key) {
  state.filters.agent = state.filters.agent === key ? '' : key;
  state.filters.source = '';
  state.filters.category = '';
  rerenderWorkspace();
  toggleSidebar(false);
}

function setSourceFilter(source, allowToggle = true) {
  state.filters.source = allowToggle && state.filters.source === source ? '' : source;
  state.filters.agent = '';
  state.filters.category = '';
  rerenderWorkspace();
  toggleSidebar(false);
}

function setCategoryFilter(category) {
  state.filters.category = state.filters.category === category ? '' : category;
  syncFilterOptions();
  renderSidebar();
  renderGrid();
  toggleSidebar(false);
}

function resetFilters() {
  state.filters = { agent: '', source: '', category: '', search: '', disabled: '' };
  const search = document.getElementById('searchInput');
  if (search) search.value = '';
  const disabled = document.getElementById('disabledFilter');
  if (disabled) disabled.value = '';
  rerenderWorkspace();
  toggleSidebar(false);
}

function toggleSidebar(force) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar || !overlay || window.innerWidth > 920) return;
  const open = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
}

function syncFilterOptions() {
  const sf = document.getElementById('sourceFilter');
  const cf = document.getElementById('categoryFilter');
  if (!sf || !cf) return;
  const sourceValue = state.filters.source;
  sf.innerHTML = `<option value="">${t('allSources')}</option>`;
  state.sources.forEach(src => sf.add(new Option(src, src)));
  sf.value = sourceValue;

  const categoryBase = skillsInScope({ignoreCategory: true, ignoreSearch: true, ignoreStatus: true});
  const scopedCategories = [...new Set(categoryBase.map(s => s.category))].sort();
  if (state.filters.category && !scopedCategories.includes(state.filters.category)) state.filters.category = '';
  cf.innerHTML = `<option value="">${t('allCategories')}</option>`;
  scopedCategories.forEach(cat => cf.add(new Option(cat, cat)));
  cf.value = state.filters.category;
}

function renderPlatformOverview() {
  const root = document.getElementById('agentOverview');
  if (!root) return;
  const activeAgent = state.filters.agent || (state.filters.source ? state.filters.source.split('/')[0] : '');
  root.innerHTML = '';

  const all = document.createElement('button');
  all.className = 'agent-overview-card' + (!activeAgent ? ' active' : '');
  all.innerHTML = `<span class="agent-card-icon">◈</span><strong>${t('allAgents')}</strong><small>${t('agentMeta', state.sources.length, state.skills.length)}</small><span class="agent-mode">ALL</span>`;
  all.onclick = () => {
    state.filters.agent = '';
    state.filters.source = '';
    state.filters.category = '';
    rerenderWorkspace();
  };
  root.appendChild(all);

  state.agents.forEach(agent => {
    const card = document.createElement('button');
    card.className = 'agent-overview-card' + (activeAgent === agent.key ? ' active' : '');
    card.innerHTML = `
      <span class="agent-card-icon">${agent.icon}</span>
      <strong>${escapeHtml(agent.name)}</strong>
      <small>${t('agentMeta', agent.instances.length, agent.total)}</small>
      <span class="agent-mode ${agent.writable ? 'manage' : ''}">${agent.writable ? t('manageMode') : t('observeMode')}</span>`;
    card.onclick = () => setAgentFilter(agent.key);
    root.appendChild(card);
  });
}

function renderActiveFilters(filteredCount) {
  const bar = document.getElementById('activeFilterBar');
  if (!bar) return;
  bar.innerHTML = '';
  const chips = [];
  const f = state.filters;
  if (f.agent) chips.push([t('filterAgent'), state.agents.find(a => a.key === f.agent)?.name || f.agent, () => { f.agent = ''; }]);
  if (f.source) chips.push([t('filterSource'), f.source, () => { f.source = ''; }]);
  if (f.category) chips.push([t('filterCategory'), f.category, () => { f.category = ''; }]);
  if (f.disabled) chips.push([t('filterStatus'), f.disabled === 'true' ? t('onlyDisabled') : t('onlyEnabled'), () => { f.disabled = ''; }]);
  if (f.search) chips.push([t('filterSearch'), f.search, () => { f.search = ''; document.getElementById('searchInput').value = ''; }]);

  chips.forEach(([label, value, clear]) => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.textContent = `${label}: ${value}  ×`;
    chip.onclick = () => { clear(); rerenderWorkspace(); };
    bar.appendChild(chip);
  });
  if (chips.length) {
    const clear = document.createElement('button');
    clear.className = 'clear-filters';
    clear.textContent = t('clearFilters');
    clear.onclick = resetFilters;
    bar.appendChild(clear);
  }
  bar.classList.toggle('visible', chips.length > 0);

  const context = document.getElementById('libraryContext');
  if (context) {
    const agentsInScope = new Set(skillsInScope({ignoreSearch: false}).map(s => s.source.split('/')[0])).size;
    context.textContent = t('scopedContext', filteredCount, agentsInScope);
  }
  const allItem = document.getElementById('allSkillsItem');
  if (allItem) allItem.classList.toggle('active', chips.length === 0);
}

// ─── Render Sidebar ───
function renderSidebar() {
  // Agent → Instance tree
  const sourceList = document.getElementById('sourceList');
  sourceList.innerHTML = '';

  if (!state.agents.length) {
    // Fallback: flat source list
    state.sources.forEach(src => {
      const count = state.skills.filter(s => s.source === src).length;
      const div = document.createElement('div');
      div.className = 'source-item' + (state.filters.source === src ? ' active' : '');
      div.innerHTML = `<span class="dot"></span>${escapeHtml(src)}<span class="count">${count}</span>`;
      div.onclick = () => setSourceFilter(src);
      sourceList.appendChild(div);
    });
  } else {
    state.agents.forEach(agent => {
      // agent group header
      const group = document.createElement('div');
      group.className = 'agent-group';
      const headerEl = document.createElement('div');
      const isActiveAgent = state.filters.agent === agent.key;
      const expanded = state.expandedAgents.has(agent.key);
      headerEl.className = 'agent-header' + (expanded ? ' expanded' : '') + (isActiveAgent ? ' active' : '');
      headerEl.innerHTML = `
        <span class="agent-arrow" role="button" tabindex="0">${expanded ? '▾' : '▸'}</span>
        <span class="agent-icon">${agent.icon}</span>
        <span class="agent-name">${escapeHtml(agent.name)}</span>
        <span class="count">${agent.total}</span>
      `;
      const arrow = headerEl.querySelector('.agent-arrow');
      arrow.onclick = (event) => {
        event.stopPropagation();
        if (expanded) {
          state.expandedAgents.delete(agent.key);
        } else {
          state.expandedAgents.add(agent.key);
        }
        renderSidebar();
      };
      arrow.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); arrow.click(); }
      };
      headerEl.onclick = () => setAgentFilter(agent.key);
      group.appendChild(headerEl);

      // instances (visible when expanded or when one of them is selected)
      const anySelected = agent.instances.some(i => i.label === state.filters.source);
      if (expanded || anySelected) {
        agent.instances.forEach(inst => {
          const item = document.createElement('div');
          item.className = 'instance-item' + (state.filters.source === inst.label ? ' active' : '');
          item.innerHTML = `<span class="inst-name">${escapeHtml(inst.instance)}</span><span class="count">${inst.count}</span>`;
          item.onclick = () => setSourceFilter(inst.label);
          group.appendChild(item);
        });
      }
      sourceList.appendChild(group);
    });
  }

  // Category list
  const catList = document.getElementById('categoryList');
  catList.innerHTML = '';
  const categoryBase = skillsInScope({ignoreCategory: true, ignoreSearch: true, ignoreStatus: true});
  const scopedCategories = [...new Set(categoryBase.map(s => s.category))].sort();
  scopedCategories.forEach(cat => {
    const count = categoryBase.filter(s => s.category === cat).length;
    const div = document.createElement('div');
    div.className = 'cat-item' + (state.filters.category === cat ? ' active' : '');
    div.innerHTML = `${escapeHtml(cat)}<span class="count">${count}</span>`;
    div.onclick = () => setCategoryFilter(cat);
    catList.appendChild(div);
  });
}

// ─── Render Grid ───
function skillKey(s) { return `${s.source}|${s.category}|${s.name}`; }

// ─── Category hue map（分类色彩编码）───
const HUES = [226, 268, 158, 28, 340, 196, 92, 12, 310, 178, 50, 250];
function catHue(cat) {
  let h = 5381;
  for (let i = 0; i < cat.length; i++) h = ((h << 5) + h + cat.charCodeAt(i)) | 0;
  return HUES[Math.abs(h) % HUES.length];
}

function getAgentInfo(sourceLabel) {
  // sourceLabel format: 'agent/instance' e.g. 'hermes/profile:math-model'
  const slashIdx = sourceLabel.indexOf('/');
  if (slashIdx < 0) return { icon: '📦', name: sourceLabel, instance: sourceLabel };
  const key = sourceLabel.slice(0, slashIdx);
  const instance = sourceLabel.slice(slashIdx + 1);
  const agent = state.agents.find(a => a.key === key);
  return {
    icon: agent ? agent.icon : '🤖',
    name: agent ? agent.name : key,
    instance: instance.replace('profile:', ''),
  };
}

function renderGrid() {
  const grid = document.getElementById('skillGrid');
  const search = state.filters.search;
  const agent = state.filters.agent;
  const source = state.filters.source;
  const category = state.filters.category;
  const disabledFilter = state.filters.disabled;

  let filtered = skillsInScope();

  // 排序（默认保持 API 返回顺序：source → category → name）
  const sortKey = state.sort;
  if (sortKey) {
    const desc = sortKey.startsWith('-');
    const field = desc ? sortKey.slice(1) : sortKey;
    filtered.sort((a, b) => {
      let va = a[field], vb = b[field];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb || '').toLowerCase(); }
      va = va ?? 0; vb = vb ?? 0;
      if (va < vb) return desc ? 1 : -1;
      if (va > vb) return desc ? -1 : 1;
      return 0;
    });
  }

  updateSelectionBar();
  renderActiveFilters(filtered.length);

  // 结果计数
  const totalCount = state.skills.length;
  const countEl = document.getElementById('resultCount');
  if (countEl) {
    const isFiltered = agent || source || category || search || disabledFilter;
    countEl.textContent = isFiltered ? t('showingOf', filtered.length, totalCount) : '';
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">${t('noMatch')}</div>`;
    return;
  }

  grid.classList.toggle('list-view', state.view === 'list');
  grid.innerHTML = `<div class="result-count-bar">${t('showingOf', filtered.length, totalCount)}</div>`;
  filtered.forEach((s, i) => {
    const key = skillKey(s);
    const isSelected = state.selection.has(key);
    const security = state.security.reports.get(key);
    const riskClass = String(security?.risk || 'LOW').toLowerCase();
    const card = document.createElement('div');
    card.className = 'skill-card' + (state.selectedSkill && state.selectedSkill.source === s.source && state.selectedSkill.name === s.name ? ' selected' : '') + (isSelected ? ' checked' : '');
    card.style.setProperty('--hue', catHue(s.category));
    card.style.animationDelay = Math.min(i * 18, 360) + 'ms';

    const agentInfo = getAgentInfo(s.source);
    const sourceLabel = `${escapeHtml(agentInfo.icon)} ${escapeHtml(agentInfo.instance)}`;

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title">
          <input type="checkbox" class="card-check" ${isSelected ? 'checked' : ''}>
          ${escapeHtml(s.name)}
          ${s.disabled ? `<span class="badge red" style="margin-left:6px;">${t('disabledTag')}</span>` : ''}
          ${security ? `<span class="risk-badge risk-${riskClass}">🛡 ${escapeHtml(security.risk)}</span>` : ''}
        </div>
        <div class="card-source">
          <span class="toggle-switch ${s.disabled ? 'off' : 'on'}" title="${escapeAttr(s.disabled ? t('clickToEnable') : t('clickToDisable'))}"></span>
          ${sourceLabel}
        </div>
      </div>
      <div class="card-desc">${escapeHtml(s.description || t('noDesc'))}</div>
      <div class="card-meta">
        <span>📂 ${escapeHtml(s.category)}</span>
        <span>v${escapeHtml(s.version || '?')}</span>
        <span>📦 ${(s.size / 1024).toFixed(1)}KB</span>
      </div>
      ${s.tags.length ? `<div class="card-tags">${s.tags.map(t => `<span>#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    `;
    card.querySelector('.card-check').onclick = (event) => {
      event.stopPropagation();
      toggleSelect(s.source, s.category, s.name);
    };
    card.querySelector('.toggle-switch').onclick = (event) => {
      event.stopPropagation();
      toggleSkillDisabled(s.name, !s.disabled);
    };
    card.onclick = () => openDetail(s);
    grid.appendChild(card);
  });
}

// ─── Multi-select & Batch ───
function toggleSelect(source, category, name) {
  const key = `${source}|${category}|${name}`;
  if (state.selection.has(key)) state.selection.delete(key);
  else state.selection.add(key);
  renderGrid();
}

function updateSelectionBar() {
  const info = document.getElementById('selectionInfo');
  const disBtn = document.getElementById('batchDisableBtn');
  const enBtn = document.getElementById('batchEnableBtn');
  const n = state.selection.size;
  if (!info || !disBtn || !enBtn) return;
  info.textContent = n > 0 ? t('selectedN', n) : '';
  disBtn.style.display = n > 0 ? '' : 'none';
  enBtn.style.display = n > 0 ? '' : 'none';
}

async function batchSetDisabled(action) {
  const names = [...state.selection].map(k => k.split('|')[2]);
  if (names.length === 0) return;
  if (!confirm(t('confirmBatch', names.length, action))) return;

  try {
    const resp = await api('/api/disabled/batch', {
      method: 'PUT',
      body: JSON.stringify({ names, action }),
    });
    toast(t('batchDone', names.length, action));
    state.selection.clear();
    await refreshSkills();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

async function refreshSkills() {
  const [data, overviewData] = await Promise.all([
    api('/api/skills'),
    api('/api/overview'),
  ]);
  state.skills = data.skills;
  state.overview = overviewData;
  state.sources = (overviewData.sources || []).map(s => s.label);
  state.categories = overviewData.categories || [];
  state.agents = overviewData.agents || [];
  updateHeaderStats();
  rerenderWorkspace();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ─── Detail Panel ───
let _detailSeq = 0;  // 防止快速点击时旧请求覆盖新面板

function openDetail(skill) {
  state.selectedSkill = skill;
  state.activeTab = 'info';
  state.editMode = false;

  // 乐观渲染：立即用列表数据弹面板（零等待）
  const panel = document.getElementById('detailPanel');
  document.getElementById('detailTitle').textContent = skill.name || '';
  panel.classList.add('open');
  renderDetailTab();

  // 后台补全量数据（body/frontmatter），到达后仅当仍指向同一技能时刷新
  const seq = ++_detailSeq;
  api(`/api/skill?source=${encodeURIComponent(skill.source)}&category=${encodeURIComponent(skill.category)}&name=${encodeURIComponent(skill.name)}`)
    .then(full => {
      if (seq !== _detailSeq) return;
      state.selectedSkill = full;
      document.getElementById('detailTitle').textContent = full.name || '';
      if (document.querySelector('.detail-panel.open')) renderDetailTab();
    })
    .catch(() => {});   // 列表数据已可用，失败不打扰用户
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  state.selectedSkill = null;
  state.editMode = false;
}

// ─── Markdown renderer（零依赖，覆盖 SKILL.md 常用语法）───
function renderMarkdown(md) {
  const out = [];
  let inCode = false, codeBuf = [];
  let listType = null;   // 'ul' | 'ol'
  let inBq = false;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const closeBq = () => { if (inBq) { out.push('</blockquote>'); inBq = false; } };
  const closeAll = () => { closeList(); closeBq(); };
  const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => {
    s = escHtml(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, href) => {
      const safe = /^(https?:|mailto:|#)/i.test(href)
        ? href.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        : '#';
      return `<a href="${safe}" target="_blank" rel="noopener">${txt}</a>`;
    });
    return s;
  };
  for (const line of (md || '').split('\n')) {
    const fence = line.match(/^```\s*(\S*)/);
    if (fence) {
      if (inCode) {
        out.push(`<pre><code>${escHtml(codeBuf.join('\n'))}</code></pre>`);
        inCode = false; codeBuf = [];
      } else {
        closeAll();
        inCode = true;
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { closeAll(); const lv = h[1].length; out.push(`<h${lv}>${inline(h[2])}</h${lv}>`); continue; }

    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      closeBq();
      const want = ul ? 'ul' : 'ol';
      if (listType !== want) { closeList(); out.push(`<${want}>`); listType = want; }
      out.push(`<li>${inline((ul || ol)[1])}</li>`);
      continue;
    }

    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { closeAll(); out.push('<hr>'); continue; }

    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      closeList();
      if (!inBq) { out.push('<blockquote>'); inBq = true; }
      if (bq[1].trim()) out.push(`<p>${inline(bq[1])}</p>`);
      continue;
    }

    if (!line.trim()) { closeList(); continue; }

    closeAll();
    out.push(`<p>${inline(line)}</p>`);
  }
  if (inCode) out.push(`<pre><code>${escHtml(codeBuf.join('\n'))}</code></pre>`);
  closeAll();
  return out.join('\n');
}

// ─── Security scanner integration ───
function getSecurityReport(skill) {
  return state.security.reports.get(skillKey(skill));
}

function renderSecurityFinding(fileReport, finding) {
  const severity = String(finding.severity || 'MEDIUM').toUpperCase();
  const evidence = (finding.evidence || []).map(item => `
    <li><code>${escapeHtml(fileReport.file || 'SKILL.md')}${item.line ? ':' + Number(item.line) : ''}</code><span>${escapeHtml(item.excerpt || item.text || item.match || '')}</span></li>
  `).join('');
  return `
    <article class="security-finding severity-${severity.toLowerCase()}">
      <div class="security-finding-head">
        <span class="severity-pill">${escapeHtml(severity)}</span>
        <strong>${escapeHtml(finding.title || finding.message || finding.ruleId || 'Finding')}</strong>
        <code>${escapeHtml(finding.ruleId || '')}</code>
      </div>
      ${finding.why ? `<p><b>${t('securityWhy')}：</b>${escapeHtml(finding.why)}</p>` : ''}
      ${finding.remediation ? `<p><b>${t('securityFix')}：</b>${escapeHtml(finding.remediation)}</p>` : ''}
      ${evidence ? `<div class="security-evidence"><b>${t('securityEvidence')}</b><ul>${evidence}</ul></div>` : ''}
    </article>`;
}

async function scanSelectedSkill(deep = false, force = false) {
  const skill = state.selectedSkill;
  if (!skill || !state.security.available) return;
  const key = skillKey(skill);
  if (state.security.inflight.has(key)) return;
  state.security.inflight.add(key);
  state.security.errors.delete(key);
  if (state.activeTab === 'security') renderSecurityTab();
  try {
    const report = await api('/api/security/scan', {
      method: 'POST',
      body: JSON.stringify({source: skill.source, category: skill.category, name: skill.name, deep, force}),
    });
    state.security.reports.set(key, report);
    updateHeaderStats();
    renderGrid();
  } catch (err) {
    state.security.errors.set(key, err.message);
    toast(t('securityError') + err.message, 'error');
  } finally {
    state.security.inflight.delete(key);
    if (state.selectedSkill && skillKey(state.selectedSkill) === key && state.activeTab === 'security') renderSecurityTab();
  }
}

function renderSecurityTab() {
  const body = document.getElementById('detailBody');
  const skill = state.selectedSkill;
  if (!skill) return;
  const key = skillKey(skill);
  const report = getSecurityReport(skill);
  const loading = state.security.inflight.has(key);
  const error = state.security.errors.get(key);

  if (!state.security.available) {
    body.innerHTML = `<div class="security-empty">
      <div class="security-empty-icon">🛡️</div><h3>${t('securityUnavailable')}</h3>
      <p>${escapeHtml(state.security.error || '')}</p>
      ${state.security.repoUrl ? `<a href="${escapeAttr(state.security.repoUrl)}" target="_blank" rel="noopener">agent-skill-scanner ↗</a>` : ''}
    </div>`;
    return;
  }

  if (!report || report.summaryOnly) {
    const known = report ? `<span class="risk-badge risk-${String(report.risk).toLowerCase()}">🛡 ${escapeHtml(report.risk)}</span>` : '';
    body.innerHTML = `<div class="security-hero">
      <div class="security-shield">🛡️</div><div><h3>${t('securityReady', state.security.version, state.security.ruleCount)} ${known}</h3>
      <p>${t('securityQuickHint')}</p></div>
    </div>
    <div class="security-actions"><button class="primary" id="securityQuickBtn">${t('securityQuickScan')}</button><button id="securityDeepBtn">${t('securityDeepScan')}</button></div>
    ${loading ? `<div class="security-loading"><span></span>${t('securityScanning')}</div>` : ''}
    ${error ? `<div class="security-error">⚠ ${escapeHtml(error)}</div>` : ''}
    <p class="security-disclaimer">${t('securityDeepHint')}</p>`;
    const quick = document.getElementById('securityQuickBtn');
    const deep = document.getElementById('securityDeepBtn');
    if (quick) quick.onclick = () => scanSelectedSkill(false);
    if (deep) deep.onclick = () => scanSelectedSkill(true);
    return;
  }

  const risk = String(report.risk || 'LOW').toUpperCase();
  const riskClass = risk.toLowerCase();
  const score = Number(report.score || 0);
  const fileCount = Number(report.fileCount ?? report.file_count ?? 0);
  const findingCount = Number(report.findingCount ?? report.finding_count ?? 0);
  const fileReports = Array.isArray(report.reports) ? report.reports : [];
  const findingRows = fileReports.flatMap(fileReport =>
    (fileReport.findings || []).map(finding => ({fileReport, finding}))
  );
  const categoryCounts = {};
  findingRows.forEach(({finding}) => {
    const id = finding.category || finding.categoryId || 'other';
    categoryCounts[id] = (categoryCounts[id] || 0) + 1;
  });
  const categoryHtml = state.security.categories.map(category => {
    const id = category.id || category.name || String(category);
    const label = category.label || category.title || id;
    const count = categoryCounts[id] || 0;
    return `<div class="security-category ${count ? 'flagged' : ''}"><span>${escapeHtml(label)}</span><b>${count ? '!' : '✓'}</b><small>${count ? `${count} ${t('securityCategoryFlagged')}` : t('securityCategoryClear')}</small></div>`;
  }).join('');
  const warnings = (report.warnings || []).map(w => `<li>${escapeHtml(w)}</li>`).join('');
  const when = report.scannedAt || report.scanned_at;
  const modeLabel = report.mode === 'deep' ? t('securityModeDeep') : t('securityModeQuick');

  body.innerHTML = `
    <section class="security-summary risk-surface-${riskClass}">
      <div class="security-score-ring" style="--score:${Math.min(100, Math.max(0, score))}"><strong>${score}</strong><span>/ 100</span></div>
      <div class="security-summary-main"><span class="risk-badge risk-${riskClass}">🛡 ${escapeHtml(risk)}</span><h3>${findingCount ? `${findingCount} ${t('securityFindings')}` : t('securityNoFindings')}</h3><p>${t('securityReady', state.security.version, state.security.ruleCount)}</p></div>
      <span class="security-mode">${modeLabel}</span>
    </section>
    <div class="security-metrics">
      <div><span>${t('securityRisk')}</span><strong>${escapeHtml(risk)}</strong></div>
      <div><span>${t('securityScore')}</span><strong>${score}</strong></div>
      <div><span>${t('securityFiles')}</span><strong>${fileCount}</strong></div>
      <div><span>${t('securityFindings')}</span><strong>${findingCount}</strong></div>
    </div>
    <div class="security-actions">
      ${report.mode !== 'deep' ? `<button class="primary" id="securityDeepBtn">${t('securityDeepScan')}</button>` : ''}
      <button id="securityRescanBtn">${t('securityRescan')}</button>
    </div>
    ${loading ? `<div class="security-loading"><span></span>${t('securityScanning')}</div>` : ''}
    ${error ? `<div class="security-error">⚠ ${escapeHtml(error)}</div>` : ''}
    ${categoryHtml ? `<div class="detail-section"><h4>${t('securityRules')}</h4><div class="security-category-grid">${categoryHtml}</div></div>` : ''}
    <div class="detail-section"><h4>${t('securityFindings')} (${findingRows.length})</h4>
      <div class="security-findings">${findingRows.length ? findingRows.map(({fileReport, finding}) => renderSecurityFinding(fileReport, finding)).join('') : `<div class="empty-state">✅ ${t('securityNoFindings')}</div>`}</div>
    </div>
    ${warnings ? `<div class="detail-section security-warnings"><h4>${t('securityWarnings')}</h4><ul>${warnings}</ul></div>` : ''}
    <footer class="security-footer"><span>${t('securityEngine')}: agent-skill-scanner ${escapeHtml(report.scanner?.version || state.security.version || '')}</span><span>${when ? new Date(when).toLocaleString() : ''}</span><p>${t('securityDisclaimer')}</p></footer>`;

  const deepBtn = document.getElementById('securityDeepBtn');
  const rescanBtn = document.getElementById('securityRescanBtn');
  if (deepBtn) deepBtn.onclick = () => scanSelectedSkill(true);
  if (rescanBtn) rescanBtn.onclick = () => scanSelectedSkill(report.mode === 'deep', true);
}

function renderDetailTab() {
  const body = document.getElementById('detailBody');
  const s = state.selectedSkill;
  if (!s) return;

  if (state.activeTab === 'preview') {
    body.innerHTML = `<div class="md-preview" id="mdPreview"></div>`;
    const target = document.getElementById('mdPreview');
    try {
      target.innerHTML = renderMarkdown(s.body || '');
    } catch (err) {
      target.innerHTML = `<div style="color:var(--yellow);margin-bottom:8px;">${t('mdRenderFail')}</div>` +
        `<div class="body-editor" readonly>${escapeHtml(s.body || t('emptyBody'))}</div>`;
    }
    return;
  }

  if (state.activeTab === 'security') {
    renderSecurityTab();
    return;
  }

  if (state.activeTab === 'info') {
    body.innerHTML = `
      <div class="detail-section">
        <h4>${t('secBasic')}</h4>
        <div class="detail-field"><span class="label">${t('fName')}</span><span class="value">${escapeHtml(s.name)}</span></div>
        <div class="detail-field"><span class="label">${t('fCategory')}</span><span class="value">📂 ${escapeHtml(s.category)}</span></div>
        <div class="detail-field"><span class="label">${t('fSource')}</span><span class="value">${escapeHtml(s.source)}</span></div>
        <div class="detail-field"><span class="label">${t('fVersion')}</span><span class="value">v${escapeHtml(s.version || '?')}</span></div>
        <div class="detail-field"><span class="label">${t('fAuthor')}</span><span class="value">${escapeHtml(s.author || '-')}</span></div>
        <div class="detail-field"><span class="label">${t('fPath')}</span><span class="value" style="font-family:monospace;font-size:11px;">${escapeHtml(s.path)}</span></div>
        <div class="detail-field"><span class="label">${t('fSize')}</span><span class="value">${(s.size / 1024).toFixed(1)} KB</span></div>
        <div class="detail-field"><span class="label">${t('fModified')}</span><span class="value">${new Date(s.modified * 1000).toLocaleString()}</span></div>
      </div>
      <div class="detail-section">
        <h4>${t('secStatus')}</h4>
        <div class="detail-field">
          <span class="value">
            ${s.disabled
              ? `<span class="badge red">${t('disabledBadge')}</span> `
              : `<span class="badge green">${t('enabledBadge')}</span> `}
            <button class="primary" id="detailToggleBtn" style="margin-left:8px;padding:4px 12px;font-size:12px;">
              ${s.disabled ? t('btnEnable') : t('btnDisable')}
            </button>
          </span>
        </div>
      </div>
      <div class="detail-section">
        <h4>${t('secPlatforms')}</h4>
        <div class="detail-field"><span class="value">${(s.platforms || []).map(p => `<span class="badge green">${escapeHtml(p)}</span>`).join(' ') || t('none')}</div></div>
      </div>
      <div class="detail-section">
        <h4>${t('secTags')}</h4>
        <div class="detail-field"><span class="value">${(s.tags || []).map(tg => `<span class="badge green">#${escapeHtml(tg)}</span>`).join(' ') || t('none')}</div></div>
      </div>
      <div class="detail-section">
        <h4>${t('secDesc')}</h4>
        <div class="detail-field"><span class="value">${escapeHtml(s.description || t('noDesc'))}</span></div>
      </div>
      <div class="detail-section">
        <h4>${t('secPreview')}</h4>
        <div class="body-editor" readonly>${escapeHtml(s.body?.substring(0, 500) || t('emptyBody'))}</div>
      </div>
      <div class="detail-section">
        <h4>${t('migrateTitle')}</h4>
        <div class="edit-field">
          <label>${t('migrateTarget')}</label>
          <select id="migTarget">
            ${state.sources.filter(src => src !== s.source).map(src => `<option value="${escapeAttr(src)}">${escapeHtml(src)}</option>`).join('')}
          </select>
        </div>
        <div class="edit-field" id="migCatField">
          <label>${t('migrateCategory')}</label>
          <input type="text" id="migCategory" placeholder="${s.source.split('/')[0] !== 'hermes' ? 'skills' : 'e.g. my-category'}">
        </div>
        <div class="edit-field">
          <label>${t('migrateMode')}</label>
          <select id="migMode">
            <option value="copy">${t('copyMode')}</option>
            <option value="move">${t('moveMode')}</option>
          </select>
        </div>
        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2);margin-bottom:10px;cursor:pointer;">
          <input type="checkbox" id="migOverwrite" style="accent-color:var(--red);"> ${t('migrateOverwrite')}
        </label>
        <button class="primary" onclick="migrateSkill()">${t('migrateGo')}</button>
      </div>
    `;
    document.getElementById('detailToggleBtn').onclick = () => toggleSkillDisabled(s.name, !s.disabled);
  }

  else if (state.activeTab === 'edit') {
    body.innerHTML = `
      <div class="edit-field">
        <label>${t('eName')}</label>
        <input type="text" id="editName" value="${escapeAttr(s.name)}">
      </div>
      <div class="edit-field">
        <label>${t('eDesc')}</label>
        <input type="text" id="editDesc" value="${escapeAttr(s.description || '')}">
      </div>
      <div class="edit-field">
        <label>${t('eVersion')}</label>
        <input type="text" id="editVersion" value="${escapeAttr(s.version || '')}">
      </div>
      <div class="edit-field">
        <label>${t('eAuthor')}</label>
        <input type="text" id="editAuthor" value="${escapeAttr(s.author || '')}">
      </div>
      <div class="edit-field">
        <label>${t('ePlatforms')}</label>
        <input type="text" id="editPlatforms" value="${escapeAttr((s.platforms || []).join(', '))}">
      </div>
      <div class="edit-field">
        <label>${t('eTags')}</label>
        <input type="text" id="editTags" value="${escapeAttr((s.tags || []).join(', '))}">
      </div>
      <div class="edit-field">
        <label>${t('eBody')}</label>
        <div class="body-editor" id="editBody" contenteditable="true">${escapeHtml(s.body || '')}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="primary" onclick="saveSkill()">${t('save')}</button>
        <button onclick="cancelEdit()">${t('cancel')}</button>
      </div>
    `;
  }

  else if (state.activeTab === 'files') {
    const allFiles = [
      ...s.refs.map(f => ({...f, dir: 'references', icon: '📄'})),
      ...s.templates.map(f => ({...f, dir: 'templates', icon: '📝'})),
      ...s.scripts.map(f => ({...f, dir: 'scripts', icon: '⚙️'})),
    ];

    body.innerHTML = `
      <div class="detail-section">
        <h4>${t('filesCount')} (${allFiles.length})</h4>
        ${allFiles.length === 0 ? `<div class="empty-state">${t('noSubfiles')}</div>` : `
          <ul class="file-list">
            ${allFiles.map((f, index) => `
              <li data-file-index="${index}">
                <span class="file-icon">${f.icon}</span>
                <span class="file-name">${escapeHtml(f.name)}</span>
                <span class="file-size">${(f.size / 1024).toFixed(1)}KB</span>
              </li>
            `).join('')}
          </ul>
        `}
      </div>
      <div class="detail-section">
        <h4>${t('newSubfile')}</h4>
        <div class="edit-field">
          <label>${t('subfileType')}</label>
          <select id="newSubdir">
            <option value="references">${t('refDoc')}</option>
            <option value="templates">${t('tmplDoc')}</option>
            <option value="scripts">${t('scriptDoc')}</option>
          </select>
        </div>
        <div class="edit-field">
          <label>${t('fileName')}</label>
          <input type="text" id="newFilename" placeholder="${t('phFilename')}">
        </div>
        <button class="primary" onclick="createSubfile()">${t('create')}</button>
      </div>
    `;
    body.querySelectorAll('[data-file-index]').forEach(item => {
      const file = allFiles[Number(item.dataset.fileIndex)];
      item.onclick = () => openFileEditor(file.dir, file.name);
    });
  }

  else if (state.activeTab === 'compare') {
    // Find same skill across sources
    const sameName = state.selectedSkill.name;
    const matches = state.skills.filter(s => s.dir_name === state.selectedSkill.dir_name || s.name === sameName);

    body.innerHTML = `
      <div class="detail-section">
        <h4>${t('compareOf')}: "${escapeHtml(sameName)}"</h4>
        <div class="compare-grid">
          ${matches.map(m => `
            <div class="compare-card">
              <div class="source-label">${escapeHtml(m.source)}</div>
              <div class="cmp-title">${escapeHtml(m.name)}</div>
              <div class="cmp-desc">${escapeHtml(m.description || t('noDesc')).substring(0, 100)}</div>
              <div style="margin-top:6px;font-size:11px;color:var(--text2);">
                v${escapeHtml(m.version || '?')} · 📂 ${escapeHtml(m.category)} · ${(m.size / 1024).toFixed(1)}KB
              </div>
            </div>
          `).join('')}
        </div>
        ${matches.length <= 1 ? `<div style="margin-top:12px;color:var(--text2);font-size:12px;">${t('noSameOtherSource')}</div>` : ''}
      </div>
    `;
  }
}

// ─── Tab switching ───
document.querySelectorAll('.detail-tabs button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.detail-tabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeTab = btn.dataset.tab;
    renderDetailTab();
    if (state.activeTab === 'security' && state.security.available) {
      const report = state.selectedSkill && getSecurityReport(state.selectedSkill);
      if (!report || report.summaryOnly) scanSelectedSkill(false);
    }
  };
});

// ─── Toggle disabled ───
async function toggleSkillDisabled(name, makeDisabled) {
  try {
    const data = await api('/api/disabled/toggle', {
      method: 'PUT',
      body: JSON.stringify({ name, disabled: makeDisabled }),
    });
    if (data.ok) {
      // disabled 是全局名称级配置：同步更新所有 source 中的同名 skill
      state.skills.forEach(s => { if (s.name === name || s.dir_name === name) s.disabled = makeDisabled; });
      if (state.overview?.summary) {
        const names = new Set(state.skills.filter(s => s.disabled).map(s => s.name));
        state.overview.summary.disabled_names = names.size;
      }
      updateHeaderStats();
      renderPlatformOverview();
      renderSidebar();
      renderGrid();
      // Update detail panel if open
      if (state.selectedSkill && state.selectedSkill.name === name) {
        state.selectedSkill.disabled = makeDisabled;
        renderDetailTab();
      }
      toast(makeDisabled ? t('disabledMsg', name) : t('enabledMsg', name));
    }
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

// ─── Migrate (copy/move across sources) ───
async function migrateSkill() {
  const s = state.selectedSkill;
  const toSource = document.getElementById('migTarget').value;
  const mode = document.getElementById('migMode').value;
  const overwrite = document.getElementById('migOverwrite').checked;
  let toCategory = document.getElementById('migCategory').value.trim();

  // 平铺目标不需要分类；非平铺目标留空则后端默认 migrated
  const flatTargets = state.agents.flatMap(a => a.instances.filter(i => i.flat).map(i => i.label));
  if (flatTargets.includes(toSource)) toCategory = '';

  const verb = mode === 'move' ? t('moveVerb') : t('copyVerb');
  if (!confirm(t('confirmMigrate', verb, toSource, s.name))) return;

  try {
    const resp = await api('/api/migrate', {
      method: 'POST',
      body: JSON.stringify({
        from_source: s.source,
        from_category: s.category,
        name: s.name,
        to_source: toSource,
        to_category: toCategory,
        mode,
        overwrite,
      }),
    });
    toast(t('migrated', resp.message));
    closeDetail();
    await refreshSkills();
  } catch(e) {
    const msg = (e.message && e.message.includes('already exists')) ? t('targetExists') : t('migrateFail') + e.message;
    toast(msg, 'error');
  }
}

// ─── Edit ───
function enableEdit() {
  state.editMode = true;
  state.activeTab = 'edit';
  document.querySelectorAll('.detail-tabs button').forEach(b => b.classList.remove('active'));
  document.querySelector('.detail-tabs button[data-tab="edit"]').classList.add('active');
  renderDetailTab();
}

async function saveSkill() {
  const s = state.selectedSkill;
  const data = {
    source: s.source,
    category: s.category,
    name: document.getElementById('editName').value,
    description: document.getElementById('editDesc').value,
    version: document.getElementById('editVersion').value,
    author: document.getElementById('editAuthor').value,
    platforms: document.getElementById('editPlatforms').value.split(',').map(x => x.trim()).filter(Boolean),
    tags: document.getElementById('editTags').value.split(',').map(x => x.trim()).filter(Boolean),
    body: document.getElementById('editBody').innerText,
  };

  try {
    await api('/api/skill', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    toast(t('saved'));
    state.editMode = false;
    // Refresh
    const idx = state.skills.findIndex(x => x.source === s.source && x.category === s.category && x.name === s.name);
    if (idx >= 0) {
      Object.assign(state.skills[idx], data);
    }
    openDetail(state.skills[idx]);
    renderGrid();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

function cancelEdit() {
  state.editMode = false;
  state.activeTab = 'info';
  document.querySelectorAll('.detail-tabs button').forEach(b => b.classList.remove('active'));
  document.querySelector('.detail-tabs button[data-tab="info"]').classList.add('active');
  renderDetailTab();
}

// ─── Subfile editor ───
async function openFileEditor(subdir, filename) {
  const s = state.selectedSkill;

  try {
    const data = await api(`/api/file?source=${encodeURIComponent(s.source)}&category=${encodeURIComponent(s.category)}&skill_name=${encodeURIComponent(s.name)}&subdir=${encodeURIComponent(subdir)}&filename=${encodeURIComponent(filename)}`);
    const content = data.content;

    const body = document.getElementById('detailBody');
    body.innerHTML = `
      <div class="detail-section">
        <h4>${t('editingFile')}: ${escapeHtml(subdir)}/${escapeHtml(filename)}</h4>
        <div class="edit-field">
          <textarea class="body-editor" id="fileContent" style="min-height:400px;">${escapeHtml(content)}</textarea>
        </div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="primary" id="saveFileBtn">${t('save')}</button>
          <button id="backToFilesBtn">${t('back')}</button>
        </div>
      </div>
    `;
    document.getElementById('saveFileBtn').onclick = () => saveFile(subdir, filename);
    document.getElementById('backToFilesBtn').onclick = renderDetailTab;
  } catch(e) {
    toast(t('readFail') + e.message, 'error');
  }
}

async function saveFile(subdir, filename) {
  const s = state.selectedSkill;
  const content = document.getElementById('fileContent').value;

  try {
    await api('/api/skill/file', {
      method: 'PUT',
      body: JSON.stringify({
        source: s.source,
        category: s.category,
        skill_name: s.name,
        subdir,
        filename,
        content,
      }),
    });
    toast(t('fileSaved'));
    renderDetailTab();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

async function createSubfile() {
  const s = state.selectedSkill;
  const subdir = document.getElementById('newSubdir').value;
  const filename = document.getElementById('newFilename').value;

  if (!filename) {
    toast(t('needFilename'), 'error');
    return;
  }

  try {
    await api('/api/skill/file', {
      method: 'PUT',
      body: JSON.stringify({
        source: s.source,
        category: s.category,
        skill_name: s.name,
        subdir,
        filename,
        content: '',
      }),
    });
    toast(t('fileCreated'));
    document.getElementById('newFilename').value = '';
    // Refresh skill data
    const full = await api(`/api/skill?source=${encodeURIComponent(s.source)}&category=${encodeURIComponent(s.category)}&name=${encodeURIComponent(s.name)}`);
    state.selectedSkill = full;
    state.activeTab = 'files';
    renderDetailTab();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

// ─── Create ───
function showCreateDialog() {
  const body = document.getElementById('detailBody');
  body.innerHTML = `
    <div class="detail-section">
      <h4>${t('newSkill')}</h4>
      <div class="edit-field">
        <label>${t('nSource')}</label>
        <select id="newSource">
          ${state.sources.filter(src => src.startsWith('hermes/')).map(s => `<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join('')}
        </select>
      </div>
      <div class="edit-field">
        <label>${t('nCategory')}</label>
        <input type="text" id="newCategory" placeholder="${t('phCategory')}">
      </div>
      <div class="edit-field">
        <label>${t('nName')}</label>
        <input type="text" id="newName" placeholder="${t('phName')}">
      </div>
      <div class="edit-field">
        <label>${t('nDesc')}</label>
        <input type="text" id="newDesc" placeholder="${t('phDesc')}">
      </div>
      <div class="edit-field">
        <label>${t('nVersion')}</label>
        <input type="text" id="newVersion" value="1.0.0">
      </div>
      <div class="edit-field">
        <label>${t('nAuthor')}</label>
        <input type="text" id="newAuthor">
      </div>
      <div class="edit-field">
        <label>${t('nBody')}</label>
        <div class="body-editor" id="newBody" contenteditable="true">${t('nBodyPlaceholder')}</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="primary" onclick="createSkill()">${t('create')}</button>
        <button onclick="closeDetail()">${t('cancel')}</button>
      </div>
    </div>
  `;

  document.getElementById('detailTitle').textContent = t('newSkill');
  document.getElementById('detailPanel').classList.add('open');
  state.activeTab = 'edit';
}

async function createSkill() {
  const data = {
    source: document.getElementById('newSource').value,
    category: document.getElementById('newCategory').value,
    name: document.getElementById('newName').value,
    description: document.getElementById('newDesc').value,
    version: document.getElementById('newVersion').value,
    author: document.getElementById('newAuthor').value,
    body: document.getElementById('newBody').innerText,
  };

  if (!data.name || !data.category) {
    toast(t('needNameCat'), 'error');
    return;
  }

  try {
    await api('/api/skill', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    toast(t('created'));
    closeDetail();
    // Refresh
    const skillsData = await api('/api/skills');
    state.skills = skillsData.skills;
    updateHeaderStats();
    renderSidebar();
    renderGrid();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

// ─── Delete ───
async function deleteSkill() {
  const s = state.selectedSkill;
  if (!confirm(t('confirmDelete', s.name))) return;

  try {
    await api(`/api/skill?source=${encodeURIComponent(s.source)}&category=${encodeURIComponent(s.category)}&name=${encodeURIComponent(s.name)}`, {
      method: 'DELETE',
    });
    toast(t('deleted'));
    closeDetail();
    state.skills = state.skills.filter(x => !(x.source === s.source && x.category === s.category && x.name === s.name));
    updateHeaderStats();
    renderSidebar();
    renderGrid();
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  }
}

// ─── Compare ───
function showCompare() {
  const body = document.getElementById('detailBody');
  body.innerHTML = `<div class="empty-state">${t('loading')}</div>`;

  document.getElementById('detailTitle').textContent = t('compareTitle');
  document.getElementById('detailPanel').classList.add('open');
  state.activeTab = 'compare';

  // Group skills by dir_name
  const groups = {};
  state.skills.forEach(s => {
    const key = s.dir_name || s.name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });

  // Find skills that exist in multiple sources
  const multiSource = Object.entries(groups).filter(([k, v]) => v.length > 1);

  body.innerHTML = `
    <div class="detail-section">
      <h4>${t('multiSourceSkills')} (${multiSource.length})</h4>
      ${multiSource.length === 0 ? `<div class="empty-state">${t('noCrossSource')}</div>` : `
        <div class="compare-grid">
          ${multiSource.slice(0, 50).map(([name, skills]) => `
            <div class="compare-card">
              <div class="cmp-title">${escapeHtml(name)}</div>
              <div style="margin-top:6px;">
                ${skills.map(s => `
                  <div style="font-size:11px;color:var(--text2);margin:2px 0;">
                    <span class="badge green">${escapeHtml(s.source)}</span>
                    v${escapeHtml(s.version || '?')} · ${escapeHtml(s.category)}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// ─── Event Handlers ───
let _searchTimer = null;
document.getElementById('searchInput').oninput = (e) => {
  state.filters.search = e.target.value;
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(renderGrid, 120);  // 防抖：停止输入 120ms 后才重渲染
};

document.getElementById('sourceFilter').onchange = (e) => {
  setSourceFilter(e.target.value, false);
};

document.getElementById('categoryFilter').onchange = (e) => {
  state.filters.category = e.target.value;
  syncFilterOptions();
  renderSidebar();
  renderGrid();
};

document.getElementById('disabledFilter').onchange = (e) => {
  state.filters.disabled = e.target.value;
  renderGrid();
};

// ─── View switcher ───
function setView(v) {
  state.view = v;
  localStorage.setItem('skillhub_view', v);
  document.getElementById('viewGridBtn').classList.toggle('active', v === 'grid');
  document.getElementById('viewListBtn').classList.toggle('active', v === 'grid' ? false : true);
  renderGrid();
}

// ─── Theme ───
function toggleTheme() {
  const cur = document.documentElement.dataset.theme === 'light' ? '' : 'light';
  document.documentElement.dataset.theme = cur;
  localStorage.setItem('skillhub_theme', cur || 'dark');
  applyThemeIcon();
}
function applyThemeIcon() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  const light = document.documentElement.dataset.theme === 'light';
  btn.textContent = light ? '☀️' : '🌙';
  const tip = light ? t('lightModeTip') : t('darkModeTip');
  if (tip && tip !== 'lightModeTip') btn.title = tip;
}
(function initTheme() {
  const saved = localStorage.getItem('skillhub_state_theme');
  if (saved) localStorage.setItem('skillhub_theme', saved); // 兼容旧 key
  const th = localStorage.getItem('skillhub_theme');
  if (th === 'light') document.documentElement.dataset.theme = 'light';
})();

// ─── Sort ───
const sortSel = document.getElementById('sortSel');
sortSel.value = state.sort;
sortSel.onchange = (e) => {
  state.sort = e.target.value;
  localStorage.setItem('skillhub_sort', state.sort);
  renderGrid();
};

// ─── Rescan ───
async function rescanAll() {
  const btn = document.getElementById('rescanBtn');
  btn.classList.add('spinning');
  try {
    await api('/api/rescan', { method: 'POST' });
    // 轮询等重扫完成
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 500));
      const st = await api('/api/status');
      if (st.ready) break;
    }
    // 重拉全量数据（重扫可能发现新 skill / 新分类）
    const [skillsData, overviewData] = await Promise.all([
      api('/api/skills'),
      api('/api/overview'),
    ]);
    state.skills = skillsData.skills;
    state.overview = overviewData;
    state.sources = (overviewData.sources || []).map(s => s.label);
    state.categories = overviewData.categories || [];
    state.agents = overviewData.agents || [];
    updateHeaderStats();
    rerenderWorkspace();
    toast(t('rescanDone', state.skills.length));
  } catch(e) {
    toast(t('errPrefix') + e.message, 'error');
  } finally {
    btn.classList.remove('spinning');
  }
}

// ─── Language switcher ───
document.getElementById('langSwitcher').value = LANG;
document.getElementById('langSwitcher').onchange = (e) => {
  LANG = e.target.value;
  localStorage.setItem('skillhub_lang', LANG);
  applyStaticI18n();
  updateHeaderStats();
  syncFilterOptions();
  renderPlatformOverview();
  renderSidebar();
  renderGrid();
  if (state.selectedSkill) {
    const panelOpen = document.getElementById('detailPanel').classList.contains('open');
    if (panelOpen && state.activeTab === 'compare') showCompare();
    else renderDetailTab();
  }
};

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeDetail(); toggleSidebar(false); }
  if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
});

// Init
document.getElementById('langSwitcher').value = LANG;
applyStaticI18n();
init();
