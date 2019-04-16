// @flow
import React from 'react';
import { G, Text } from 'react-native-svg/index';

type DefaultProps = {
  offset: {
    x: number,
    y: number,
  },
};

type Props = DefaultProps & {
  color: string,
  fontSize: number,
  text: string,
  offset?: {
    x: number,
    y: number,
  },
  rotation: number,
};

export default class Label extends React.PureComponent<Props> {
  static defaultProps = {
    offset: { x: 0, y: 0 },
  };

  render() {
    const { color, fontSize, text, offset, rotation } = this.props;
    const [x, y] = [
      offset.x - (fontSize / 3) * Math.sin((rotation * Math.PI) / 180),
      offset.y + (fontSize / 2) * Math.cos((rotation * Math.PI) / 180),
    ];
    return (
      <G origin={`${x}, ${y}`} rotation={rotation}>
        <Text fill={color} fontSize={fontSize} textAnchor="middle" x={x} y={y}>
          {text}
        </Text>
      </G>
    );
  }
}
