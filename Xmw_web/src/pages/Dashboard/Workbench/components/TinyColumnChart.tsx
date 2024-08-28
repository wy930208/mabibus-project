import { TinyColumn } from '@ant-design/charts';
import { FC } from 'react'

const TinyColumnChart: FC<{data: number[]}> = ({data}) => {
  const config = {
    height: 60,
    autoFit: false,
    data,
  };
  return <TinyColumn {...config} />;
}
export default TinyColumnChart
