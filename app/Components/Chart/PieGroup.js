// @flow
import React from 'react';
import Pie from './Pie';
import type { CategoryType } from './Chart.types';

type Props = {
  size: number,
  data: CategoryType,
  coloring: string[],
  labelRotation: number,
  labelColor: string,
  labelFontSize: number,
};

export default class PieGroup extends React.PureComponent<Props> {
  render() {
    const { data, size, coloring, labelRotation, labelFontSize, labelColor } = this.props;
    const sum = Object.values(data).reduce((acc, value) => acc + +value, 0);
    return (
      <>
        {Object.keys.call(data, data).map((key, index) => (
          <Pie
            key={key}
            radius={size / 2}
            offset={Object.values(data)
              .filter((_, i) => i < index)
              .reduce((acc, value) => acc + +value / sum, 0)}
            part={data[key] / sum}
            text={`${key} (${data[key]})`}
            textRotation={labelRotation}
            fontColor={labelColor}
            fontSize={labelFontSize}
            color={coloring[index % coloring.length]}
          />
        ))}
      </>
    );
  }
}
