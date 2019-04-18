// @flow
import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg/index';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import styles from './Styles';
import LabelGroup from './LabelGroup';

const LABEL_PADDING = 10;

type Props = {
  leftOverflow: number,
  vertical: boolean,
  scale: number,
  negativeHeight: number,
  positiveHeight: number,
  containerWidth: number,
  chartHeight: number,
  labels: string[],
  labelHeight: number,
  labelFontSize: number,
  labelColor: string,
  labelRotation: number,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  onLayout: (e: LayoutEvent) => void,
};

export default class LabelCanvas extends React.PureComponent<Props> {
  calcLabelOffset = (index: number) => {
    const { vertical, thickness, spaceAround } = this.props;
    const [step, baseLine] = [index * (thickness + spaceAround) + spaceAround + thickness / 2, 0];
    return vertical
      ? {
          x: baseLine,
          y: step,
        }
      : {
          x: step,
          y: baseLine,
        };
  };

  calcCanvasProps = (x: number, y: number, width: number, height: number) => {
    const { vertical, scrollable } = this.props;
    return vertical
      ? {
          width: +height,
          height: scrollable ? width : '100%',
          viewBox: `${y} ${x} ${height} ${width}`,
        }
      : {
          width: scrollable ? width : '100%',
          height,
          viewBox: `${x} ${y} ${width} ${height}`,
        };
  };

  render() {
    const {
      leftOverflow,
      onLayout,
      labelHeight,
      containerWidth,
      labels,
      labelColor,
      labelFontSize,
      labelRotation,
    } = this.props;
    const canvasProps = this.calcCanvasProps(
      leftOverflow,
      -(labelHeight / 2 + LABEL_PADDING),
      containerWidth,
      labelHeight + LABEL_PADDING * 2,
    );
    return (
      <View style={styles.canvas}>
        <Svg {...canvasProps} x={leftOverflow} preserveAspectRatio="none">
          <LabelGroup
            data={labels}
            fontColor={labelColor}
            fontSize={labelFontSize}
            textRotation={labelRotation}
            getOffset={this.calcLabelOffset}
            onLayout={onLayout}
          />
        </Svg>
      </View>
    );
  }
}
