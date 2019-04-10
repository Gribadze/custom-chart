// @format
// @flow
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart as RNSVGBarChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { G, Svg, Text as SvgText } from 'react-native-svg';
import Bar from './Bar';

type BarChartProps = {
  data: Object,
  getValue?: () => number,
  getLabel?: () => string,
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
  canvasWidth: number,
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
    canvasWidth: 0,
  };

  static getDerivedStateFromProps(props: BarChartProps) {
    return {
      positiveHeight: props.data.reduce((acc, item, index) => {
        const value = props.getValue(item, index);
        return (acc > value ? acc : value)
      }, 0),
      negativeHeight: Math.abs(props.data.reduce((acc, item, index) => {
        const value = props.getValue(item, index);
        return (acc < value ? acc : value);
      }, 0)),
      canvasWidth: props.data.length * (props.thickness + props.spaceAround) + props.spaceAround,
    }
  }

  handleLayout = ({ nativeEvent }) => {
    const { layout: { height } } = nativeEvent;
    const { labelHeight } = this.state;
    console.log('Layout', labelHeight, height);
    if (labelHeight < height) {
      this.setState({ labelHeight: height });
    }
  };

  render() {
    const {
      data, thickness, horizontal, spaceAround, coloring, labelColor, labelRotation, showLabel, scrollable, getValue, getLabel,
    } = this.props;
    const { positiveHeight, negativeHeight, canvasWidth, labelHeight } = this.state;
    const canvasHeight = positiveHeight + negativeHeight;
    const LABEL_PADDING = 10;
    const FONT_SIZE = 14;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        horizontal
        scrollEnabled={scrollable}
      >
        <View style={styles.canvas}>
          <Svg
            width={canvasWidth}
            height="100%"
            viewBox={`0 0 ${canvasWidth} ${canvasHeight + labelHeight + LABEL_PADDING * 2}`}
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
                  offset={{ x: index * (thickness + spaceAround) + spaceAround, y: positiveHeight - (item > 0 ? item : 0) }}
                />
                {showLabel
                  ? (
                    <G
                      origin={`${index * (thickness + spaceAround) + spaceAround + thickness / 2}, ${canvasHeight + LABEL_PADDING + labelHeight / 2}`}
                      rotation={labelRotation}
                      onLayout={this.handleLayout}
                    >
                      <SvgText
                        fill={labelColor}
                        fontSize={FONT_SIZE}
                        textAnchor="middle"
                        x={index * (thickness + spaceAround) + spaceAround + thickness / 2}
                        y={canvasHeight + LABEL_PADDING + (FONT_SIZE + labelHeight) / 2}
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
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  contentContainer: {
    flexGrow: 1,
  },
  canvas: {
    flex: 1,
    justifyContent: 'flex-end',
    // height: 200,
    // width: 300,
  }
});

