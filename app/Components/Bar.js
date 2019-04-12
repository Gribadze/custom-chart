// @flow
import React from 'react';
import { Rect } from 'react-native-svg/index';

type DefaultProps = {
  offset: {
    x: number,
    y: number,
  },
};

type Props = DefaultProps & {
  height: number,
  width: number,
  color: string,
  offset?: {
    x: number,
    y: number,
  },
};

export default class Bar extends React.PureComponent<Props> {
  static defaultProps = {
    offset: { x: 0, y: 0 },
  };

  render() {
    const { height, width, color, offset } = this.props;
    return <Rect x={offset.x} y={offset.y} width={width} height={Math.abs(height)} fill={color} />;
  }
}
