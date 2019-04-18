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
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import styles from './Styles';
import LineGroup from './LineGroup';
import type { DataType } from './Chart.types';

type Props = {
  leftOverflow: number,
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
  onLayout: (e: LayoutEvent) => void,
};

type State = {
  transformedData: DataType,
};

export default class LineCanvas extends React.PureComponent<Props, State> {
  state = {
    transformedData: {},
  };

  static getDerivedStateFromProps(props: Props) {
    const { data } = props;
    return {
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
      leftOverflow,
      chartHeight,
      coloring,
      containerWidth,
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
    const { transformedData } = this.state;
    const canvasProps = this.calcCanvasProps(
      leftOverflow,
      vertical ? scale * negativeHeight : -scale * positiveHeight,
      containerWidth,
      chartHeight,
    );
    return (
      <View style={[styles.canvas, styles.container]}>
        <Svg {...canvasProps} preserveAspectRatio="none" onLayout={onLayout}>
          {map(keys(transformedData), (category, index) => (
            <LineGroup
              key={category}
              data={get(transformedData, category)}
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
