import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientService.getPublicPatients());
});

router.get('/:id', (req, res) => {
	const entry = patientService.getPatient(req.params.id);
	if (!entry)
		res.status(404).send('Not found');
	else
		res.send(entry);
});

router.post('/', (req, res) => {
	try {
		const newPatient = toNewPatient({ ...req.body, id: uuidv4() });
		patientService.addPatient(newPatient);
		delete newPatient.ssn;
		res.json(newPatient);
	}
	catch (e) {
		if (e instanceof Error)
			res.status(400).send(e.message);
	}
});

router.post('/:id/entries', (req, res) => {
	try {
		const newEntry = toNewEntry({ ...req.body, id: uuidv4() });
		if (!patientService.addEntry(req.params.id, newEntry)) {
			throw new Error('Invalid id');
		}
		res.send(newEntry);
	}
	catch (e) {
		if (e instanceof Error)
			res.status(400).send(e.message);
	}
});

export default router;
