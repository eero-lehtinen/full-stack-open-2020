import express from 'express';
import calculateBmi, { parseBmiArgs } from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/bmi', (req, res) => {
	if (req.query.height && req.query.weight
		&& typeof req.query.height === 'string'
		&& typeof req.query.weight === 'string') {
		try {
			const { heightCm, weightKg } = parseBmiArgs(['', '', req.query.height, req.query.weight]);
			res.send({
				height: heightCm,
				weight: weightKg,
				bmi: calculateBmi(heightCm, weightKg)
			});
		} catch (_e) {
			res.send({ error: "malformatted parameters" });
		}
	}
	else
		res.send({ error: "malformatted parameters" });
});



app.get('/exercise', (req, res) => {

	if ('daily_exercises' in req.body && 'target' in req.body) {
		/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call */
		if (Array.isArray(req.body.daily_exercises)
			&& req.body.daily_exercises.every((item: any) => !isNaN(Number(item)))
			&& !isNaN(Number(req.body.target))) {
			res.send(calculateExercises(req.body.daily_exercises.map((item: any) => Number(item)), Number(req.body.target)));
			/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call */
		}
		else {
			res.send({ error: "malformatted parameters" });
		}
	}
	else {
		res.send({ error: "parameters missing" });
	}
});

const PORT = 3003;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});