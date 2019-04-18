// @flow
import React from 'react';
import map from 'lodash/map';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { G } from 'react-native-svg/index';
import Label from './Label';

type Props = {
  data: string[],
  fontColor: string,
  fontSize: number,
  textRotation: number,
  getOffset: (index: number) => { x: number, y: number },
  onLayout: (e: LayoutEvent) => void,
};

class LabelGroup extends React.PureComponent<Props> {
  render() {
    const { data, fontColor, fontSize, textRotation, getOffset, onLayout } = this.props;
    return (
      <G onLayout={onLayout}>
        {map(data, (text, index) => (
          <Label
            key={text}
            color={fontColor}
            fontSize={fontSize}
            text={text}
            offset={getOffset(index)}
            rotation={textRotation}
          />
        ))}
      </G>
    );
  }
}

export default LabelGroup;
