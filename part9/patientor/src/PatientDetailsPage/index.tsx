import React from "react";
import axios from "axios";
import { Container, List, Icon, Button, Divider } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { Patient, Gender, Diagnosis, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient, setDiagnosisList, addEntry } from "../state";
import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientDetailsPage: React.FC = () => {
	const [{ patients, diagnoses }, dispatch] = useStateValue();
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | undefined>();

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
	};

	const openModal = () => setModalOpen(true);

	const closeModal = () => {
		setModalOpen(false);
		setError(undefined);
	};

	const submitEntry = async (values: EntryFormValues) => {
		try {
			const { data: newEntry } = await axios.post<Entry>(
				`${apiBaseUrl}/patients/${id}/entries`,
				values
			);
			dispatch(addEntry(patient, newEntry));
			closeModal();
		} catch (e) {
			console.error(e.response.data);
			setError(e.response.data.error);
		}
	};


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
					<List celled>
						{patient.entries.map(entry => (
							<EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
						))}
					</List>
				</Container>
			}
			<Divider hidden />
			<AddEntryModal
				modalOpen={modalOpen}
				error={error}
				onSubmit={submitEntry}
				onClose={closeModal}
				patient={patient}
			/>
			<Button onClick={() => openModal()}>Add New Entry</Button>
		</div>
	);
};

export default PatientDetailsPage;
