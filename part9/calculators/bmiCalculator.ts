
const calculateBmi = (heightCm: number, weightKg: number): string => {
	const bmi: number = (weightKg / heightCm / heightCm) * 10000;

	if (bmi < 18.5) return 'Underweight';
	if (bmi >= 18.5 && bmi < 25) return 'Normal (healty weight)';
	if (bmi >= 25 && bmi < 30) return 'Overweight';
	else return 'Obese';
};


interface BmiArgs {
	heightCm: number,
	weightKg: number
}

export const parseBmiArgs = (args: Array<string>): BmiArgs => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');

	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			heightCm: Number(args[2]),
			weightKg: Number(args[3])
		};
	} else {
		throw new Error('Provided values were not numbers!');
	}
};

if (require.main === module) {
	try {
		const { heightCm, weightKg } = parseBmiArgs(process.argv);
		console.log(calculateBmi(heightCm, weightKg));
	} catch (e) {
		if (e instanceof Error)
			console.error('Error:', e.message);
	}
}

export default calculateBmi;



