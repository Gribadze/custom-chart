// @flow
import React from 'react';
import keys from 'lodash/keys';
import map from 'lodash/map';
import sum from 'lodash/sum';
import slice from 'lodash/slice';
import get from 'lodash/get';
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
    const fullGroupSum = sum(map(data));
    return (
      <>
        {map(keys(data), (key, index) => (
          <Pie
            key={key}
            radius={size / 2}
            offset={sum(slice(map(data, value => value / fullGroupSum), 0, index))}
            part={get(data, key) / fullGroupSum}
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
