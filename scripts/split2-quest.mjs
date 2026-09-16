import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const IN = process.argv[2];
const OUT = process.argv[3];
const S = 1289.231490007027;
const T = [29.811578070383018, -302.3608243966347, -304.0911838925574];

const doc = await io.read(IN);
const root = doc.getRoot();
const scene = root.listScenes()[0];
const questNode = scene.listChildren().find(n => n.getName() === 'Quest3HMD');
if (!questNode) throw new Error('Quest3HMD not found');

// detach from scene, wrap in a parent with the placement transform
scene.removeChild(questNode);
const parent = doc.createNode('Quest3_placed').setTranslation(T).setScale([S, S, S]);
parent.addChild(questNode);
scene.addChild(parent);

await io.write(OUT, doc);
console.log('Wrote', OUT);
