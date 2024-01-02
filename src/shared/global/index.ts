let globalApp: any;

export const setGlobalApp = (app: any) => {
	globalApp = app;
};

export const getGlobalApp = () => {
	if (!globalApp) {
		throw new Error("获取全局实例失败");
	}
	return globalApp;
};
