export function RecordTime() {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor,
	) {
		const method = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const startTime = Date.now();
			const result = await method.apply(this, args);
			const endTime = Date.now();
			this.logger.log(
				`${propertyKey} was called , args: ${args} time: 🚀 ${
					endTime - startTime
				}ms`,
			);
			return result;
		};
	};
}
