// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg';
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
  data: { [key: string]: { [category: string]: number } },
  coloring: string | string[],
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
  calcBarRect = (key: string, scale: number) => (index: number) => {
    const { data, thickness, vertical } = this.props;
    const keyData = Object.values(data[key]);
    const value = +keyData[index];
    const scaledValue = scale * value;
    const offset = (index * thickness) / keyData.length;
    return {
      value,
      ...(vertical
        ? {
            offset: {
              x: 0,
              y: offset,
            },
            height: -thickness / keyData.length,
            width: scaledValue,
          }
        : {
            offset: {
              x: offset,
              y: 0,
            },
            height: scaledValue,
            width: thickness / keyData.length,
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
      thickness,
      spaceAround,
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
          {Object.keys(data).map((key, index) => {
            const step = index * (thickness + spaceAround) + spaceAround;
            return (
              <BarGroup
                key={key}
                data={data[key]}
                offset={
                  vertical
                    ? { x: 0, y: step }
                    : {
                        x: step,
                        y: 0,
                      }
                }
                color={coloring}
                getValue={this.calcBarRect(key, scale)}
                fontSize={labelFontSize}
                fontColor={labelColor}
                textRotation={labelRotation}
              />
            );
          })}
        </Svg>
      </View>
    );
  }
}
