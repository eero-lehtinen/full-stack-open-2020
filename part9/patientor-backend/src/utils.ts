import { PatientEntry, Gender } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any, 
	@typescript-eslint/no-unsafe-member-access, 
	@typescript-eslint/explicit-module-boundary-types */

export const toNewPatientEntry = (data: any): PatientEntry => {
	return {
		id: parseId(data.id),
		name: parseString(data.name, 'name'),
		dateOfBirth: parseDate(data.dateOfBirth),
		ssn: parseString(data.ssn, 'ssn'),
		gender: parseGender(data.gender),
		occupation: parseString(data.occupation, 'occupation')
	};
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