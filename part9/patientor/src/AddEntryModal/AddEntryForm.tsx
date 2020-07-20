import React from "react";
import { Grid, Button, Dropdown, Divider, Header } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, DiagnosisSelection, NumberField } from "../AddPatientModal/FormField";
import {
	HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, EntryTypes, HealthCheckRating
} from "../types";
import { useStateValue } from "../state";

export type EntryFormValues =
	| Omit<HospitalEntry, "id">
	| Omit<OccupationalHealthcareEntry, "id">
	| Omit<HealthCheckEntry, "id">;

interface Props {
	onSubmit: (values: EntryFormValues) => void;
	onCancel: () => void;
}

const baseEntryInitialValues = {
	description: "",
	date: "",
	specialist: "",
	diagnosisCodes: [] as string[]
};

const hospitalEntryInitialValues = {
	type: "Hospital" as "Hospital",
	discharge: {
		date: "",
		criteria: ""
	}
};

const occupationalHealthcareEntryInitialValues = {
	type: "OccupationalHealthcare" as "OccupationalHealthcare",
	employerName: "",
	sickLeave: {
		startDate: "",
		endDate: ""
	}
};

const healthCheckEntryInitialValues = {
	type: "HealthCheck" as "HealthCheck",
	healthCheckRating: HealthCheckRating.Healthy
};

const isDate = (object: string): boolean => {
	return Boolean(Date.parse(object));
};

const typeSelectOptions = Object.keys(EntryTypes).map(val => ({ value: val, text: val, key: val }));

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [currentType, setCurrentType] = React.useState<EntryTypes>(EntryTypes.Hospital);
	const [{ diagnoses }] = useStateValue();

	const validateBaseEntryValues = (values: EntryFormValues) => {
		const requiredError = "Field is required";
		const dateFormatError = "Invalid format, recommended date format is \"YYYY-MM-DD\"";
		const errors: { [field: string]: string | { [field: string]: string } } = {};
		if (!values.description)
			errors.description = requiredError;

		if (!values.date)
			errors.date = requiredError;
		else if (!isDate(values.date))
			errors.date = dateFormatError;

		if (!values.specialist)
			errors.specialist = requiredError;
		if (!values.diagnosisCodes || values.diagnosisCodes.length === 0)
			errors.diagnosisCodes = requiredError;

		values.type = currentType;
		switch (values.type) {
			case "Hospital":
				errors.discharge = {};

				if (!values.discharge.date)
					errors.discharge.date = requiredError;
				else if (!isDate(values.discharge.date))
					errors.discharge.date = dateFormatError;

				if (!values.discharge.criteria)
					errors.discharge.criteria = requiredError;

				if (Object.keys(errors.discharge).length === 0)
					delete errors.discharge;
				break;
			case "OccupationalHealthcare":
				if (!values.employerName)
					errors.employerName = requiredError;

				errors.sickLeave = {};

				if (values.sickLeave) {
					if (values.sickLeave.startDate && !isDate(values.sickLeave.startDate))
						errors.sickLeave.startDate = dateFormatError;

					if (values.sickLeave.endDate && !isDate(values.sickLeave.endDate))
						errors.sickLeave.endDate = dateFormatError;
				}

				if (Object.keys(errors.sickLeave).length === 0)
					delete errors.sickLeave;
				break;
			case "HealthCheck":
				if (!values.healthCheckRating)
					errors.healthCheckRating = requiredError;
				else if (values.healthCheckRating < 0 || values.healthCheckRating > 3)
					errors.healthCheckRating = "Number must be 0-3";
		}
		return errors;
	};

	const getInitialValues = (type: EntryTypes) => {
		switch (type) {
			case EntryTypes.Hospital:
				return { ...baseEntryInitialValues, ...hospitalEntryInitialValues };
			case EntryTypes.OccupationalHealthcare:
				return { ...baseEntryInitialValues, ...occupationalHealthcareEntryInitialValues };
			case EntryTypes.HealthCheck:
				return { ...baseEntryInitialValues, ...healthCheckEntryInitialValues };
		}
	};

	const initialValues = getInitialValues(currentType);

	return (
		<>
			<label><strong>Type</strong></label>
			<Dropdown
				defaultValue="Hospital" selection fluid
				onChange={(_e, data) => setCurrentType(data.value as EntryTypes)}
				options={typeSelectOptions}
			/>
			<Divider hidden />
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validate={validateBaseEntryValues}
			>
				{({ isValid, dirty, setFieldValue, setFieldTouched }) => {
					return (
						<Form className="form ui">
							<Field
								label="Date"
								placeholder="YYYY-MM-DD"
								name="date"
								component={TextField}
							/>
							<Field
								label="Description"
								placeholder="Description"
								name="description"
								component={TextField}
							/>
							<Field
								label="Specialist"
								placeholder="Specialist"
								name="specialist"
								component={TextField}
							/>
							<DiagnosisSelection
								diagnoses={Object.values(diagnoses)}
								setFieldTouched={setFieldTouched}
								setFieldValue={setFieldValue}
							/>
							{currentType === EntryTypes.Hospital &&
								<>
									<Header as="h4">Discharge</Header>
									<div style={{ "marginLeft": "20px" }}>
										<Field
											label="Date"
											placeholder="YYYY-MM-DD"
											name="discharge.date"
											component={TextField}
										/>
										<Field
											label="Criteria"
											placeholder="Criteria"
											name="discharge.criteria"
											component={TextField}
										/>
									</div>
								</>
							}
							{currentType === EntryTypes.OccupationalHealthcare &&
								<>
									<Field
										label="Employer name"
										placeholder="Employer name"
										name="employerName"
										component={TextField}
									/>
									<Header as="h4">Sick leave</Header>
									<div style={{ "marginLeft": "20px" }}>
										<Field
											label="Start date"
											placeholder="YYYY-MM-DD"
											name="sickLeave.startDate"
											component={TextField}
										/>
										<Field
											label="End date"
											placeholder="YYYY-MM-DD"
											name="sickLeave.endDate"
											component={TextField}
										/>
									</div>
								</>
							}
							{currentType === EntryTypes.HealthCheck &&
								<>
									<Field
										label="healthCheckRating"
										name="healthCheckRating"
										component={NumberField}
										min={0}
										max={3}
									/>
								</>
							}
							<Divider hidden />
							<Grid>
								<Grid.Column floated="left" width={5}>
									<Button type="button" onClick={onCancel} color="red">
										Cancel
                </Button>
								</Grid.Column>
								<Grid.Column floated="right" width={5}>
									<Button
										type="submit"
										floated="right"
										color="green"
										disabled={!dirty || !isValid}
									>
										Add
                </Button>
								</Grid.Column>
							</Grid>
						</Form>
					);
				}}
			</Formik>
		</>
	);
};

export default AddEntryForm;
