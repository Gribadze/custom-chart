// @flow
import React from 'react';
import keys from 'lodash/keys';
import map from 'lodash/map';
import { Polyline } from 'react-native-svg/index';
import Label from './Label';
import type { CategoryType } from './Chart.types';

type DefaultProps = {
  textRotation: number,
};

type Props = DefaultProps & {
  data: CategoryType,
  thickness: number,
  color: string,
  fontColor: string,
  fontSize: number,
  textRotation?: number,
  getValue: (index: number) => { value: number, offset: { x: number, y: number } },
};

export default class LineGroup extends React.PureComponent<Props> {
  static defaultProps = {
    textRotation: 0,
  };

  render() {
    const { data, thickness, color, fontColor, fontSize, textRotation, getValue } = this.props;
    return (
      <>
        <Polyline
          points={map(keys(data), (key, index) => {
            const {
              offset: { x, y },
            } = getValue(index);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
        />
        {map(keys(data), (key, index) => {
          const { value, offset } = getValue(index);
          return (
            <Label
              key={key}
              offset={offset}
              color={fontColor}
              fontSize={fontSize}
              rotation={textRotation}
              text={value.toString()}
            />
          );
        })}
      </>
    );
  }
}
