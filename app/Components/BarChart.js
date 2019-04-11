// @format
// @flow
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { G, Svg, Text as SvgText } from 'react-native-svg/index';
import Bar from './Bar';

const LABEL_PADDING = 10;
const FONT_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  canvas: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  svg: {
    backgroundColor: 'silver',
  },
});

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
  maxValue: null,
  minValue: null,
};

type Props = DefaultProps & {
  data: { [string]: number },
  getValue?: (key: string, value: number, index?: number) => number,
  getLabel?: (key: string, value?: number, index?: number) => string,
  maxValue?: number | null,
  minValue?: number | null,
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
  // chartHeight: number,
  chartWidth: number,
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
    labelHeight: 0,
    yScale: 1,
    // chartHeight: 0,
    chartWidth: 0,
    leftOverflow: 0,
    rightOverflow: 0,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { yScale } = state;
    const positiveHeight =
      yScale *
      Object.entries(props.data).reduce((acc, [key, value], index) => {
        const currentValue = props.getValue(key, +value, index);
        return acc > currentValue ? acc : currentValue;
      }, 0);
    const negativeHeight =
      yScale *
      Math.abs(
        Object.entries(props.data).reduce((acc, [key, value], index) => {
          const currentValue = props.getValue(key, +value, index);
          return acc < currentValue ? acc : currentValue;
        }, 0),
      );
    return {
      positiveHeight,
      negativeHeight,
      // chartHeight:
      //   props.maxValue !== null && props.minValue !== null
      //     ? yScale * (props.maxValue - props.minValue)
      //     : positiveHeight + negativeHeight,
      chartWidth:
        Object.keys(props.data).length * (props.thickness + props.spaceAround) + props.spaceAround,
    };
  }

  handleCanvasLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height },
    } = nativeEvent;
    const { maxValue, minValue } = this.props;
    const { positiveHeight, negativeHeight, labelHeight } = this.state;
    const chartHeight = (maxValue || positiveHeight) - (minValue || -negativeHeight);
    this.setState({ yScale: chartHeight / (height - labelHeight - LABEL_PADDING * 2) });
  };

  handleLabelLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height, width, x },
    } = nativeEvent;
    const { chartWidth, labelHeight, leftOverflow, rightOverflow } = this.state;
    const newState = {};
    if (labelHeight < height) {
      newState.labelHeight = height;
    }
    if (leftOverflow > x) {
      newState.leftOverflow = x;
    }
    if (rightOverflow < x + width - chartWidth + leftOverflow) {
      newState.rightOverflow = x + width - chartWidth + leftOverflow;
    }
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
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
      maxValue,
      minValue,
    } = this.props;
    const {
      positiveHeight,
      negativeHeight,
      chartWidth,
      // chartHeight,
      labelHeight,
      leftOverflow,
      rightOverflow,
      yScale,
    } = this.state;
    const chartHeight = (maxValue || positiveHeight) - (minValue || -negativeHeight);
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal
        scrollEnabled={scrollable}
        onLayout={this.handleCanvasLayout}
      >
        <View style={styles.canvas}>
          <Svg
            style={styles.svg}
            width={Math.abs(leftOverflow) + chartWidth + rightOverflow}
            height="100%"
            viewBox={`${leftOverflow} 0 ${chartWidth + rightOverflow} ${chartHeight +
              labelHeight +
              LABEL_PADDING * 2}`}
            preserveAspectRatio="xMinYMax meet"
          >
            {Object.entries(data).map(([key, value], index) => {
              const currentValue = getValue(key, +value, index);
              return (
                <React.Fragment key={key}>
                  <Bar
                    height={currentValue}
                    width={thickness}
                    color={coloring}
                    offset={{
                      x: index * (thickness + spaceAround) + spaceAround,
                      y: yScale * positiveHeight - (currentValue > 0 ? currentValue : 0),
                    }}
                  />
                  {showLabel ? (
                    <G
                      origin={`${index * (thickness + spaceAround) +
                        spaceAround +
                        thickness / 2}, ${yScale * chartHeight + LABEL_PADDING + labelHeight / 2}`}
                      rotation={labelRotation}
                      onLayout={this.handleLabelLayout}
                    >
                      <SvgText
                        fill={labelColor}
                        fontSize={FONT_SIZE}
                        textAnchor="middle"
                        x={index * (thickness + spaceAround) + spaceAround + thickness / 2}
                        y={yScale * chartHeight + LABEL_PADDING + (FONT_SIZE + labelHeight) / 2}
                      >
                        {getLabel(key, +value, index)}
                      </SvgText>
                    </G>
                  ) : null}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>
    );
  }
}
