import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const IN = process.argv[2];
const OUT = process.argv[3];

const doc = await io.read(IN);
const root = doc.getRoot();
const scene = root.listScenes()[0];

function collectQuestNodes(node, acc) {
  const mesh = node.getMesh();
  if (mesh && /^Object/.test(mesh.getName())) acc.push(node);
  for (const child of node.listChildren()) collectQuestNodes(child, acc);
}
const toRemove = [];
for (const node of scene.listChildren()) collectQuestNodes(node, toRemove);
console.log('Removing', toRemove.length, 'Quest nodes from robot doc');
for (const node of toRemove) {
  const mesh = node.getMesh();
  node.dispose();
  if (mesh && mesh.listParents().filter(p => p.propertyType === 'Node').length === 0) {
    mesh.dispose();
  }
}

await io.write(OUT, doc);
console.log('Wrote', OUT);
