interface Result {
	periodLength: number,
	trainingDays: number,
	average: number,
	success: boolean,
	rating: number,
	ratingDescription: string,
	target: number,
}

export const calculateExercises = (dailyHours: Array<number>, targetHours: number): Result => {
	const average = dailyHours.reduce((prev, curr) => prev + curr, 0) / dailyHours.length;
	let rating = 2;
	let ratingDescription = 'Hours deviate from target less that 0.5 hours';
	if (average > targetHours + 0.5) {
		rating = 3;
		ratingDescription = 'Hours exceed target more than 0.5 hours';
	}
	else if (average < targetHours - 0.5) {
		rating = 1;
		ratingDescription = 'Hours are over 0.5 hours less than target';
	}

	return {
		periodLength: dailyHours.length,
		trainingDays: dailyHours.filter(h => h > 0).length,
		average: average,
		success: average >= targetHours,
		rating: rating,
		ratingDescription: ratingDescription,
		target: targetHours
	};
};

export interface ExerciseArguments {
	targetHours: number,
	dailyHours: Array<number>
}

export const parseExerciseArgs = (args: Array<string>): ExerciseArguments => {
	if (args.length < 4) throw new Error('Not enough arguments');

	const result: ExerciseArguments = { targetHours: 0, dailyHours: [] };

	for (let i = 2; i < args.length; i++) {
		if (isNaN(Number(args[i]))) throw new Error('Provided values were not numbers!');
		else {
			if (i === 2) result.targetHours = Number(args[i]);
			else result.dailyHours.push(Number(args[i]));
		}
	}
	return result;
};

if (require.main === module) {
	try {
		const { dailyHours, targetHours } = parseExerciseArgs(process.argv);
		console.log(calculateExercises(dailyHours, targetHours));
	} catch (e) {
		if (e instanceof Error)
			console.error('Error:', e.message);
	}
}

export default calculateExercises;