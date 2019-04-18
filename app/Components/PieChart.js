// @flow
import React from 'react';
import Chart, { ChartType } from './Chart/Chart';
import type { DataType } from './Chart/Chart.types';

type DefaultProps = {
  labelColor: string,
  showLabel: boolean,
  labelRotation: number,
  labelFontSize: number,
};

type Props = DefaultProps & {
  data: DataType,
  coloring: string[],
  labelColor?: string,
  // clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: number,
  labelFontSize?: number,
};

export default class BarChart extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    labelColor: '#000000',
    // clickable: false,
    showLabel: true,
    labelRotation: 90,
    labelFontSize: 14,
  };

  render() {
    const { props } = this;
    return <Chart type={ChartType.PIE} {...props} />;
  }
}
