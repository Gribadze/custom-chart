// @format
// @flow
import React, { Component } from 'react';
import { View, Text } from 'react-native';
export { BarChart } from './BarChart';

type Props = {
  thickness?: ?number,
  spaceAround?: ?number,
  scrollable?: ?boolean,
  coloring?: string,
  vertical?: ?boolean,
  horizontal?: ?boolean,
  labelColor?: string,
  clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: ?number,
};

export class LineChart extends Component<Props> {
  static defaultProps = {
    thickness: 2,
    spaceAround: null,
    scrollable: true,
    coloring: '#F1C40F',
    vertical: false,
    horizontal: true,
    labelColor: '#000000',
    clickable: false,
    showLabel: true,
    labelRotation: 90,
  };

  render() {
    return (
      <View>
        <Text>Line chart</Text>
      </View>
    );
  }
}

export class PieChart extends Component<Props> {
  static defaultProps = {
    labelColor: '#000000',
    clickable: true,
    showLabel: true,
  };

  render() {
    return (
      <View>
        <Text>Pie chart</Text>
      </View>
    )
  }
}
