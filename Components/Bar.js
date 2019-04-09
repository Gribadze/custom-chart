// @format
// @flow
import React from 'react';
import { Rect } from 'react-native-svg';

type BarProps = {
  height: number,
  width: number,
  offset: {
    x: number,
    y: number,
  }
}

export default class Bar extends React.PureComponent<BarProps> {
  render() {
    const {
      height, width, offset,
    } = this.props;
    return (
          <Rect
            x={offset.x}
            y={offset.y}
            width={width}
            height={height}
            fill="yellow"
          />
    )
  }
}
