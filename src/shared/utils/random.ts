import { v4 as uuid } from "uuid";

export const getRandomId = () => {
	return uuid().replace(/-/g, "");
};
