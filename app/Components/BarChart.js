// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { Svg } from 'react-native-svg';
import styles from './BarChart.styles';
import Bar from './Bar';
import Label from './Label';

const LABEL_PADDING = 10;
const FONT_SIZE = 14;

type DefaultProps = {
  getValue: (key: string, value: number, index?: number) => number,
  getLabel: (key: string, value?: number, index?: number) => string,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  coloring: string,
  labelColor: string,
  showLabel: boolean,
  labelRotation: number,
};

type Props = DefaultProps & {
  data: { [string]: number },
  getValue?: (key: string, value: number, index?: number) => number,
  getLabel?: (key: string, value?: number, index?: number) => string,
  maxValue?: number,
  minValue?: number,
  thickness?: number,
  spaceAround?: number,
  scrollable?: boolean,
  coloring?: string,
  // horizontal?: boolean,
  labelColor?: string,
  // clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: number,
};

type State = {
  positiveHeight: number,
  negativeHeight: number,
  labelHeight: number,
  yScale: number,
  leftOverflow: number,
  rightOverflow: number,
};

export default class BarChart extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    getValue: (key: string, value: mixed) => +value,
    getLabel: (key: string) => key,
    thickness: 40,
    spaceAround: 5,
    scrollable: true,
    coloring: '#3498DB',
    // horizontal: false,
    labelColor: '#000000',
    // clickable: false,
    showLabel: true,
    labelRotation: 90,
    maxValue: null,
    minValue: null,
  };

  state = {
    positiveHeight: 0,
    negativeHeight: 0,
    labelHeight: FONT_SIZE,
    yScale: 1,
    leftOverflow: 0,
    rightOverflow: 0,
  };

  static getDerivedStateFromProps(props: Props) {
    const positiveHeight = Object.entries(props.data).reduce((acc, [key, value], index) => {
      const currentValue = props.getValue(key, +value, index);
      return acc > currentValue ? acc : currentValue;
    }, props.maxValue || 0);
    const negativeHeight = Object.entries(props.data).reduce((acc, [key, value], index) => {
      const currentValue = props.getValue(key, +value, index);
      return acc < currentValue ? acc : currentValue;
    }, props.minValue || 0);
    return {
      positiveHeight,
      negativeHeight,
    };
  }

  handleCanvasLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height },
    } = nativeEvent;
    const { maxValue, minValue } = this.props;
    const { positiveHeight, negativeHeight } = this.state;
    const chartHeight = (maxValue || positiveHeight) - (minValue || negativeHeight);
    this.setState({ yScale: height / chartHeight });
  };

  handleLabelLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height, width, x },
    } = nativeEvent;
    this.setState((state, props) => ({
      labelHeight: Math.max(height, state.labelHeight),
      leftOverflow: Math.min(x, state.leftOverflow),
      rightOverflow: Math.max(
        state.leftOverflow +
          x +
          width -
          (Object.keys(props.data).length * (props.thickness + props.spaceAround) +
            props.spaceAround),
        state.rightOverflow,
      ),
    }));
  };

  render() {
    const {
      data,
      thickness,
      spaceAround,
      coloring,
      labelColor,
      labelRotation,
      showLabel,
      scrollable,
      getValue,
      getLabel,
    } = this.props;
    const {
      positiveHeight,
      negativeHeight,
      labelHeight,
      leftOverflow,
      rightOverflow,
      yScale,
    } = this.state;
    const chartHeight = yScale * (positiveHeight - negativeHeight);
    const chartWidth = Object.keys(data).length * (thickness + spaceAround) + spaceAround;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal
        scrollEnabled={scrollable}
      >
        <View style={{ flex: 1 }}>
          <View style={[styles.canvas, { flex: 1 }]}>
            <Svg
              width={Math.abs(leftOverflow) + chartWidth + rightOverflow}
              height="100%"
              viewBox={`${leftOverflow} 0 ${Math.abs(leftOverflow) + chartWidth} ${chartHeight}`}
              preserveAspectRatio="xMinYMax meet"
              onLayout={this.handleCanvasLayout}
            >
              {Object.entries(data).map(([key, value], index) => {
                const currentValue = yScale * getValue(key, +value, index);
                return (
                  <Bar
                    key={key}
                    height={currentValue}
                    width={thickness}
                    color={coloring}
                    offset={{
                      x: index * (thickness + spaceAround) + spaceAround,
                      y: yScale * positiveHeight - (currentValue > 0 ? currentValue : 0),
                    }}
                  />
                );
              })}
            </Svg>
          </View>
          {showLabel ? (
            <View style={styles.canvas}>
              <Svg
                width={Math.abs(leftOverflow) + chartWidth + rightOverflow}
                height={labelHeight + LABEL_PADDING * 2}
                viewBox={`${leftOverflow} ${-LABEL_PADDING - labelHeight / 2} ${chartWidth +
                  rightOverflow} ${labelHeight + LABEL_PADDING * 2}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {Object.entries(data).map(([key, value], index) => (
                  <Label
                    key={key}
                    color={labelColor}
                    fontSize={FONT_SIZE}
                    text={getLabel(key, +value, index)}
                    offset={{
                      x:
                        index * (thickness + spaceAround) +
                        spaceAround +
                        thickness / 2 -
                        (FONT_SIZE / 3) * Math.sin((labelRotation * Math.PI) / 180),
                      y: (FONT_SIZE / 3) * Math.cos((labelRotation * Math.PI) / 180),
                    }}
                    rotation={labelRotation}
                    onLayout={this.handleLabelLayout}
                  />
                ))}
              </Svg>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
