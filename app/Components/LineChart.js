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
};

type Props = DefaultProps & {
  data: DataType,
  // eslint-disable-next-line react/no-unused-prop-types
  maxValue?: number,
  // eslint-disable-next-line react/no-unused-prop-types
  minValue?: number,
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

export default class LineChart extends React.PureComponent<Props> {
  static defaultProps: DefaultProps = {
    thickness: 2,
    spaceAround: 40,
    scrollable: true,
    coloring: '#F1C40F',
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
    return <Chart type={ChartType.LINE} {...props} />;
  }
}
