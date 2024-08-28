import { TinyArea } from '@ant-design/charts';
import { FC } from 'react'

const TinyAreaChart: FC<{data: number[]}> = (props) => {
 
  const config = {
    height: 60,
    autoFit: false,
    data: props.data,
    smooth: true,
    areaStyle: {
      fill: '#d6e3fd',
    },
  };
  return <TinyArea {...config} />;
}
export default TinyAreaChart
