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
  data: { [key: string]: { [category: string]: number } },
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
  transformedData: { [category: string]: { [key: string]: number } },
};

export default class LineCanvas extends React.PureComponent<Props, State> {
  state = {
    transformedData: {},
  };

  static getDerivedStateFromProps(props: Props) {
    const { data } = props;
    return {
      transformedData: Object.entries(data).reduce(
        (byKey, [key, keyData]) =>
          Object.keys.call(keyData, keyData).reduce(
            (byCategory, category) => ({
              ...byCategory,
              [category]: { ...byCategory[category], [key]: data[key][category] },
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
    const value = +Object.values(transformedData[category])[index];
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
          {Object.keys(transformedData).map((category, index) => (
            <LineGroup
              key={category}
              data={transformedData[category]}
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
