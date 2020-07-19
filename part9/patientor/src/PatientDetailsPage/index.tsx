import React from "react";
import axios from "axios";
import { Container, List, Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";

import { Patient, Gender, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient, setDiagnosisList } from "../state";

import EntryDetails from "./EntryDetails"

const PatientDetailsPage: React.FC = () => {
	const [{ patients, diagnoses }, dispatch] = useStateValue();

	const fetchPatientData = async () => {
		try {
			const { data: patientResult } = await axios.get<Patient>(
				`${apiBaseUrl}/patients/${id}`
			);
			dispatch(addPatient(patientResult));
		} catch (e) {
			console.error(e);
		}
	};

	const fetchDiagnosisData = async () => {
		try {
			const { data: diagnosisList } = await axios.get<Diagnosis[]>(
				`${apiBaseUrl}/diagnoses`
			);
			dispatch(setDiagnosisList(diagnosisList));
		} catch (e) {
			console.error(e);
		}
	};

	const { id } = useParams<{ id: string }>();
	const patient = patients[id];
	if (!patient || !patient.ssn || Object.keys(diagnoses).length === 0) {
		// User might not have gone to the front page, so try to fetch still
		fetchPatientData();
		fetchDiagnosisData();
		return (<div>fetching patient details...</div>);
	}


	const getGenderIconName = (gender: Gender) => {
		switch (gender) {
			case Gender.Male: return "mars";
			case Gender.Female: return "venus";
			case Gender.Other: return "genderless";
		}
	}

	return (
		<div className="App">
			<Container>
				<h3>{patient.name} <Icon name={getGenderIconName(patient.gender)} /></h3>
			</Container>
			<List>
				<List.Item>
					ssn: {patient.ssn}
				</List.Item>
				<List.Item>
					occupation: {patient.occupation}
				</List.Item>
				<List.Item>
					date of birth: {patient.dateOfBirth}
				</List.Item>
			</List>
			{patient.entries.length > 0 &&
				<Container>
					<h4>entries</h4>
					<List divided>
						{patient.entries.map(entry => (
							<EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
						))}
					</List>
				</Container>
			}
		</div>
	);
};

export default PatientDetailsPage;
