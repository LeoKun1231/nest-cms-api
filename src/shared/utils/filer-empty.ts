/**
 * 去除对象中所有underfined、null、''的属性
 * @param obj
 * @returns
 */
export const filterEmpty = (obj: any) => {
	Object.keys(obj).forEach((key) => {
		if (
			obj[key] &&
			typeof obj[key] === "object" &&
			obj[key].constructor === Object
		) {
			filterEmpty(obj[key]);
		} else if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
			delete obj[key];
		}
	});
	return obj;
};
