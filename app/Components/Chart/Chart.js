// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
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
  getValue: (key: string, value: number, index?: number) => number,
  getLabel: (key: string, value?: number, index?: number) => string,
  scrollable: boolean,
  vertical: boolean,
  showLabel: boolean,
  labelFontSize: number,
};

type Props = DefaultProps & {
  type: string,
  data: { [key: string]: { [category: string]: number } },
  getValue?: (key: string, value: number, index?: number) => number,
  getLabel?: (key: string, value?: number, index?: number) => string,
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
    getValue: (key: string, value: mixed) => +value,
    getLabel: (key: string) => key,
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
    const positiveHeight = Object.values(props.data).reduce((acc, category) => {
      return Math.max(acc, ...Object.values(category).map(value => +value));
    }, props.maxValue || 0);
    const negativeHeight = Object.values(props.data).reduce((acc, category) => {
      return Math.min(acc, ...Object.values(category).map(value => +value));
    }, props.minValue || 0);
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
      labelHeight: Math.max(vertical ? width : height, state.labelHeight),
      leftOverflow: Math.min(vertical ? y : x, state.leftOverflow),
      rightOverflow: Math.max(
        state.leftOverflow +
          (vertical ? y + height : width + x) -
          (Object.keys(props.data).length * (props.thickness + props.spaceAround) +
            props.spaceAround),
        state.rightOverflow,
      ),
    }));
  };

  render() {
    const { type, data, thickness, spaceAround, vertical, showLabel, scrollable } = this.props;
    const {
      positiveHeight,
      negativeHeight,
      labelHeight,
      leftOverflow,
      rightOverflow,
      scale,
    } = this.state;
    const chartHeight = scale * (positiveHeight - negativeHeight);
    const chartWidth = Object.keys(data).length * (thickness + spaceAround) + spaceAround;
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
            {...this.props}
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
              {...this.props}
              labels={Object.keys(data)}
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
