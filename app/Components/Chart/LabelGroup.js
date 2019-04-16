// @flow
import React from 'react';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { G } from 'react-native-svg/index';
import Label from './Label';

type Props = {
  data: { [string]: number },
  fontColor: string,
  fontSize: number,
  textRotation: number,
  getLabel: (key: string, value: number, index: number) => string,
  getOffset: (index: number) => { x: number, y: number },
  onLayout: (e: LayoutEvent) => void,
};

class LabelGroup extends React.PureComponent<Props> {
  render() {
    const { data, fontColor, fontSize, textRotation, getLabel, getOffset, onLayout } = this.props;
    return (
      <G onLayout={onLayout}>
        {Object.entries(data).map(([key, value], index) => (
          <Label
            key={key}
            color={fontColor}
            fontSize={fontSize}
            text={getLabel(key, +value, index)}
            offset={getOffset(index)}
            rotation={textRotation}
          />
        ))}
      </G>
    );
  }
}

export default LabelGroup;
