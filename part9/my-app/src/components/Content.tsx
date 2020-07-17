import React from "react";
import Part from "./Part";
import { CoursePart } from "../index";

const Content: React.FC<{ parts: CoursePart[] }> = ({ parts }) => {
	return (
		<>
			{parts.map(part => <Part key={part.name} part={part} ></Part>)}
		</>
	);
};

export default Content;
