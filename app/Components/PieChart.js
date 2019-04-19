// @flow
import React from 'react';
import Chart, { ChartType } from './Chart/Chart';
import type { DataType } from './Chart/Chart.types';

type DefaultProps = {
  labelColor: string,
  showLabel: boolean,
  labelRotation: number,
  labelFontSize: number,
  minValue: null,
  maxValue: null,
};

type Props = DefaultProps & {
  data: DataType,
  coloring: string[],
  labelColor?: string,
  // clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: number,
  labelFontSize?: number,
  minValue?: null,
  maxValue?: null,
};

export default class PieChart extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    labelColor: '#000000',
    // clickable: false,
    showLabel: false,
    labelRotation: 90,
    labelFontSize: 14,
    minValue: null,
    maxValue: null,
  };

  render() {
    const { props } = this;
    return <Chart type={ChartType.PIE} {...props} />;
  }
}
