// @flow
import React from 'react';
import Chart, { ChartType } from './Chart/Chart';
import type { DataType } from './Chart/Chart.types';

type DefaultProps = {
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  coloring: string | string[],
  vertical: boolean,
  labelColor: string,
  showLabel: boolean,
  labelRotation: number,
  labelFontSize: number,
  maxValue: null,
  minValue: null,
};

type Props = DefaultProps & {
  data: DataType,
  maxValue?: number | null,
  minValue?: number | null,
  thickness?: number,
  spaceAround?: number,
  scrollable?: boolean,
  coloring?: string | string[],
  vertical?: boolean,
  labelColor?: string,
  // clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: number,
  labelFontSize?: number,
};

export default class BarChart extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    thickness: 40,
    spaceAround: 5,
    scrollable: true,
    coloring: '#3498DB',
    vertical: false,
    labelColor: '#000000',
    // clickable: false,
    showLabel: true,
    labelRotation: 90,
    labelFontSize: 14,
    maxValue: null,
    minValue: null,
  };

  render() {
    const { props } = this;
    return <Chart type={ChartType.BAR} {...props} />;
  }
}
