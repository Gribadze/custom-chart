// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg/index';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import styles from './Styles';
import LineGroup from './LineGroup';

type Props = {
  leftOverflow: number,
  vertical: boolean,
  scale: number,
  negativeHeight: number,
  positiveHeight: number,
  containerWidth: number,
  chartHeight: number,
  data: { [string]: number },
  coloring: string,
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  getValue: (key: string, value: number, index: number) => number,
  onLayout: (e: LayoutEvent) => void,
};

export default class LineCanvas extends React.PureComponent<Props> {
  calcLinePoint = (scale: number) => (index: number) => {
    const { data, thickness, spaceAround, vertical, getValue } = this.props;
    const [key, value] = Object.entries(data)[index];
    const currentValue = getValue(key, +value, index);
    const scaledValue = scale * currentValue;
    const step = index * (thickness + spaceAround) + spaceAround;
    return {
      value: currentValue,
      ...(vertical
        ? {
            offset: {
              x: -scaledValue,
              y: step,
            },
          }
        : {
            offset: {
              x: step,
              y: -scaledValue,
            },
          }),
    };
  };

  calcCanvasProps = (x: number, y: number, width: number, height: number) => {
    const { vertical, scrollable } = this.props;
    return vertical
      ? {
          width: '100%',
          height: scrollable ? width : '100%',
          viewBox: `${y} ${x} ${height} ${width}`,
        }
      : {
          width: scrollable ? width : '100%',
          height: '100%',
          viewBox: `${x} ${y} ${width} ${height}`,
        };
  };

  render() {
    const {
      leftOverflow,
      chartHeight,
      coloring,
      containerWidth,
      data,
      thickness,
      labelColor,
      labelFontSize,
      labelRotation,
      negativeHeight,
      positiveHeight,
      scale,
      vertical,
      onLayout,
    } = this.props;
    return (
      <View style={[styles.canvas, styles.container]}>
        <Svg
          {...this.calcCanvasProps(
            leftOverflow,
            vertical ? scale * negativeHeight : -scale * positiveHeight,
            containerWidth,
            chartHeight,
          )}
          preserveAspectRatio="none"
          onLayout={onLayout}
        >
          <LineGroup
            data={data}
            color={coloring}
            thickness={thickness}
            fontColor={labelColor}
            fontSize={labelFontSize}
            textRotation={labelRotation}
            getValue={this.calcLinePoint(scale)}
          />
        </Svg>
      </View>
    );
  }
}
