import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import {resolve} from 'node:path';
const req=createRequire(import.meta.url);
/** Prefer project tooling, then an explicitly selected or bundled Codex runtime. */
export function runtimePackage(name){
 try{return req.resolve(name);}catch{ /* Try the next existing runtime. */ }
 const roots=[process.env.SVG_RUNTIME_MODULES,resolve(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')].filter(Boolean);
 for(const directory of roots)try{return req.resolve(resolve(directory,name));}catch{ /* Try the next existing runtime. */ }
 throw Error(`Rendering tool ${name} is unavailable. Set SVG_RUNTIME_MODULES to an existing node_modules directory containing @viz-js/viz, playwright and sharp. Serving the checked-in SVGs needs no rendering tools.`);
}
