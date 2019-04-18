// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import values from 'lodash/values';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import max from 'lodash/max';
import min from 'lodash/min';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { DataType } from './Chart.types';
import styles from './Styles';
import BarCanvas from './BarCanvas';
import LabelCanvas from './LabelCanvas';
import LineCanvas from './LineCanvas';

export const ChartType = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
};

const ChartCanvas = {
  [ChartType.BAR]: BarCanvas,
  [ChartType.LINE]: LineCanvas,
};

type DefaultProps = {
  scrollable: boolean,
  vertical: boolean,
  showLabel: boolean,
  labelFontSize: number,
};

type Props = DefaultProps & {
  type: string,
  data: DataType,
  // eslint-disable-next-line react/no-unused-prop-types
  maxValue?: number,
  // eslint-disable-next-line react/no-unused-prop-types
  minValue?: number,
  thickness: number,
  spaceAround: number,
  scrollable?: boolean,
  coloring: string | string[],
  vertical?: boolean,
  labelColor: string,
  // clickable?: boolean,
  showLabel?: boolean,
  labelRotation: number,
  labelFontSize?: number,
};

type State = {
  positiveHeight: number,
  negativeHeight: number,
  labelHeight: number,
  scale: number,
  leftOverflow: number,
  rightOverflow: number,
};

export default class Chart extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    scrollable: true,
    vertical: false,
    // clickable: false,
    showLabel: true,
    labelFontSize: 14,
    maxValue: null,
    minValue: null,
  };

  state = {
    positiveHeight: 0,
    negativeHeight: 0,
    scale: 1,
    labelHeight: 0,
    leftOverflow: 0,
    rightOverflow: 0,
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

  handleCanvasLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height, width },
    } = nativeEvent;
    const { vertical } = this.props;
    const { positiveHeight, negativeHeight } = this.state;
    this.setState({ scale: (vertical ? width : height) / (positiveHeight - negativeHeight) });
  };

  handleLabelLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height, width, x, y },
    } = nativeEvent;
    const { vertical } = this.props;
    this.setState((state, props) => ({
      labelHeight: max([vertical ? width : height, state.labelHeight]),
      leftOverflow: min([vertical ? y : x, state.leftOverflow]),
      rightOverflow: max([
        state.leftOverflow +
          (vertical ? y + height : width + x) -
          (keys(props.data).length * (props.thickness + props.spaceAround) + props.spaceAround),
        state.rightOverflow,
      ]),
    }));
  };

  render() {
    const { props } = this;
    const { type, data, thickness, spaceAround, vertical, showLabel, scrollable } = props;
    const {
      positiveHeight,
      negativeHeight,
      labelHeight,
      leftOverflow,
      rightOverflow,
      scale,
    } = this.state;
    const chartHeight = scale * (positiveHeight - negativeHeight);
    const chartWidth = keys(data).length * (thickness + spaceAround) + spaceAround;
    const containerWidth = Math.abs(leftOverflow) + chartWidth + rightOverflow;
    const Canvas = ChartCanvas[type];
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal={!vertical}
        scrollEnabled={scrollable}
      >
        <View
          style={[
            styles.container,
            vertical && {
              flexDirection: 'row-reverse',
              alignItems: 'center',
            },
          ]}
        >
          <Canvas
            {...props}
            leftOverflow={leftOverflow}
            scale={scale}
            negativeHeight={negativeHeight}
            positiveHeight={positiveHeight}
            containerWidth={containerWidth}
            chartHeight={chartHeight}
            onLayout={this.handleCanvasLayout}
          />
          {showLabel ? (
            <LabelCanvas
              {...props}
              labels={keys(data)}
              leftOverflow={leftOverflow}
              scale={scale}
              negativeHeight={negativeHeight}
              positiveHeight={positiveHeight}
              containerWidth={containerWidth}
              chartHeight={chartHeight}
              labelHeight={labelHeight}
              onLayout={this.handleLabelLayout}
            />
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
