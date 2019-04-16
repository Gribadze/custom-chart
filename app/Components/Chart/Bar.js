// @flow
import React from 'react';
import { Rect } from 'react-native-svg/index';
import Label from './Label';

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
  fontColor: string,
  fontSize: number,
  text: string,
  textRotation: number,
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
    const { height, width, color, fontColor, fontSize, text, offset, textRotation } = this.props;
    const [absWidth, absHeight] = [Math.abs(width), Math.abs(+height)];
    const [x, y] = [
      width > 0 ? offset.x : width - offset.x,
      height > 0 ? -height - offset.y : offset.y,
    ];
    return (
      <>
        <Rect x={x} y={y} width={absWidth} height={absHeight} fill={color} />
        <Label
          color={fontColor}
          fontSize={fontSize}
          offset={{
            x: x + absWidth / 2,
            y: y + absHeight / 2,
          }}
          rotation={textRotation}
          text={text}
        />
      </>
    );
  }
}
