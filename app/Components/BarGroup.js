// @flow
import React from 'react';
import Bar from './Bar';

type Props = {
  data: { [string]: number },
  barColor: string,
  getValue: (index: number) => { height: number, width: number, offset: { x: number, y: number } },
};

class BarGroup extends React.PureComponent<Props> {
  render() {
    const { data, barColor, getValue } = this.props;
    return (
      <>
        {Object.keys(data).map((key, index) => {
          const { height, width, offset } = getValue(index);
          return <Bar key={key} height={height} width={width} color={barColor} offset={offset} />;
        })}
      </>
    );
  }
}

export default BarGroup;
