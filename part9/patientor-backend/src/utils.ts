import {
	Patient, Gender, Entry, BaseEntry, HealthCheckRating,
	Discharge, SickLeave, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any, 
	@typescript-eslint/no-unsafe-member-access, 
	@typescript-eslint/explicit-module-boundary-types */

export const toNewPatient = (data: any): Patient => {
	return {
		id: parseId(data.id),
		name: parseString(data.name, 'name'),
		dateOfBirth: parseDate(data.dateOfBirth),
		ssn: parseString(data.ssn, 'ssn'),
		gender: parseGender(data.gender),
		occupation: parseString(data.occupation, 'occupation'),
		entries: parseEntries(data.entries)
	};
};

export const toNewEntry = (data: any): Entry => {
	return {
		...parseBaseEntryValues(data),
		...parseExtendedEntryValues(data)
	};
};

const parseBaseEntryValues = (data: any): BaseEntry => {
	return {
		id: parseId(data.id),
		description: parseString(data.description, 'description'),
		date: parseDate(data.date),
		specialist: parseString(data.specialist, 'specialist'),
		diagnosisCodes: parseOptStringArr(data.diagnosisCodes)
	};
};

const parseExtendedEntryValues = (data: any):
	Pick<HealthCheckEntry, 'type' | 'healthCheckRating'>
	| Pick<HospitalEntry, 'type' | 'discharge'>
	| Pick<OccupationalHealthcareEntry, 'type' | 'employerName'>
	| Pick<OccupationalHealthcareEntry, 'type' | 'employerName' | 'sickLeave'> => {
	if (!data.type) {
		throw new Error('Invalid or missing value: type');
	}
	switch (data.type) {
		case 'HealthCheck':
			return {
				type: 'HealthCheck',
				healthCheckRating: parseHealthCheckRating(data.healthCheckRating)
			};
		case 'Hospital':
			return {
				type: 'Hospital',
				discharge: parseDischarge(data.discharge)
			};
		case 'OccupationalHealthcare':
			if (data.sickLeave) {
				return {
					type: 'OccupationalHealthcare',
					employerName: parseString(data.employerName, 'employerName'),
					sickLeave: parseSickLeave(data.sickLeave)
				};
			}
			return {
				type: 'OccupationalHealthcare',
				employerName: parseString(data.employerName, 'employerName')
			};
		default:
			throw new Error('Invalid or missing value: type');
	}
};

const isString = (object: any): object is string => {
	return typeof object === 'string' || object instanceof String;
};

const isUUID = (object: any): boolean => {
	return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(object);
};

const isDate = (object: string): boolean => {
	return Boolean(Date.parse(object));
};

const isGender = (object: any): object is Gender => {
	return Object.values(Gender).includes(object);
};


const parseId = (object: any): string => {
	if (!object || !isString(object) || !isUUID(object)) {
		throw new Error('Invalid or missing value: id');
	}
	return object;
};

const parseString = (object: any, name: string): string => {
	if (!object || !isString(object)) {
		throw new Error('Invalid or missing value: ' + name);
	}
	return object;
};

const parseOptStringArr = (object: any): string[] | undefined => {
	if (!object || !Array.isArray(object) || object.some(a => !isString(a))) {
		return undefined;
	}
	return object as string[];
};

const parseDate = (object: any): string => {
	if (!object || !isString(object) || !isDate(object)) {
		throw new Error('Invalid or missing value: dateOfBirth');
	}
	return object;
};

const parseGender = (object: any): Gender => {
	if (!object || !isGender(object)) {
		throw new Error('Invalid or missing value: gender');
	}
	return object;
};


const parseEntries = (object: any): Entry[] => {
	if (!object) {
		return [];
	}
	return object as Entry[];
};

const parseHealthCheckRating = (object: any): HealthCheckRating => {
	if (!object || !Object.values(HealthCheckRating).includes(object)) {
		throw new Error('Invalid or missing value: healthCheckRating');
	}
	return object as HealthCheckRating;
};

const parseDischarge = (object: any): Discharge => {
	if (!object || !object.date || !object.criteria || !isDate(object.date) || !isString(object.criteria)) {
		throw new Error('Invalid or missing value: discharge');
	}
	return object as Discharge;
};

const parseSickLeave = (object: any): SickLeave => {
	if (!object || !object.startDate || !object.endDate || !isDate(object.startDate) || !isDate(object.endDate)) {
		throw new Error('Invalid or missing value: sickLeave');
	}
	return object as SickLeave;
};