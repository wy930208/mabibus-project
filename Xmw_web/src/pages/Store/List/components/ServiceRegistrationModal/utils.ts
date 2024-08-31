export function generateHalfHourIntervals(startHour: number, endHour: number) {
  const arr = [];
  const startDate = new Date();
  startDate.setHours(startHour, 0, 0, 0); // 设置为指定的开始小时
  startDate.setMinutes(startDate.getMinutes() - (startDate.getMinutes() % 30), 0, 0); // 确保开始时间是半小时的整数倍

  const endDate = new Date();
  endDate.setHours(endHour, 0, 0, 0); // 设置为指定的结束小时
  endDate.setMinutes(endDate.getMinutes() + (30 - (endDate.getMinutes() % 30)), 0, 0); // 确保结束时间是半小时的整数倍且包含该半小时段

  for (let d = new Date(startDate); d <= endDate; d.setTime(d.getTime() + 1800000)) {
    // 格式化时间显示
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const next = new Date(d);
    next.setTime(next.getTime() + 1800000); // 加半小时
    const nextHours = String(next.getHours()).padStart(2, '0');
    const nextMinutes = String(next.getMinutes()).padStart(2, '0');

    arr.push(`${hours}:${minutes}~${nextHours}:${nextMinutes}`);
  }
  return arr;
}

// 判断时间落在哪个区间, 如 '2024-08-29 09:16:00' => 09:00~09:30
export function getTimeInterVal(timeStr: string) {
  const date = new Date(timeStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // 计算时间段起始分钟数
  const startMinutes = minutes - minutes % 30;
  const startHour = hours;
  let endHour = startHour;
  let endMinutes = startMinutes + 30;

  // 如果结束分钟数等于或超过60，‌则小时数加1，‌分钟数减去60
  if (endMinutes >= 60) {
      endHour += 1;
      endMinutes -= 60;
  }

  // 格式化时间显示
  const startFormatted = `${String(startHour).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
  const endFormatted = `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

  return `${startFormatted}~${endFormatted}`;
}
