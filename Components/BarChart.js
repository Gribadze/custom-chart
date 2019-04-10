// @format
// @flow
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { G, Svg, Text as SvgText } from 'react-native-svg';
import Bar from './Bar';

const LABEL_PADDING = 10;
const FONT_SIZE = 14;

type BarChartProps = {
  data: Object,
  getValue?: () => number,
  getLabel?: () => string,
  maxValue?: ?number,
  minValue?: ?number,
  thickness?: number,
  spaceAround?: number,
  scrollable?: boolean,
  coloring?: string,
  horizontal?: boolean,
  labelColor?: string,
  clickable?: boolean,
  showLabel?: boolean,
  labelRotation?: number,
};

type BarChartState = {
  positiveHeight: number,
  negativeHeight: number,
  labelHeight: number,
  containerHeight: number,
  chartHeight: number,
  chartWidth: number,
  leftOverflow: number,
  rightOverflow: number,
}

export class BarChart extends Component<BarChartProps, BarChartState> {
  static defaultProps = {
    getValue: item => item,
    getLabel: (item, index) => index,
    thickness: 40,
    spaceAround: 5,
    scrollable: true,
    coloring: '#3498DB',
    horizontal: false,
    labelColor: '#000000',
    clickable: false,
    showLabel: true,
    labelRotation: 90,
  };

  state = {
    positiveHeight: 0,
    negativeHeight: 0,
    labelHeight: 0,
    containerHeight: 0,
    chartHeight: 0,
    chartWidth: 0,
    leftOverflow: 0,
    rightOverflow: 0,
  };

  static getDerivedStateFromProps(props: BarChartProps) {
    const positiveHeight = props.data.reduce((acc, item, index) => {
      const value = props.getValue(item, index);
      return (acc > value ? acc : value)
    }, 0);
    const negativeHeight = Math.abs(props.data.reduce((acc, item, index) => {
      const value = props.getValue(item, index);
      return (acc < value ? acc : value);
    }, 0));
    return {
      positiveHeight,
      negativeHeight,
      chartHeight: positiveHeight + negativeHeight,
      chartWidth: props.data.length * (props.thickness + props.spaceAround) + props.spaceAround,
    }
  }

  handleCanvasLayout = ({ nativeEvent }) => {
    const { layout: { height, width } } = nativeEvent;
    console.log('CanvasLayout', width);
    this.setState({ containerHeight: height });
  };

  handleLabelLayout = ({ nativeEvent }) => {
    const { layout: { height, width, x } } = nativeEvent;
    const { chartWidth, labelHeight, leftOverflow, rightOverflow } = this.state;
    let newState = {};
    if (labelHeight < height) {
      newState.labelHeight = height;
    }
    if (leftOverflow > x) {
      newState.leftOverflow = x;
    }
    if (rightOverflow < (x + width) - chartWidth + leftOverflow) {
      newState.rightOverflow = (x + width) - chartWidth + leftOverflow;
    }
    console.log('LabelLayout', newState);
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  };

  render() {
    const {
      data, thickness, spaceAround, coloring, labelColor, labelRotation, showLabel, scrollable, getValue, getLabel,
    } = this.props;
    const { positiveHeight, chartWidth, chartHeight, labelHeight, leftOverflow, rightOverflow } = this.state;
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
            viewBox={`${leftOverflow} 0 ${chartWidth + rightOverflow} ${chartHeight + labelHeight + LABEL_PADDING * 2}`}
            preserveAspectRatio="xMinYMax meet"
          >
            {data.map((item, index) => (
              <React.Fragment
                key={index}
              >
                <Bar
                  height={getValue(item, index)}
                  width={thickness}
                  color={coloring}
                  offset={{
                    x: index * (thickness + spaceAround) + spaceAround,
                    y: positiveHeight - (item > 0 ? item : 0)
                  }}
                />
                {showLabel
                  ? (
                    <G
                      origin={`${index * (thickness + spaceAround) + spaceAround + thickness / 2}, ${chartHeight + LABEL_PADDING + labelHeight / 2}`}
                      rotation={labelRotation}
                      onLayout={this.handleLabelLayout}
                    >
                      <SvgText
                        fill={labelColor}
                        fontSize={FONT_SIZE}
                        textAnchor="middle"
                        x={index * (thickness + spaceAround) + spaceAround + thickness / 2}
                        y={chartHeight + LABEL_PADDING + (FONT_SIZE + labelHeight) / 2}
                      >
                        {getLabel(item, index)}
                      </SvgText>
                    </G>
                  )
                  : null
                }
              </React.Fragment>
            ))}
          </Svg>
        </View>
      </ScrollView>
    );
  }
}

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
  }
});

