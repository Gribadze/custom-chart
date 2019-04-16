// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg/index';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import styles from './Styles';
import BarGroup from './BarGroup';

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

export default class BarCanvas extends React.PureComponent<Props> {
  calcBarRect = (scale: number) => (index: number) => {
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
              x: scaledValue < 0 ? scaledValue : 0,
              y: step,
            },
            height: thickness,
            width: scaledValue,
          }
        : {
            offset: {
              x: step,
              y: scaledValue > 0 ? -scaledValue : 0,
            },
            height: scaledValue,
            width: thickness,
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
          <BarGroup
            data={data}
            color={coloring}
            getValue={this.calcBarRect(scale)}
            fontSize={labelFontSize}
            fontColor={labelColor}
            textRotation={labelRotation}
          />
        </Svg>
      </View>
    );
  }
}
