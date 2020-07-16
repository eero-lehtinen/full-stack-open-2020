import express from 'express';
import patientService from '../services/patientService';
import { toNewPatientEntry } from '../utils';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientService.getSafeEntries());
});

router.post('/', (req, res) => {
	try {
		const newPatientEntry = toNewPatientEntry({ ...req.body, id: uuidv4() });
		patientService.addEntry(newPatientEntry);
		delete newPatientEntry.ssn;
		res.json(newPatientEntry);
	}
	catch (e) {
		if (e instanceof Error)
			res.status(400).send(e.message);
	}
});

export default router;
