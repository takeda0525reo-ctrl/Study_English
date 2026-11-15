/* Study English — アプリ本体（ビルド不要・依存ライブラリなし） */
(function () {
  'use strict';

  /* ================= Utilities ================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = s => String(s).replace(/[&<>"']/g, c => ESC[c]);
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  /** 端末のローカル時刻での「日」の通し番号 */
  const today = () => {
    const d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  };

  /* ================= Data ================= */
  const LEVELS = [
    { id: 'l1', name: '高1 基礎', desc: '高校英語の土台になる必修語' },
    { id: 'l2', name: '高2 標準', desc: '教科書・模試でよく出る重要語' },
    { id: 'l3', name: '共通テスト・入試標準', desc: '共通テストや中堅大で差がつく語' },
    { id: 'l4', name: '難関大', desc: '難関国公立・私大の長文で問われる語' }
  ];
  const WORDS = [];
  LEVELS.forEach(lv => {
    String((window.WORD_DATA || {})[lv.id] || '').split('\n').forEach(line => {
      const p = line.trim().split('|');
      if (p.length < 5) return;
      WORDS.push({ id: p[0], w: p[0], pos: p[1], ja: p[2], ex: p[3], exJa: p[4], lv: lv.id });
    });
  });
  const wordsOf = lvId => WORDS.filter(w => w.lv === lvId);

  const UNITS = window.GRAMMAR_DATA || [];
  UNITS.forEach(u => u.qs.forEach((q, i) => { q.id = u.id + '-' + (i + 1); q.unit = u; }));
  const ALL_QS = UNITS.reduce((a, u) => a.concat(u.qs), []);

  const MODES = {
    auto: { name: 'おすすめ学習', desc: '習熟度に合わせて 4択 → スペル入力へ自動でステップアップ' },
    'en-ja': { name: '英語 → 日本語', desc: '英単語を見て意味を4択で答える' },
    'ja-en': { name: '日本語 → 英語', desc: '意味を見て英単語を4択で答える' },
    spell: { name: 'スペル入力', desc: '意味を見て英単語をタイプする' },
    card: { name: 'フラッシュカード', desc: 'カードをめくって自己チェック' }
  };

  /* ================= Store (localStorage) ================= */
  const KEY = 'study-english:v1';
  const defaults = () => ({
    v: 1,
    words: {},     // { [単語]: { b: 段階0-5, due: 次回復習日, ok, ng, last } }
    grammar: {},   // { [問題ID]: { ok, ng, last, lastOk } }
    read: {},      // { [単元ID]: true }
    days: {},      // { [日の通し番号]: { n: 解答数, ok: 正解数 } }
    settings: { size: 10, goal: 20, voice: true, theme: 'auto' }
  });
  const merge = o => {
    const d = defaults();
    if (!o || typeof o !== 'object') return d;
    ['words', 'grammar', 'read', 'days'].forEach(k => { if (o[k] && typeof o[k] === 'object') d[k] = o[k]; });
    if (o.settings && typeof o.settings === 'object') Object.assign(d.settings, o.settings);
    return d;
  };
  let S = defaults();
  try { S = merge(JSON.parse(localStorage.getItem(KEY))); } catch (e) { /* 保存データなし */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* 保存不可の環境でも動作は続ける */ } };

  /* ---- 単語：間隔反復（正解するほど復習間隔が延びる） ---- */
  const INTERVALS = [0, 1, 3, 7, 14, 30]; // 段階ごとの次回復習までの日数
  const wordStatus = id => {
    const s = S.words[id];
    return !s ? 'new' : s.b >= 4 ? 'done' : 'learning';
  };
  const bumpDay = ok => {
    const t = today();
    const d = S.days[t] || (S.days[t] = { n: 0, ok: 0 });
    d.n++;
    if (ok) d.ok++;
  };
  const recordWord = (id, ok) => {
    const t = today();
    const s = S.words[id] || (S.words[id] = { b: 0, due: t, ok: 0, ng: 0 });
    if (ok) { s.b = Math.min(5, s.b + 1); s.ok++; s.due = t + INTERVALS[s.b]; }
    else { s.b = 1; s.ng++; s.due = t; }
    s.last = t;
    bumpDay(ok);
    save();
  };
  const recordGrammar = (id, ok) => {
    const g = S.grammar[id] || (S.grammar[id] = { ok: 0, ng: 0 });
    if (ok) g.ok++; else g.ng++;
    g.lastOk = ok;
    g.last = today();
    bumpDay(ok);
    save();
  };

  const countWords = list => {
    let done = 0, learning = 0;
    list.forEach(w => { const s = wordStatus(w.id); if (s === 'done') done++; else if (s === 'learning') learning++; });
    return { done, learning, fresh: list.length - done - learning, total: list.length };
  };
  const unitScore = u => {
    let ok = 0, tried = 0;
    u.qs.forEach(q => { const g = S.grammar[q.id]; if (g) { tried++; if (g.lastOk) ok++; } });
    return { ok, tried, total: u.qs.length };
  };
  const dueWords = () => { const t = today(); return WORDS.filter(w => S.words[w.id] && S.words[w.id].due <= t); };
  const weakWords = () => WORDS.filter(w => { const s = S.words[w.id]; return s && s.ng > 0 && s.b <= 2; });
  const wrongQs = () => ALL_QS.filter(q => S.grammar[q.id] && S.grammar[q.id].lastOk === false);
  const streak = () => {
    let d = today(), n = 0;
    if (!S.days[d]) d--;
    while (S.days[d] && S.days[d].n > 0) { n++; d--; }
    return n;
  };

  /* ================= 出題ロジック ================= */
  /** 復習期限が来た語 → 未学習の語 → その他、の優先順で n 語選ぶ */
  const pickWords = (pool, n) => {
    const t = today();
    const st = w => S.words[w.id];
    const due = shuffle(pool.filter(w => st(w) && st(w).due <= t)).sort((a, b) => st(a).due - st(b).due);
    const fresh = shuffle(pool.filter(w => !st(w)));
    const rest = shuffle(pool.filter(w => st(w) && st(w).due > t)).sort((a, b) => st(a).b - st(b).b);
    const half = fresh.length ? Math.ceil(n / 2) : n;
    const picked = due.slice(0, half);
    for (const w of fresh.concat(due.slice(half), rest)) {
      if (picked.length >= n) break;
      picked.push(w);
    }
    return shuffle(picked);
  };
  const kindFor = (mode, w) => {
    if (mode !== 'auto') return mode;
    const b = S.words[w.id] ? S.words[w.id].b : 0;
    return b <= 1 ? 'en-ja' : b === 2 ? 'ja-en' : 'spell';
  };
  const glosses = w => w.ja.split('、').map(g => g.replace(/^（.*?）/, '').replace(/^(を|に|と|から)/, ''));
  /** 4択の誤答選択肢。同じレベル・同じ品詞を優先し、意味がかぶる語は除く */
  const distract = w => {
    const mine = new Set(glosses(w));
    const cand = WORDS.filter(o => o.lv === w.lv && o !== w && !glosses(o).some(g => mine.has(g)));
    return shuffle(cand.filter(o => o.pos === w.pos)).concat(shuffle(cand.filter(o => o.pos !== w.pos))).slice(0, 3);
  };
  const fullSentence = q => (q.t === 'c' ? q.q.replace('( )', q.c[q.a]) : q.w.join(' ') + (q.end || '.'));

  /* ================= 音声 ================= */
  const canSpeak = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
  const speak = text => {
    if (!canSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) { /* 音声非対応 */ }
  };
  const ICON_SPK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500z"/><path d="M15.500 9a4 4 0 0 1 0 6"/><path d="M18 6.500a7.500 7.500 0 0 1 0 11"/></svg>';
  const spk = text => (canSpeak ? `<button type="button" class="icon-btn" data-act="speak" data-text="${esc(text)}" aria-label="発音を聞く">${ICON_SPK}</button>` : '');

  /* ================= Session ================= */
  let session = null;
  const startSession = cfg => {
    if (!cfg || !cfg.items.length) return;
    session = Object.assign({ i: 0, res: [], cur: null }, cfg);
    if (location.hash === '#/session') render(); else location.hash = '#/session';
  };
  const sessionActive = () => !!session && session.i < session.items.length;

  const vocabSession = (levelId, mode) => {
    const lv = LEVELS.find(l => l.id === levelId);
    if (!lv || !MODES[mode]) return;
    const make = () => ({
      title: lv.name + '｜' + MODES[mode].name,
      back: '#/vocab/' + levelId,
      items: pickWords(wordsOf(levelId), S.settings.size).map(w => ({ kind: kindFor(mode, w), w })),
      remake: make
    });
    startSession(make());
  };
  const grammarSession = unitId => {
    const u = UNITS.find(x => x.id === unitId);
    if (!u) return;
    const make = () => ({
      title: u.title,
      back: '#/grammar/' + u.id,
      items: shuffle(u.qs).map(q => ({ kind: 'gq', q })),
      remake: make
    });
    startSession(make());
  };
  const reviewSession = kind => {
    const n = S.settings.size;
    const make = () => {
      let items;
      if (kind === 'due') items = shuffle(dueWords()).slice(0, n).map(w => ({ kind: kindFor('auto', w), w }));
      else if (kind === 'weak') items = shuffle(weakWords()).slice(0, n).map(w => ({ kind: 'en-ja', w }));
      else items = shuffle(wrongQs()).slice(0, n).map(q => ({ kind: 'gq', q }));
      return { title: '復習', back: '#/review', items, remake: make };
    };
    startSession(make());
  };

  const prepare = item => {
    const cur = { done: false, ok: null };
    if (item.kind === 'en-ja' || item.kind === 'ja-en') {
      cur.opts = shuffle([item.w].concat(distract(item.w)));
      cur.picked = null;
    } else if (item.kind === 'spell') {
      cur.value = '';
    } else if (item.kind === 'card') {
      cur.flipped = false;
    } else if (item.q.t === 'c') {
      cur.order = shuffle(item.q.c.map((_, i) => i));
      cur.picked = null;
    } else {
      const idx = item.q.w.map((_, i) => i);
      let pool = shuffle(idx);
      for (let k = 0; k < 6 && pool.every((v, i) => v === i); k++) pool = shuffle(idx);
      cur.pool = pool;
      cur.placed = [];
    }
    return cur;
  };
  const finish = ok => {
    const it = session.items[session.i];
    session.cur.done = true;
    session.cur.ok = ok;
    session.res.push({ item: it, ok });
    if (it.kind === 'gq') recordGrammar(it.q.id, ok); else recordWord(it.w.id, ok);
  };
  const autoSpeak = () => {
    if (!S.settings.voice || !sessionActive()) return;
    const it = session.items[session.i];
    if (it.kind === 'en-ja' || it.kind === 'card') speak(it.w.w);
  };

  /* ================= Views ================= */
  const stackBar = c => `<div class="bar" role="img" aria-label="定着 ${c.done}語、学習中 ${c.learning}語、全${c.total}語"><i class="b-done" style="width:${(c.done / c.total) * 100}%"></i><i class="b-learn" style="width:${(c.learning / c.total) * 100}%"></i></div>`;
  const legend = c => `<div class="legend"><span class="l-done">定着 <b>${c.done}</b></span><span class="l-learn">学習中 <b>${c.learning}</b></span><span>未学習 <b>${c.fresh}</b></span></div>`;
  const simpleBar = (a, b) => `<div class="bar" role="img" aria-label="${b}問中${a}問正解"><i class="b-done" style="width:${pct(a, b)}%"></i></div>`;
  const levelTag = lv => `<span class="tag ${lv === '発展' ? 'warm' : lv === '標準' ? 'accent' : ''}">${esc(lv)}</span>`;

  function viewHome() {
    const t = today();
    const d = S.days[t] || { n: 0, ok: 0 };
    const goal = S.settings.goal;
    const all = countWords(WORDS);
    const g = UNITS.reduce((a, u) => { const s = unitScore(u); a.ok += s.ok; a.total += s.total; return a; }, { ok: 0, total: 0 });
    const due = dueWords().length;
    const nextLv = LEVELS.find(lv => { const c = countWords(wordsOf(lv.id)); return c.fresh > 0; }) || LEVELS[LEVELS.length - 1];
    const nextUnit = UNITS.find(u => { const s = unitScore(u); return s.ok < s.total; }) || UNITS[0];
    const WD = ['日', '月', '火', '水', '木', '金', '土'];
    const week = [];
    for (let i = 6; i >= 0; i--) week.push({ k: t - i, n: (S.days[t - i] || { n: 0 }).n });
    const max = Math.max(goal, ...week.map(x => x.n));
    const msg = d.n === 0 ? '今日の学習を始めよう' : d.n >= goal ? '今日の目標を達成！' : `目標まであと ${goal - d.n} 問`;

    return `
    <section class="card hero">
      <div class="ring" style="--p:${Math.min(100, pct(d.n, goal))}" role="img" aria-label="今日 ${d.n}問 / 目標 ${goal}問"><div><span><b>${d.n}</b><small>/ ${goal} 問</small></span></div></div>
      <div class="hero-text">
        <h1>${msg}</h1>
        <p>${d.n ? `今日の正答率 ${pct(d.ok, d.n)}%` : '単語と文法を、毎日少しずつ。'}</p>
      </div>
    </section>

    <div class="stats" style="margin-top:12px">
      <div class="stat warm"><b>${streak()}</b><span>連続学習日数</span></div>
      <div class="stat"><b>${all.done}<small class="muted small"> / ${all.total}</small></b><span>定着した単語</span></div>
      <div class="stat"><b>${g.ok}<small class="muted small"> / ${g.total}</small></b><span>文法の正解問題</span></div>
    </div>

    <h2 class="sec-title">次にやること</h2>
    <div class="grid">
      ${due ? `<button class="card next-card" data-act="review" data-kind="due">
        <div class="grow"><span class="tag warm">復習</span><h2>復習する単語が ${due} 語あります</h2><p>忘れかけた頃にもう一度。記憶に定着させよう</p></div><span class="chev" aria-hidden="true">›</span>
      </button>` : ''}
      <button class="card next-card" data-act="start" data-level="${nextLv.id}" data-mode="auto">
        <div class="grow"><span class="tag accent">単語</span><h2>${esc(nextLv.name)} を ${S.settings.size} 語学習</h2><p>${esc(nextLv.desc)}</p></div><span class="chev" aria-hidden="true">›</span>
      </button>
      <a class="card next-card" href="#/grammar/${nextUnit.id}">
        <div class="grow"><span class="tag accent">文法</span><h2>${esc(nextUnit.title)}</h2><p>${esc(nextUnit.summary)}</p></div><span class="chev" aria-hidden="true">›</span>
      </a>
    </div>

    <h2 class="sec-title">この7日間の学習</h2>
    <section class="card">
      <div class="week">
        ${week.map(x => `<div class="col${x.k === t ? ' today' : ''}"><span class="v">${x.n || ''}</span><div class="b${x.n ? '' : ' zero'}" style="height:${x.n ? Math.max(6, (x.n / max) * 100) : 0}%"></div><span class="d">${WD[new Date(x.k * 86400000).getUTCDay()]}</span></div>`).join('')}
      </div>
    </section>`;
  }

  function viewVocab() {
    return `
    <div class="page-head"><h1>単語</h1><p>高1の基礎から難関大レベルまで、全 ${WORDS.length} 語。レベルを選んで学習しよう。</p></div>
    <div class="grid">
      ${LEVELS.map((lv, i) => {
        const c = countWords(wordsOf(lv.id));
        return `<a class="card row-card" href="#/vocab/${lv.id}">
          <span class="num${c.done === c.total ? ' done' : ''}" aria-hidden="true">${i + 1}</span>
          <div class="grow"><h2>${esc(lv.name)} <span class="tag">${c.total}語</span></h2><p>${esc(lv.desc)}</p>${stackBar(c)}${legend(c)}</div>
          <span class="chev" aria-hidden="true">›</span>
        </a>`;
      }).join('')}
    </div>`;
  }

  function viewLevel(lvId) {
    const lv = LEVELS.find(l => l.id === lvId);
    if (!lv) return viewVocab();
    const c = countWords(wordsOf(lvId));
    const mode = (id, primary) => `<button class="card mode${primary ? ' primary' : ''}" data-act="start" data-level="${lvId}" data-mode="${id}">
      <div class="grow"><b>${MODES[id].name}</b><span>${MODES[id].desc}</span></div><span class="chev" aria-hidden="true">›</span></button>`;
    return `
    <a class="crumb" href="#/vocab">‹ 単語</a>
    <div class="page-head"><h1>${esc(lv.name)}</h1><p>${esc(lv.desc)}</p></div>
    <section class="card">${stackBar(c)}${legend(c)}</section>
    <h2 class="sec-title">学習する（1回 ${S.settings.size} 語）</h2>
    <div class="grid">${mode('auto', true)}</div>
    <h2 class="sec-title">形式を選んで練習</h2>
    <div class="grid two">${mode('en-ja')}${mode('ja-en')}${mode('spell')}${mode('card')}</div>
    <h2 class="sec-title">確認する</h2>
    <a class="card mode" href="#/vocab/${lvId}/list"><div class="grow"><b>単語一覧</b><span>全 ${c.total} 語の意味・例文・学習状況</span></div><span class="chev" aria-hidden="true">›</span></a>`;
  }

  const listState = { q: '', f: 'all', lv: null };
  const listRows = lvId => {
    const q = listState.q.trim().toLowerCase();
    const rows = wordsOf(lvId).filter(w => {
      if (listState.f !== 'all' && wordStatus(w.id) !== listState.f) return false;
      return !q || w.w.toLowerCase().includes(q) || w.ja.includes(q);
    });
    if (!rows.length) return '<div class="empty">該当する単語がありません</div>';
    const label = { new: '未学習', learning: '学習中', done: '定着' };
    return rows.map(w => {
      const st = wordStatus(w.id);
      return `<div class="wl-row">
        <span class="dot ${st}" role="img" aria-label="${label[st]}" title="${label[st]}"></span>
        <div class="wl-main"><div><span class="wl-w">${esc(w.w)}</span> <span class="tag">${esc(w.pos)}</span></div><div class="wl-ja">${esc(w.ja)}</div><div class="wl-ex"><span class="en">${esc(w.ex)}</span><br>${esc(w.exJa)}</div></div>
        ${spk(w.w)}
      </div>`;
    }).join('');
  };
  function viewList(lvId) {
    const lv = LEVELS.find(l => l.id === lvId);
    if (!lv) return viewVocab();
    if (listState.lv !== lvId) { listState.lv = lvId; listState.q = ''; listState.f = 'all'; }
    const chip = (f, name) => `<button class="chip${listState.f === f ? ' on' : ''}" data-act="filter" data-f="${f}" aria-pressed="${listState.f === f}">${name}</button>`;
    return `
    <a class="crumb" href="#/vocab/${lvId}">‹ ${esc(lv.name)}</a>
    <div class="page-head"><h1>単語一覧</h1></div>
    <div class="tools">
      <input class="search" id="wl-q" type="search" placeholder="英語・日本語で検索" aria-label="単語を検索" value="${esc(listState.q)}">
      <div class="chips">${chip('all', 'すべて')}${chip('new', '未学習')}${chip('learning', '学習中')}${chip('done', '定着')}</div>
    </div>
    <div class="wl" id="wl">${listRows(lvId)}</div>`;
  }

  function viewGrammar() {
    return `
    <div class="page-head"><h1>文法</h1><p>全 ${UNITS.length} 単元・${ALL_QS.length} 問。解説を読んでから演習で確認しよう。</p></div>
    <div class="grid">
      ${UNITS.map((u, i) => {
        const s = unitScore(u);
        return `<a class="card row-card" href="#/grammar/${u.id}">
          <span class="num${s.ok === s.total ? ' done' : ''}" aria-hidden="true">${i + 1}</span>
          <div class="grow"><h2>${esc(u.title)} ${levelTag(u.level)}</h2><p>${esc(u.summary)}</p>${simpleBar(s.ok, s.total)}
          <div class="legend"><span class="l-done">正解 <b>${s.ok}</b> / ${s.total} 問</span>${S.read[u.id] ? '' : '<span>解説 未読</span>'}</div></div>
          <span class="chev" aria-hidden="true">›</span>
        </a>`;
      }).join('')}
    </div>`;
  }

  function viewUnit(unitId) {
    const u = UNITS.find(x => x.id === unitId);
    if (!u) return viewGrammar();
    if (!S.read[u.id]) { S.read[u.id] = true; save(); }
    const s = unitScore(u);
    return `
    <a class="crumb" href="#/grammar">‹ 文法</a>
    <div class="page-head"><h1>${esc(u.title)} ${levelTag(u.level)}</h1><p>${esc(u.summary)}</p></div>
    <div class="stack">
      ${u.points.map((p, i) => `<section class="card point">
        <h2><span class="n">${i + 1}</span><span>${esc(p.h)}</span></h2>
        <p>${esc(p.d)}</p>
        <ul class="exs">${p.ex.map(e => `<li><span class="en">${esc(e[0])}</span><span class="ja">${esc(e[1])}</span></li>`).join('')}</ul>
      </section>`).join('')}
    </div>
    <div class="sticky-cta"><button class="btn primary block" data-act="gstart" data-unit="${u.id}">演習を始める（${u.qs.length}問）${s.tried ? `<span class="small">前回 ${s.ok}/${s.total}</span>` : ''}</button></div>`;
  }

  function viewReview() {
    const due = dueWords().length, weak = weakWords().length, wrong = wrongQs().length;
    const row = (kind, n, title, desc, unit) => `<button class="card row-card" data-act="review" data-kind="${kind}" ${n ? '' : 'disabled'}>
      <span class="num" aria-hidden="true">${n}</span>
      <div class="grow"><h2>${title}</h2><p style="margin-bottom:0">${n ? desc : `今は対象の${unit}がありません`}</p></div>
      ${n ? '<span class="chev" aria-hidden="true">›</span>' : ''}</button>`;
    return `
    <div class="page-head"><h1>復習</h1><p>忘れかけた単語と、間違えた問題をまとめて解き直そう。</p></div>
    <div class="grid">
      ${row('due', due, '今日の復習単語', '復習のタイミングが来た単語。正解するたびに次の復習までの間隔が延びます', '単語')}
      ${row('weak', weak, '苦手な単語', '間違えたことがあり、まだ定着していない単語', '単語')}
      ${row('grammar', wrong, '文法の間違えた問題', '前回不正解だった文法問題をもう一度', '問題')}
    </div>
    <h2 class="sec-title">復習のしくみ</h2>
    <section class="card small muted">単語は正解するたびに 1日後 → 3日後 → 7日後 → 14日後 → 30日後 と復習の間隔が延び、4回続けて正解すると「定着」になります。間違えた単語はその日のうちにもう一度出題されます。</section>`;
  }

  function viewSettings() {
    const seg = (k, opts) => `<div class="seg" role="group">${opts.map(o => `<button data-act="set" data-k="${k}" data-v="${o[0]}" class="${String(S.settings[k]) === String(o[0]) ? 'on' : ''}" aria-pressed="${String(S.settings[k]) === String(o[0])}">${o[1]}</button>`).join('')}</div>`;
    return `
    <div class="page-head"><h1>設定</h1></div>
    <section class="card">
      <div class="set"><div><b>1回の出題数</b><small>単語学習・復習で1回に出す問題数</small></div>${seg('size', [[5, '5'], [10, '10'], [20, '20']])}</div>
      <div class="set"><div><b>1日の目標</b><small>ホームに表示する目標の問題数</small></div>${seg('goal', [[10, '10'], [20, '20'], [30, '30'], [50, '50']])}</div>
      <div class="set"><div><b>発音の自動再生</b><small>${canSpeak ? '単語を表示したときに英語の音声を再生' : 'このブラウザは音声読み上げに対応していません'}</small></div>${seg('voice', [[true, 'オン'], [false, 'オフ']])}</div>
      <div class="set"><div><b>テーマ</b><small>画面の配色</small></div>${seg('theme', [['auto', '自動'], ['light', 'ライト'], ['dark', 'ダーク']])}</div>
    </section>
    <h2 class="sec-title">学習データ</h2>
    <section class="card">
      <p class="small muted" style="margin-bottom:12px">学習記録はこの端末のブラウザ内に保存されます。機種変更やブラウザの変更のときは、書き出したファイルを読み込むと引き継げます。</p>
      <div class="btn-row">
        <button class="btn" data-act="export">データを書き出す</button>
        <button class="btn" data-act="import">データを読み込む</button>
        <button class="btn danger" data-act="reset">学習記録をリセット</button>
      </div>
      <input type="file" id="import-file" accept="application/json,.json" hidden>
    </section>`;
  }

  /* ---------- Session views ---------- */
  const posTag = w => `<span class="tag">${esc(w.pos)}</span>`;
  const fbHead = ok => `<div class="fb-head">${ok ? '◯ 正解' : '✕ 不正解'}</div>`;
  const nextBtn = () => `<button class="btn primary block next" data-act="next">${session.i + 1 >= session.items.length ? '結果を見る' : '次へ'}</button>`;
  const wordFeedback = (w, ok) => `
    <div class="fb ${ok ? 'ok' : 'ng'}" role="status">
      ${fbHead(ok)}
      <div class="fb-word"><span class="en">${esc(w.w)}</span>${spk(w.w)}${posTag(w)}<span>${esc(w.ja)}</span></div>
      <div class="fb-sent"><span>${esc(w.ex)}</span>${spk(w.ex)}</div>
      <div class="fb-ja">${esc(w.exJa)}</div>
    </div>${nextBtn()}`;
  const grammarFeedback = (q, ok) => `
    <div class="fb ${ok ? 'ok' : 'ng'}" role="status">
      ${fbHead(ok)}
      <div class="fb-sent"><span>${q.t === 'c' ? esc(q.q).replace('( )', `<span class="fill">${esc(q.c[q.a])}</span>`) : esc(fullSentence(q))}</span>${spk(fullSentence(q))}</div>
      <div class="fb-ja">${esc(q.ja)}</div>
      <div class="fb-ex">${esc(q.ex)}</div>
    </div>${nextBtn()}`;

  function qChoiceWord(it, cur) {
    const w = it.w, enja = it.kind === 'en-ja';
    return `
    <section class="card q">
      ${enja ? `<div class="q-word">${esc(w.w)}${spk(w.w)}</div>` : `<div class="q-ja">${esc(w.ja)}</div>`}
      <div class="q-sub">${posTag(w)} ${enja ? '意味を選ぼう' : '英単語を選ぼう'}</div>
    </section>
    <div class="opts">
      ${cur.opts.map((o, i) => {
        let cls = 'opt' + (enja ? '' : ' en-opt');
        if (cur.done) { if (o === w) cls += ' is-right'; else if (i === cur.picked) cls += ' is-wrong'; }
        return `<button class="${cls}" data-act="pick" data-i="${i}" ${cur.done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(enja ? o.ja : o.w)}</span></button>`;
      }).join('')}
    </div>
    ${cur.done ? wordFeedback(w, cur.ok) : ''}`;
  }

  function qSpell(it, cur) {
    const w = it.w;
    return `
    <section class="card q">
      <div class="q-ja">${esc(w.ja)}</div>
      <div class="q-sub">${posTag(w)} 英単語を入力しよう（${w.w.length}文字・${esc(w.w[0])} で始まる）</div>
    </section>
    <form class="spell-form" data-form="spell">
      <input class="spell-in${cur.done ? (cur.ok ? ' is-right' : ' is-wrong') : ''}" id="spell" type="text" inputmode="latin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="英単語を入力" value="${esc(cur.value)}" ${cur.done ? 'disabled' : ''}>
      ${cur.done ? '' : '<div class="btn-row"><button type="button" class="btn" data-act="giveup">わからない</button><button type="submit" class="btn primary">答え合わせ</button></div>'}
    </form>
    ${cur.done ? wordFeedback(w, cur.ok) : ''}`;
  }

  function qCard(it, cur) {
    const w = it.w;
    return `
    <button class="flip" data-act="flip" aria-label="${cur.flipped ? 'カード（意味を表示中）' : 'カードをめくる'}">
      <div>
        <div class="q-word">${esc(w.w)}</div>
        ${cur.flipped
          ? `<div class="back-ja">${posTag(w)} ${esc(w.ja)}</div><div class="back-ex"><span class="en">${esc(w.ex)}</span><br><span class="fb-ja">${esc(w.exJa)}</span></div>`
          : '<div class="hint">意味を思い浮かべてからタップ</div>'}
      </div>
    </button>
    ${cur.flipped
      ? '<div class="know"><button class="btn" data-act="know" data-ok="0">✕ まだ</button><button class="btn primary" data-act="know" data-ok="1">◯ 覚えた</button></div>'
      : `<div class="know"><span></span>${spk(w.w) ? `<button class="btn" data-act="speak" data-text="${esc(w.w)}">発音を聞く</button>` : ''}</div>`}`;
  }

  function qGrammarChoice(it, cur) {
    const q = it.q;
    const isEn = c => /^[\x20-\x7e]+$/.test(c);
    return `
    <section class="card q">
      <div class="q-tag"><span class="tag accent">${esc(q.unit.title)}</span></div>
      <div class="q-sent">${esc(q.q).replace('( )', '<span class="blank" role="img" aria-label="空所"></span>')}</div>
      <div class="q-sub" style="text-align:left">空所に入る最も適切なものを選ぼう</div>
    </section>
    <div class="opts">
      ${cur.order.map((ci, i) => {
        let cls = 'opt' + (isEn(q.c[ci]) ? ' en-opt' : '');
        if (cur.done) { if (ci === q.a) cls += ' is-right'; else if (i === cur.picked) cls += ' is-wrong'; }
        return `<button class="${cls}" data-act="pick" data-i="${i}" ${cur.done ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(q.c[ci])}</span></button>`;
      }).join('')}
    </div>
    ${cur.done ? grammarFeedback(q, cur.ok) : ''}`;
  }

  function qGrammarOrder(it, cur) {
    const q = it.q, full = cur.placed.length === q.w.length;
    return `
    <section class="card q">
      <div class="q-tag"><span class="tag accent">${esc(q.unit.title)}</span></div>
      <div class="q-ja">${esc(q.ja)}</div>
      <div class="q-sub">語句をタップして、正しい順に並べよう</div>
    </section>
    <div class="o-answer${cur.done ? (cur.ok ? ' is-right' : ' is-wrong') : ''}" aria-label="あなたの解答">
      ${cur.placed.length ? cur.placed.map((wi, i) => `<button class="tok" data-act="unplace" data-i="${i}" ${cur.done ? 'disabled' : ''}>${esc(q.w[wi])}</button>`).join('') : '<span class="ph">ここに英文を組み立てます</span>'}
      ${full ? `<span class="o-end">${esc(q.end || '.')}</span>` : ''}
    </div>
    ${cur.done ? '' : `<div class="o-pool">${cur.pool.map(wi => `<button class="tok${cur.placed.includes(wi) ? ' used' : ''}" data-act="place" data-i="${wi}" ${cur.placed.includes(wi) ? 'disabled aria-hidden="true"' : ''}>${esc(q.w[wi])}</button>`).join('')}</div>
    <button class="btn primary block next" data-act="check" ${full ? '' : 'disabled'}>答え合わせ</button>`}
    ${cur.done ? grammarFeedback(q, cur.ok) : ''}`;
  }

  function viewResult() {
    const s = session, n = s.res.length, ok = s.res.filter(r => r.ok).length, p = pct(ok, n);
    const msg = p === 100 ? '全問正解！すばらしい' : p >= 80 ? 'よくできました' : p >= 50 ? 'あと少し。間違えた問題を見直そう' : '復習してもう一度挑戦しよう';
    const wrong = n - ok;
    return `
    <section class="card result">
      <div class="ring" style="--p:${p}" role="img" aria-label="${n}問中${ok}問正解"><div><span><b>${ok}</b><small>/ ${n} 問正解</small></span></div></div>
      <h1>${msg}</h1>
      <p class="muted small">${esc(s.title)}</p>
    </section>
    <div class="btn-row" style="margin-top:14px">
      ${wrong ? `<button class="btn primary" data-act="retry">間違えた ${wrong} 問をもう一度</button>` : ''}
      <button class="btn${wrong ? '' : ' primary'}" data-act="again">続けて学習する</button>
      <a class="btn" href="${s.back}">戻る</a>
    </div>
    <h2 class="sec-title">今回の問題</h2>
    <ul class="r-list">
      ${s.res.map(r => `<li><span class="r-mark ${r.ok ? 'ok' : 'ng'}" aria-label="${r.ok ? '正解' : '不正解'}">${r.ok ? '◯' : '✕'}</span><div>${
        r.item.kind === 'gq'
          ? `<span class="en">${esc(fullSentence(r.item.q))}</span><span class="ja">${esc(r.item.q.ja)}</span>`
          : `<span class="en"><b>${esc(r.item.w.w)}</b></span><span class="ja">${esc(r.item.w.ja)}</span>`
      }</div></li>`).join('')}
    </ul>`;
  }

  function viewSession() {
    const s = session;
    if (s.i >= s.items.length) return viewResult();
    const it = s.items[s.i];
    if (!s.cur) s.cur = prepare(it);
    const body = it.kind === 'spell' ? qSpell(it, s.cur)
      : it.kind === 'card' ? qCard(it, s.cur)
      : it.kind === 'gq' ? (it.q.t === 'c' ? qGrammarChoice(it, s.cur) : qGrammarOrder(it, s.cur))
      : qChoiceWord(it, s.cur);
    return `
    <div class="s-head">
      <button class="icon-btn" data-act="quit" aria-label="学習を中断して戻る">✕</button>
      <div class="s-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${s.items.length}" aria-valuenow="${s.i}"><i style="width:${(s.i / s.items.length) * 100}%"></i></div>
      <span class="s-count">${s.i + 1} / ${s.items.length}</span>
    </div>
    ${body}`;
  }

  /* ================= Router / render ================= */
  const app = $('#app');
  let lastRoute = null;
  const parts = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);

  function render() {
    const p = parts();
    let tab = p[0] || 'home', html;
    if (tab === 'session' && !session) { location.replace('#/'); return; }
    if (tab === 'vocab') html = p[2] === 'list' ? viewList(p[1]) : p[1] ? viewLevel(p[1]) : viewVocab();
    else if (tab === 'grammar') html = p[1] ? viewUnit(p[1]) : viewGrammar();
    else if (tab === 'review') html = viewReview();
    else if (tab === 'settings') html = viewSettings();
    else if (tab === 'session') html = viewSession();
    else { tab = 'home'; html = viewHome(); }

    app.innerHTML = html;
    document.body.classList.toggle('in-session', tab === 'session' && sessionActive());
    document.querySelectorAll('#nav a').forEach(a => {
      const on = a.dataset.tab === tab;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    const route = location.hash;
    if (route !== lastRoute) { window.scrollTo(0, 0); lastRoute = route; }
    if (tab === 'session' && sessionActive()) {
      const cur = session.cur;
      const target = cur.done ? $('.next', app) : $('#spell', app);
      if (target) target.focus({ preventScroll: !cur.done });
      if (cur.done && target) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  const applyTheme = () => {
    const t = S.settings.theme;
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  };

  /* ================= Actions ================= */
  const actions = {
    start: d => vocabSession(d.level, d.mode),
    gstart: d => grammarSession(d.unit),
    review: d => reviewSession(d.kind),
    speak: d => speak(d.text),

    pick(d) {
      const cur = session && session.cur;
      if (!cur || cur.done) return;
      const i = Number(d.i), it = session.items[session.i];
      let ok;
      if (cur.opts) { if (!cur.opts[i]) return; ok = cur.opts[i] === it.w; }
      else if (cur.order) { if (cur.order[i] === undefined) return; ok = cur.order[i] === it.q.a; }
      else return;
      cur.picked = i;
      finish(ok);
      render();
    },
    giveup() {
      const cur = session && session.cur;
      if (!cur || cur.done) return;
      cur.value = ($('#spell') || {}).value || '';
      finish(false);
      render();
    },
    flip() {
      const cur = session && session.cur;
      if (!cur || cur.flipped) return;
      cur.flipped = true;
      render();
      const b = $('[data-act="know"][data-ok="1"]');
      if (b) b.focus({ preventScroll: true });
    },
    know(d) {
      if (!session || !session.cur || session.cur.done) return;
      finish(d.ok === '1');
      actions.next();
    },
    place(d) {
      const cur = session && session.cur;
      if (!cur || cur.done || !cur.placed) return;
      const wi = Number(d.i);
      if (!cur.placed.includes(wi)) cur.placed.push(wi);
      render();
    },
    unplace(d) {
      const cur = session && session.cur;
      if (!cur || cur.done || !cur.placed) return;
      cur.placed.splice(Number(d.i), 1);
      render();
    },
    check() {
      const cur = session && session.cur;
      if (!cur || cur.done || !cur.placed) return;
      const q = session.items[session.i].q;
      if (cur.placed.length !== q.w.length) return;
      finish(cur.placed.map(i => q.w[i]).join(' ') === q.w.join(' '));
      render();
    },
    next() {
      if (!session || !session.cur || !session.cur.done) return;
      session.i++;
      session.cur = null;
      render();
      window.scrollTo(0, 0);
      autoSpeak();
    },
    quit() {
      if (!session) return;
      if (session.res.length && !window.confirm('学習を中断しますか？（ここまでの記録は保存されています）')) return;
      const back = session.back;
      session = null;
      location.hash = back;
    },
    retry() {
      if (!session) return;
      const items = session.res.filter(r => !r.ok).map(r => r.item);
      startSession({ title: session.title, back: session.back, items, remake: session.remake });
      autoSpeak();
    },
    again() {
      if (!session) return;
      const cfg = session.remake();
      if (cfg.items.length) { startSession(cfg); autoSpeak(); }
      else { const back = session.back; session = null; location.hash = back; }
    },
    filter(d) {
      listState.f = d.f;
      render();
    },
    set(d) {
      const v = d.v === 'true' ? true : d.v === 'false' ? false : /^\d+$/.test(d.v) ? Number(d.v) : d.v;
      S.settings[d.k] = v;
      save();
      applyTheme();
      render();
    },
    export() {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'study-english-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    import() { const f = $('#import-file'); if (f) f.click(); },
    reset() {
      if (!window.confirm('すべての学習記録を消去します。元に戻せません。よろしいですか？')) return;
      const keep = S.settings;
      S = defaults();
      S.settings = keep;
      save();
      render();
    }
  };

  /* ================= Events ================= */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.act];
    if (!fn) return;
    const wasSession = sessionActive() || location.hash === '#/session';
    fn(el.dataset, el);
    // セッション開始直後に最初の単語を読み上げる
    if (!wasSession && sessionActive()) autoSpeak();
  });

  document.addEventListener('submit', e => {
    if (e.target.dataset.form !== 'spell') return;
    e.preventDefault();
    const cur = session && session.cur;
    if (!cur || cur.done) return;
    const input = $('#spell');
    const v = input.value.trim();
    if (!v) { input.focus(); return; }
    cur.value = v;
    finish(v.toLowerCase() === session.items[session.i].w.w.toLowerCase());
    render();
  });

  document.addEventListener('input', e => {
    if (e.target.id !== 'wl-q') return;
    listState.q = e.target.value;
    const wl = $('#wl');
    if (wl && listState.lv) wl.innerHTML = listRows(listState.lv);
  });

  document.addEventListener('change', e => {
    if (e.target.id !== 'import-file' || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const o = JSON.parse(reader.result);
        if (!o || o.v !== 1 || typeof o.words !== 'object') throw new Error('format');
        S = merge(o);
        save();
        applyTheme();
        render();
        window.alert('学習データを読み込みました。');
      } catch (err) {
        window.alert('読み込めませんでした。このアプリで書き出したファイルを選んでください。');
      }
    };
    reader.readAsText(e.target.files[0]);
  });

  // 4択は数字キー 1〜4 でも答えられる
  document.addEventListener('keydown', e => {
    if (!sessionActive() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (/^[1-4]$/.test(e.key)) actions.pick({ i: String(Number(e.key) - 1) });
  });

  window.addEventListener('hashchange', render);

  applyTheme();
  render();
})();
