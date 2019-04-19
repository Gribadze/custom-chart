// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg';
import get from 'lodash/get';
import entries from 'lodash/entries';
import map from 'lodash/map';
import values from 'lodash/values';
import reduce from 'lodash/reduce';
import max from 'lodash/max';
import min from 'lodash/min';
import keys from 'lodash/keys';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { DataType } from './Chart.types';
import styles from './Styles';
import BarGroup from './BarGroup';

type DefaultProps = {
  minValue: null,
  maxValue: null,
};

type Props = DefaultProps & {
  canvasHeight: number | null,
  canvasWidth: number | null,
  leftOverflow: number,
  rightOverflow: number,
  vertical: boolean,
  data: DataType,
  coloring: string | string[],
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  minValue?: number,
  maxValue?: number,
};

type State = {
  positiveHeight: number,
  negativeHeight: number,
  scale: number,
};

export default class BarCanvas extends React.PureComponent<Props, State> {
  static defaultProps = {
    minValue: null,
    maxValue: null,
  };

  state = {
    positiveHeight: 0,
    negativeHeight: 0,
    scale: 1,
  };

  static getDerivedStateFromProps(props: Props) {
    const { data, minValue, maxValue } = props;
    const positiveHeight = reduce(
      values(data),
      (acc, category) => max([acc, ...values(category)]),
      maxValue || 0,
    );
    const negativeHeight = reduce(
      values(data),
      (acc, category) => min([acc, ...values(category)]),
      minValue || 0,
    );
    return {
      positiveHeight,
      negativeHeight,
    };
  }

  handleCanvasLayout = (e: LayoutEvent) => {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = e;
    const { vertical } = this.props;
    const { positiveHeight, negativeHeight } = this.state;
    this.setState({ scale: (vertical ? width : height) / (positiveHeight - negativeHeight) });
  };

  calcBarRect = (key: string, scale: number) => (index: number) => {
    const { data, thickness, vertical } = this.props;
    const keyData = values(get(data, key));
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
      rightOverflow,
      coloring,
      data,
      labelColor,
      labelFontSize,
      labelRotation,
      vertical,
      thickness,
      spaceAround,
    } = this.props;
    const { positiveHeight, negativeHeight, scale } = this.state;
    const chartHeight = scale * (positiveHeight - negativeHeight);
    const chartWidth =
      Math.abs(leftOverflow) +
      keys(data).length * (thickness + spaceAround) +
      spaceAround +
      rightOverflow;
    const canvasProps = this.calcCanvasProps(
      leftOverflow,
      vertical ? scale * negativeHeight : -scale * positiveHeight,
      chartWidth,
      chartHeight,
    );
    return (
      <View style={[styles.canvas, styles.container]}>
        <Svg {...canvasProps} preserveAspectRatio="none" onLayout={this.handleCanvasLayout}>
          {map(entries(data), ([key, keyData], index) => {
            const step = index * (thickness + spaceAround) + spaceAround;
            return (
              <BarGroup
                key={key}
                data={keyData}
                offset={vertical ? { x: 0, y: step } : { x: step, y: 0 }}
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
