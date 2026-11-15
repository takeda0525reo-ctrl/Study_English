#!/usr/bin/env node
/*
 * 単語・文法データの整合性チェック。データを追加・編集したら実行する。
 *   node tools/validate.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['js/data/words.js', 'js/data/grammar.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
}
const { WORD_DATA, GRAMMAR_DATA } = sandbox.window;

const errors = [];
const err = m => errors.push(m);
const POS = new Set(['動', '名', '形', '副', '接', '前', '代']);

/* ---- 単語 ---- */
const seen = new Map();
let wordTotal = 0;
for (const [lv, raw] of Object.entries(WORD_DATA)) {
  const lines = raw.split('\n').map(s => s.trim()).filter(Boolean);
  console.log(`単語 ${lv}: ${lines.length} 語`);
  wordTotal += lines.length;
  lines.forEach((line, i) => {
    const p = line.split('|');
    const at = `${lv} ${i + 1}行目 (${p[0]})`;
    if (p.length !== 5) return err(`${at}: 項目数が ${p.length} 個（5個必要）`);
    if (p.some(x => !x.trim())) err(`${at}: 空の項目がある`);
    if (!POS.has(p[1])) err(`${at}: 品詞「${p[1]}」が不正`);
    if (seen.has(p[0])) err(`${at}: 単語が重複（${seen.get(p[0])} にもある）`);
    seen.set(p[0], lv);
    const stem = p[0].toLowerCase().slice(0, 3); // 活用形（overcame, denied など）でも一致するよう語頭だけ比べる
    if (!p[3].toLowerCase().includes(stem)) err(`${at}: 例文に単語が含まれていない`);
  });
  // 4択の誤答を3つ作れるだけの語数があるか
  if (lines.length < 4) err(`${lv}: 語数が少なすぎる（4語以上必要）`);
}

/* ---- 文法 ---- */
const ids = new Set();
let qTotal = 0;
GRAMMAR_DATA.forEach(u => {
  const at = `文法 ${u.id}`;
  if (ids.has(u.id)) err(`${at}: 単元IDが重複`);
  ids.add(u.id);
  for (const k of ['id', 'title', 'level', 'summary']) if (!u[k]) err(`${at}: ${k} がない`);
  if (!['基礎', '標準', '発展'].includes(u.level)) err(`${at}: level「${u.level}」が不正`);
  if (!Array.isArray(u.points) || !u.points.length) err(`${at}: 解説がない`);
  (u.points || []).forEach((p, i) => {
    if (!p.h || !p.d || !Array.isArray(p.ex) || !p.ex.length) err(`${at} 解説${i + 1}: h / d / ex が不足`);
    (p.ex || []).forEach(e => { if (!Array.isArray(e) || e.length !== 2) err(`${at} 解説${i + 1}: 例文は [英文, 和訳] の形にする`); });
  });
  (u.qs || []).forEach((q, i) => {
    const qa = `${at} 問${i + 1}`;
    qTotal++;
    if (!q.ja || !q.ex) err(`${qa}: ja / ex がない`);
    if (q.t === 'c') {
      if (!q.q || (q.q.match(/\( \)/g) || []).length !== 1) err(`${qa}: 空所 ( ) がちょうど1つ必要`);
      if (!Array.isArray(q.c) || q.c.length !== 4) err(`${qa}: 選択肢は4つ必要`);
      else if (new Set(q.c).size !== 4) err(`${qa}: 選択肢が重複`);
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) err(`${qa}: 正解番号 a が不正`);
    } else if (q.t === 'o') {
      if (!Array.isArray(q.w) || q.w.length < 3) err(`${qa}: 並べ替えの語句が少なすぎる`);
      else if (q.w.some(x => !x || x !== x.trim())) err(`${qa}: 語句に空白や空文字がある`);
    } else err(`${qa}: t は "c" か "o"`);
  });
  console.log(`文法 ${u.id}（${u.title}）: 解説 ${u.points.length} 項目 / ${u.qs.length} 問`);
});

console.log(`\n合計: 単語 ${wordTotal} 語 / 文法 ${GRAMMAR_DATA.length} 単元 ${qTotal} 問`);
if (errors.length) {
  console.error(`\n✕ ${errors.length} 件の問題:\n` + errors.map(e => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('◯ 問題なし');
