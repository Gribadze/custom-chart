// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg';
import entries from 'lodash/entries';
import map from 'lodash/map';
import min from 'lodash/min';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { DataType } from './Chart.types';
import styles from './Styles';
import PieGroup from './PieGroup';

type Props = {
  leftOverflow: number,
  containerWidth: number,
  chartHeight: number,
  data: DataType,
  coloring: string[],
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  onLayout: (e: LayoutEvent) => void,
};

export default class PieCanvas extends React.PureComponent<Props> {
  calcCanvasProps = (x: number, y: number, width: number, height: number) => ({
    width: '100%',
    height: '100%',
    viewBox: `${x} ${y} ${width * 2} ${height}`,
  });

  render() {
    const {
      chartHeight,
      coloring,
      containerWidth,
      data,
      labelColor,
      labelFontSize,
      labelRotation,
      onLayout,
    } = this.props;
    const canvasProps = this.calcCanvasProps(
      -containerWidth / 2,
      -chartHeight / 2,
      containerWidth,
      chartHeight,
    );
    return (
      <View style={[styles.canvas, styles.container]}>
        <Svg {...canvasProps} preserveAspectRatio="none" onLayout={onLayout}>
          {map(entries(data), ([key, keyData]) => (
            <PieGroup
              key={key}
              size={min([containerWidth, chartHeight])}
              data={keyData}
              coloring={coloring}
              fontSize={labelFontSize}
              fontColor={labelColor}
              textRotation={labelRotation}
            />
          ))}
        </Svg>
      </View>
    );
  }
}
