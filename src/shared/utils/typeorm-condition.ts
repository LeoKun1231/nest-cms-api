//条件->英语 condition->Chinese

import { Between, MoreThanOrEqual } from "typeorm";

/**
 * @description 生成更多和之间的条件
 * @param {any[]} arr
 * @returns {any}
 */
export const moreAndBetweenCondition = (arr: any[]) => {
	if (!arr || arr.length === 0) return undefined;
	if (arr.length == 1) {
		return MoreThanOrEqual(arr[0]);
	}
	if (arr.length == 2) {
		return Between(arr[0], arr[1]);
	}
	return undefined;
};
