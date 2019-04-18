// @flow
import React from 'react';
import { Circle } from 'react-native-svg';
import Label from './Label';

type Props = {
  radius: number,
  offset: number,
  part: number,
  text: string,
  textRotation: number,
  fontColor: string,
  fontSize: number,
  color: string,
};

export default class Pie extends React.PureComponent<Props> {
  render() {
    const { radius, offset, part, color, text, fontSize, fontColor, textRotation } = this.props;
    const fullCircleLength = 2 * Math.PI * (radius / 2);
    return (
      <>
        <Circle
          r={radius / 2}
          fill="none"
          stroke={color}
          strokeDashoffset={`${-offset * fullCircleLength}`}
          strokeDasharray={`${fullCircleLength * part} ${fullCircleLength}`}
          strokeWidth={radius}
        />
        <Label
          color={fontColor}
          fontSize={fontSize}
          offset={{
            x: (radius / 2) * Math.cos(2 * Math.PI * (offset + part / 2)),
            y: (radius / 2) * Math.sin(2 * Math.PI * (offset + part / 2)),
          }}
          rotation={textRotation}
          text={text}
        />
      </>
    );
  }
}
