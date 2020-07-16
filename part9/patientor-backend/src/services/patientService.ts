import patientData from '../../data/patients.json';
import { PatientEntry } from '../types';
import { toNewPatientEntry } from '../utils';

const patients: PatientEntry[] = patientData.map(object => toNewPatientEntry(object));

const getEntries = (): PatientEntry[] => {
	return patients;
};

const getSafeEntries = (): Omit<PatientEntry, "ssn">[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) =>
		({ id, name, dateOfBirth, gender, occupation }));
};

const addEntry = (entry: PatientEntry): PatientEntry => {
	patients.push(entry);
	return entry;
};

export default {
	getEntries,
	getSafeEntries,
	addEntry
};
