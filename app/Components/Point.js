// @flow
import React from 'react';
import { Circle } from 'react-native-svg/index';

type DefaultProps = {
  offset: {
    x: number,
    y: number,
  },
};

type Props = DefaultProps & {
  color: string,
  offset?: {
    x: number,
    y: number,
  },
};

export default class Point extends React.PureComponent<Props> {
  static defaultProps = {
    offset: { x: 0, y: 0 },
  };

  render() {
    const { color, offset } = this.props;
    return <Circle cx={offset.x} cy={offset.y} r={3} fill={color} />;
  }
}
