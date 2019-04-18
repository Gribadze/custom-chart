// @flow
import React from 'react';
import Chart, { ChartType } from './Chart/Chart';

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
  data: { [key: string]: { [category: string]: number } },
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
