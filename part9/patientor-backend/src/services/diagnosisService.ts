import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => {
	return diagnoses;
};

const addEntry = (): undefined => {
	return undefined;
};

export default {
	getEntries,
	addEntry
};
