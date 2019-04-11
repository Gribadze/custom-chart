// @format
// @flow
import React from 'react';
import { Rect } from 'react-native-svg/index';

type BarProps = {
  height: number,
  width: number,
  color: string,
  offset: {
    x: number,
    y: number,
  },
};

export default class Bar extends React.PureComponent<BarProps> {
  render() {
    const { height, width, color, offset } = this.props;
    return <Rect x={offset.x} y={offset.y} width={width} height={Math.abs(height)} fill={color} />;
  }
}
