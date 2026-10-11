import { describe, it, expect } from 'vitest';
import { filterProperties } from './property-search';
import type { Property } from './properties';
const samples = [
 {id:'ic1', zone:'salamanca',title:'Velázquez 28',address:'Madrid',reference:'IC-8105',description:'Recoletos'},
 {id:'ic2', zone:'almagro',title:'Españoleto 11',address:'Madrid',reference:'IC-8106',description:'Chamberí'},
 {id:'ic3', zone:'pozuelo',title:'Chalet Montealina',address:'Pozuelo de Alarcón',reference:'IC-2693',description:''}
] as Property[];
describe('Property discovery', () => {
 it('lists every property when filters are cleared',()=>expect(filterProperties(samples,null,'')).toHaveLength(3));
 it('includes children in capital but excludes residential suburbs',()=>expect(filterProperties(samples,'madrid-capital','').map(p=>p.id)).toEqual(['ic1','ic2']));
 it('matches a zone by its public name',()=>expect(filterProperties(samples,null,'Barrio de Salamanca').map(p=>p.id)).toEqual(['ic1']));
 it('matches accents, street numbers and mixed case',()=>expect(filterProperties(samples,null,' VELAZQUEZ 28 ').map(p=>p.id)).toEqual(['ic1']));
 it('matches compact references',()=>expect(filterProperties(samples,null,'IC8106').map(p=>p.id)).toEqual(['ic2']));
 it('combines text and zone without leaking other zones',()=>expect(filterProperties(samples,'salamanca','Chamberi')).toHaveLength(0));
 it('returns no false positives for an empty zone',()=>expect(filterProperties(samples,'jeronimos','')).toHaveLength(0));
 it('searches parent area names',()=>expect(filterProperties(samples,null,'areas residenciales').map(p=>p.id)).toEqual(['ic3']));
});
