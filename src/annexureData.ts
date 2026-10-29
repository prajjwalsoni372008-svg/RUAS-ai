import poPsoRaw from '../config/po_pso.json';
import { AnnexureAData } from './types';

export const annexureData: AnnexureAData = poPsoRaw as AnnexureAData;

export function getPO(code: string) {
  return annexureData.programOutcomes.find(p => p.code === code);
}

export function getPSO(code: string) {
  return annexureData.programSpecificOutcomes.find(p => p.code === code);
}

export function getBloomsLevel(level: string) {
  return annexureData.bloomsLevels.find(b => b.level === level);
}
