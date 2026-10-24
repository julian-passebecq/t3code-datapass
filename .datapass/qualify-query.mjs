import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseKnowledgeBundle, buildReviewPack, mergeKnowledgeBundles } from '../apps/web/src/datapass/bundle.ts';
const agent = path.resolve('../datapass-agent');
const nativeDir = await fs.readFile(path.join(agent, '.datapass/latest-bundle.txt'), 'utf8');
const native = parseKnowledgeBundle(JSON.parse(await fs.readFile(path.join(nativeDir, 'cockpit.json'), 'utf8')));
const mongoRoot = path.join(agent, '.datapass/mongo-exports');
const mongoDirs = (await fs.readdir(mongoRoot)).sort();
const mongo = parseKnowledgeBundle(JSON.parse(await fs.readFile(path.join(mongoRoot, mongoDirs.at(-1), 'cockpit.json'), 'utf8')));
const sessions = mergeKnowledgeBundles([native, mongo]);
const pack = buildReviewPack(sessions);
await fs.writeFile('.datapass/real-review-pack.json', pack);
const fallback = JSON.parse(execFileSync(process.execPath, ['scripts/datapass-search.mjs', '--bundle', nativeDir, '--query', 'architecture', '--limit', '3'], { encoding: 'utf8', windowsHide: true }));
const leviathanExe = 'C:/Users/julia/AppData/Local/Temp/datapass-brain-leviathan-v0.1.0/leviathan-v0.1.0-x86_64-pc-windows-msvc/leviathan.exe';
const lexical = JSON.parse(execFileSync(leviathanExe, ['search', 'architecture', '--index', path.join(agent, '.datapass/leviathan.db'), '--limit', '3', '--json'], { encoding: 'utf8', windowsHide: true }));
console.log(JSON.stringify({ importedSources: sessions.length, packCharacters: pack.length, packSources: JSON.parse(pack).sources.length,
  fallbackScanned: fallback.scanned, fallbackHits: fallback.results.length, leviathanHits: lexical.results.length, leviathanMatches: lexical.total_matches,
  mongoRecords: mongo.sessions.reduce((sum, session) => sum + session.records, 0) }));
