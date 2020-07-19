import patients from '../../data/patients';
import { Patient, PublicPatient, Entry } from '../types';

const getPatients = (): Patient[] => {
	return patients;
};

const getPublicPatients = (): PublicPatient[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) =>
		({ id, name, dateOfBirth, gender, occupation }));
};

const getPatient = (id: string): Patient | undefined => {
	return patients.find(patient => patient.id === id);
};

const addPatient = (patient: Patient): Patient => {
	patients.push(patient);
	return patient;
};

const addEntry = (patientId: string, entry: Entry): Patient | undefined => {
	const patient = patients.find(patient => patient.id === patientId);
	if (!patient) {
		return undefined;
	}
	patient.entries.push(entry);
	patients.map(p => p.id === patientId ? patient : p);
	return patient;
};

export default {
	getPatients,
	getPublicPatients,
	addPatient,
	getPatient,
	addEntry
};
