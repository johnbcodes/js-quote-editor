export function transformErrors(errors) {
	let target = { all: [] };
	errors.forEach((error) => {
		let field = error.path[0];
		target.all.push(error.message);
		if (target[field]) {
			target[field].push(error.message);
		} else {
			target[field] = [error.message];
		}
	});
	return target;
}

export function isInvalid(error) {
	return error ? 'true' : undefined;
}
