import { BaseTreeEntity } from "../entities/base/BaseTree.entity";

/**
 * @description 过滤树形结构中isDelete为true的节点
 * @param trees 树形结构
 * @returns 过滤后的树形结构
 */
export function filterTree<T extends BaseTreeEntity<T>>(trees: T[]) {
	// 遍历去除掉isDelete为true的节点
	trees = trees.filter((tree) => !tree.isDelete);

	//递归去掉children中isDelete为true的节点
	trees.forEach((tree) => {
		if (tree.children && tree.children.length > 0) {
			tree.children = filterTree(tree.children);
		}
	});

	return trees;
}
