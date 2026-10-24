import fs from 'node:fs/promises';
const assetDir = 'apps/web/dist/assets';
const names = (await fs.readdir(assetDir)).filter(name => name.startsWith('_chat.datapass-') && name.endsWith('.map'));
const files = ['components/datapass/DataPassCockpit.tsx', 'datapass/bundle.ts', 'datapass/store.ts'];
const found = new Map();
for (const name of names) {
  const map = JSON.parse(await fs.readFile(`${assetDir}/${name}`, 'utf8'));
  for (const file of files) {
    const index = map.sources.findIndex(source => source.replaceAll('\\', '/').endsWith(file));
    if (index < 0) continue;
    const actual = (await fs.readFile(`apps/web/src/${file}`, 'utf8')).replaceAll('\r\n', '\n');
    found.set(file, map.sourcesContent[index].replaceAll('\r\n', '\n') === actual);
  }
}
console.log(JSON.stringify(Object.fromEntries(found)));
if (files.some(file => found.get(file) !== true)) process.exitCode = 1;
