import React from "react";
import { CoursePart, assertNever } from "../index";

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {

	const getPartSpecificSt ring = (part: CoursePart) => {
		switch (part.name) {
			case "Fundamentals":
			case "Name four":
				return "";
			case "Using props to pass data":
				return `, group projects: ${part.groupProjectCount}`;
			case "Deeper type usage":
				return `, submission link: ${part.exerciseSubmissionLink}`;
			default:
				assertNever(part);
				break;
		}
	};

	return (
		<>
			<p>{part.name} {part.exerciseCount}{getPartSpecificString(part)}</p>
		</>
	);
};


export default Part;
