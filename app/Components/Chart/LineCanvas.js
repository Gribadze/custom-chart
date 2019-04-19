// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg/index';
import entries from 'lodash/entries';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import values from 'lodash/values';
import keys from 'lodash/keys';
import map from 'lodash/map';
import max from 'lodash/max';
import min from 'lodash/min';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import styles from './Styles';
import LineGroup from './LineGroup';
import type { DataType } from './Chart.types';

type DefaultProps = {
  maxValue: null,
  mimValue: null,
};

type Props = DefaultProps & {
  canvasHeight: number | null,
  canvasWidth: number | null,
  leftOverflow: number,
  rightOverflow: number,
  vertical: boolean,
  scale: number,
  negativeHeight: number,
  positiveHeight: number,
  containerWidth: number,
  chartHeight: number,
  data: DataType,
  coloring: string | string[],
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  minValue?: number | null,
  maxValue?: number | null,
};

type State = {
  transformedData: DataType,
  positiveHeight: number,
  negativeHeight: number,
  scale: number,
};

export default class LineCanvas extends React.PureComponent<Props, State> {
  static defaultProps = {
    minValue: null,
    maxValue: null,
  };

  state = {
    transformedData: {},
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
      transformedData: reduce(
        entries(data),
        (byKey, [key, keyData]) =>
          reduce(
            entries(keyData),
            (byCategory, [category, value]) => ({
              ...byCategory,
              [category]: { ...byCategory[category], [key]: value },
            }),
            byKey,
          ),
        {},
      ),
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

  calcLinePoint = (category: string, scale: number) => (index: number) => {
    const { thickness, spaceAround, vertical } = this.props;
    const { transformedData } = this.state;
    const value = get(values(get(transformedData, category)), index);
    const scaledValue = scale * value;
    const step = index * (thickness + spaceAround) + spaceAround;
    return {
      value,
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
      data,
      leftOverflow,
      rightOverflow,
      coloring,
      thickness,
      spaceAround,
      labelColor,
      labelFontSize,
      labelRotation,
      vertical,
    } = this.props;
    const { transformedData, positiveHeight, negativeHeight, scale } = this.state;
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
          {map(entries(transformedData), ([category, categoryData], index) => (
            <LineGroup
              key={category}
              data={categoryData}
              color={typeof coloring === 'string' ? coloring : coloring[index % coloring.length]}
              thickness={thickness}
              fontColor={labelColor}
              fontSize={labelFontSize}
              textRotation={labelRotation}
              getValue={this.calcLinePoint(category, scale)}
            />
          ))}
        </Svg>
      </View>
    );
  }
}
