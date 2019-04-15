// @flow
import React from 'react';
import { Polyline } from 'react-native-svg';
import Point from './Point';

type Props = {
  data: { [string]: number },
  barColor: string,
  getValue: (index: number) => { height: number, width: number, offset: { x: number, y: number } },
};

export default class LineGroup extends React.PureComponent<Props> {
  render() {
    const { data, barColor, getValue } = this.props;
    return (
      <>
        {Object.keys(data).map((key, index) => {
          const { height, width, offset } = getValue(index);
          return <Point key={key} height={height} width={width} color={barColor} offset={offset} />;
        })}
        <Polyline
          points={Object.keys(data)
            .map((key, index) => {
              const {
                offset: { x, y },
              } = getValue(index);
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke={barColor}
          strokeWidth={2}
        />
      </>
    );
  }
}
