import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { mergeDocuments } from '@gltf-transform/functions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);

const INVENTOR_GLB = process.argv[2];
const QUEST_GLB = process.argv[3];
const OUT = process.argv[4];

const S = 1289.231490007027;
const T = [29.811578070383018, -302.3608243966347, -304.0911838925574];

// 1) Load robot glb, strip Object* (Quest) nodes/meshes
const robotDoc = await io.read(INVENTOR_GLB);
const robotRoot = robotDoc.getRoot();
const scene = robotRoot.listScenes()[0];

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

// 2) Load Quest3.glb (clean, textured)
const questDoc = await io.read(QUEST_GLB);

// 3) Merge questDoc into robotDoc
mergeDocuments(robotDoc, questDoc);
const robotRoot2 = robotDoc.getRoot();

// find the merged Quest3HMD node (now part of robotDoc)
let questNode = null;
for (const scn of robotRoot2.listScenes()) {
  for (const n of scn.listChildren()) {
    if (n.getName() === 'Quest3HMD') questNode = n;
  }
}
if (!questNode) throw new Error('Quest3HMD node not found after merge');

// 4) Create parent node with computed transform, reparent questNode under it, attach to main scene
const mainScene = robotRoot2.listScenes()[0];
const parent = robotDoc.createNode('Quest3_placed')
  .setTranslation(T)
  .setScale([S, S, S]);
mainScene.addChild(parent);
parent.addChild(questNode);

// remove the (now empty) scene that questDoc contributed, if any, and detach questNode from old scene
for (const scn of robotRoot2.listScenes()) {
  if (scn !== mainScene) {
    scn.dispose();
  }
}

await io.write(OUT, robotDoc);
console.log('Wrote', OUT);
