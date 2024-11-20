import { z } from 'zod';

export const createValidator = z.object({
	lineItemDateId: z.string().ulid(),
	name: z.string().min(1, { message: 'Please enter a name' }),
	description: z.string(),
	quantity: z.coerce.number().int().gt(0, { message: 'Please enter a quantity greater than zero' }),
	unitPrice: z.coerce.number().gte(0)
});

export const updateValidator = createValidator
	.omit({ lineItemDateId: true })
	.extend({ id: z.string().ulid() });
