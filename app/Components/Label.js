// @flow
import React from 'react';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { G, Text } from 'react-native-svg';

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
  onLayout: (e: LayoutEvent) => void,
};

export default class Label extends React.PureComponent<Props> {
  static defaultProps = {
    offset: { x: 0, y: 0 },
  };

  handleLayout = (e: LayoutEvent) => {
    const { onLayout } = this.props;
    onLayout(e);
  };

  render() {
    const { color, fontSize, text, offset, rotation } = this.props;
    return (
      <G origin={`${offset.x}, ${offset.y}`} rotation={rotation} onLayout={this.handleLayout}>
        <Text fill={color} fontSize={fontSize} textAnchor="middle" x={offset.x} y={offset.y}>
          {text}
        </Text>
      </G>
    );
  }
}
