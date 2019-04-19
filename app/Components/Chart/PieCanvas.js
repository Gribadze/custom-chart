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
  rightOverflow: number,
  canvasHeight: number,
  canvasWidth: number,
  data: DataType,
  coloring: string[],
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  onLayout: (e: LayoutEvent) => void,
};

export default class PieCanvas extends React.Component<Props> {
  calcCanvasProps = (x: number, y: number, width: number, height: number) => ({
    width: '100%',
    height: '100%',
    viewBox: width && height ? `${x} ${y} ${width} ${height}` : null,
  });

  render() {
    const {
      canvasHeight,
      canvasWidth,
      coloring,
      data,
      labelColor,
      labelFontSize,
      labelRotation,
      onLayout,
    } = this.props;
    const canvasProps = this.calcCanvasProps(
      -canvasWidth / 2,
      -canvasHeight / 2,
      canvasWidth,
      canvasHeight,
    );
    return (
      <View style={[styles.canvas, styles.container]}>
        <Svg {...canvasProps} preserveAspectRatio="none" onLayout={onLayout}>
          {map(entries(data), ([key, keyData]) => (
            <PieGroup
              key={key}
              size={min([canvasWidth, canvasHeight]) || 1}
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
