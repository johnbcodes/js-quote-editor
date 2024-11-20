import { z } from 'zod';

const dateValidator = z.coerce
	.date({
		errorMap: (issue, { defaultError }) => ({
			message: issue.code === 'invalid_date' ? 'Please enter a date.' : defaultError
		})
	})
	.refine((val) => val.getTime() > new Date().getTime(), {
		message: 'Date must not be in the past.'
	})
	.refine(
		(val) => {
			let tenYearsFromNow = new Date();
			tenYearsFromNow.setFullYear(new Date().getFullYear() + 10);
			return val.getTime() < tenYearsFromNow.getTime();
		},
		{
			message: 'Date must not be more than 10 years in the future.'
		}
	);

export const createValidator = z
	.object({
		quoteId: z.string().ulid(),
		date: dateValidator
	})
	.required();

export const updateValidator = z
	.object({
		id: z.string().ulid(),
		date: dateValidator
	})
	.required();
