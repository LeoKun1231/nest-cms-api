import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTime = (
	time: Date,
	formatString = "YYYY-MM-DD HH:mm:ss",
) => {
	return dayjs(time).tz("Asia/Shanghai").format(formatString);
};
