import materials from './materials.mjs';
// Compatibility assets remain readable even though current pages use the material paths.
const mapping=[['visuals/course/TD-AG-00.svg','materials/agent-architecture-system/visuals/AG-DIM-ARCHITECTURE.svg','TD-AG-00-compat'],['visuals/course/TD-T26.svg','materials/career-evolution/visuals/career-evidence-lifecycle.svg','TD-T26-compat']];
export default mapping.map(([path,source,id])=>{const spec=materials.find(s=>s.path===source);if(!spec)throw Error(`Missing alias source ${source}`);return {...spec,id,path,aliasOf:source};});
