import React from "react";

const Header: React.FC<{ parts: { name: string; exerciseCount: number }[] }> = ({ parts }) => {
	return (
		<>
			<p>
				Number of exercises{" "}
				{parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
			</p>
		</>
	);
};

export default Header;
