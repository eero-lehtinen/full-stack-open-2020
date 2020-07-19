import React from "react";
import { List, Header } from "semantic-ui-react";

import { Entry, Diagnosis } from "../types";

const EntryDetails: React.FC<{ entry: Entry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {

	const assertNever = (value: never): never => {
		throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
	};

	const getTypeSpecificDetails = () => {
		switch (entry.type) {
			case "HealthCheck":
				return <>Health check rating: {entry.healthCheckRating}</>;
			case "Hospital":
				return <>discharge: date {entry.discharge.date}, criteria: {entry.discharge.criteria}</>;
			case "OccupationalHealthcare":
				return <>employer: {entry.employerName}{
					entry.sickLeave && <><br />sickleave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</>}</>;
			default:
				return assertNever(entry);
		}
	}

	return (
		<List.Item>
			<div>
				<Header as="h5">{entry.type}</Header>
				{entry.date} <br />
				{entry.description}<br />
				{getTypeSpecificDetails()}
				<List bulleted>
					{entry.diagnosisCodes && entry.diagnosisCodes.map(code =>
						<List.Item key={code}>
							{code} {diagnoses[code].name}
						</List.Item>)
					}
				</List>
			</div>
		</List.Item>
	);
};

export default EntryDetails;
