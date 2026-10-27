import {pages} from '../../content/course.ts';
/** Distinguish actual image consumers from supplementary topic references. */
export function bindSpec(spec){
 const primary=pages.filter(p=>p.architecture?.visual?.src.split('?')[0]===spec.path);
 const sourceRefs=[...spec.sourceRefs];
 if(spec.path.startsWith('materials/'))for(const page of primary)sourceRefs.push({path:'docs/svg-redesign-2026-10-26/body-sources/material-pages.json',locator:page.id+' / summary',quote:page.summary});
 return {...spec,primaryPageIds:primary.map(p=>p.id),pageIds:[...new Set([...primary.map(p=>p.id),...spec.pageIds])],sourceRefs};
}
