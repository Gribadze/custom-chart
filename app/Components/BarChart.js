// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { Svg } from 'react-native-svg';
import styles from './BarChart.styles';
import Bar from './Bar';
import Label from './Label';

const LABEL_PADDING = 10;

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
  labelFontSize: number,
};

type Props = DefaultProps & {
  data: { [string]: number },
  getValue?: (key: string, value: number, index?: number) => number,
  getLabel?: (key: string, value?: number, index?: number) => string,
  // eslint-disable-next-line react/no-unused-prop-types
  maxValue?: number,
  // eslint-disable-next-line react/no-unused-prop-types
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
  labelFontSize?: number,
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
    labelFontSize: 14,
    maxValue: null,
    minValue: null,
  };

  state = {
    positiveHeight: 0,
    negativeHeight: 0,
    yScale: 1,
    labelHeight: 0,
    leftOverflow: 0,
    rightOverflow: 0,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
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
      labelHeight: Math.max(props.labelFontSize, state.labelHeight),
    };
  }

  handleCanvasLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height },
    } = nativeEvent;
    const { positiveHeight, negativeHeight } = this.state;
    this.setState({ yScale: height / (positiveHeight - negativeHeight) });
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
      labelFontSize,
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
    const containerWidth = Math.abs(leftOverflow) + chartWidth + rightOverflow;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal
        scrollEnabled={scrollable}
      >
        <View style={styles.container}>
          <View style={[styles.canvas, styles.container]}>
            <Svg
              width={scrollable ? containerWidth : '100%'}
              height="100%"
              viewBox={`${leftOverflow} ${-yScale *
                positiveHeight} ${containerWidth} ${chartHeight}`}
              preserveAspectRatio="xMidYMid meet"
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
                      y: currentValue > 0 ? -currentValue : 0,
                    }}
                  />
                );
              })}
            </Svg>
          </View>
          {showLabel ? (
            <View style={styles.canvas}>
              <Svg
                width={scrollable ? containerWidth : '100%'}
                height={labelHeight + LABEL_PADDING * 2}
                viewBox={`${0} ${-LABEL_PADDING - labelHeight / 2} ${containerWidth} ${labelHeight +
                  LABEL_PADDING * 2}`}
                preserveAspectRatio="xMidYMid slice"
              >
                {Object.entries(data).map(([key, value], index) => (
                  <Label
                    key={key}
                    color={labelColor}
                    fontSize={labelFontSize}
                    text={getLabel(key, +value, index)}
                    offset={{
                      x:
                        index * (thickness + spaceAround) +
                        spaceAround +
                        thickness / 2 -
                        (labelFontSize / 3) * Math.sin((labelRotation * Math.PI) / 180),
                      y: (labelFontSize / 3) * Math.cos((labelRotation * Math.PI) / 180),
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
