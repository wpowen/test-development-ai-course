import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export const projectRoot=fileURLToPath(new URL('../../',import.meta.url));
export const candidateRoot=resolve(projectRoot,process.env.SVG_CANDIDATE_ROOT||'output/svg-release-20261026/candidate');
export const assetRoot=resolve(candidateRoot,'public');
export const reviewRoot=resolve(projectRoot,'docs/svg-redesign-2026-10-26/release-review');
