// @format
// @flow
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart as RNSVGBarChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
import { Svg, Text as SvgText } from 'react-native-svg';
import Bar from './Bar';

type BarChartProps = {
  data: Object,
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
  canvasHeight: number,
  canvasWidth: number,
}

export class BarChart extends Component<BarChartProps, BarChartState> {
  static defaultProps = {
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
    canvasHeight: 0,
    canvasWidth: 0,
  };

  static getDerivedStateFromProps(props: BarChartProps) {
    return {
      canvasHeight: props.data.reduce((acc, item) => (acc > item ? acc : item), 0),
      canvasWidth: props.data.length * (props.thickness + props.spaceAround) + props.spaceAround,
    }
  }

  handleCanvasPress = (...args) => {
    console.log('Pressed', args);
  };

  render() {
    const {
      data, thickness, horizontal, spaceAround, coloring, labelColor, labelRotation, showLabel, scrollable,
    } = this.props;
    const { canvasHeight, canvasWidth } = this.state;
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
            height={canvasHeight}
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            preserveAspectRatio="xMinYMin slice"
          >
            {data.map((item, index) => (
              <Bar
                key={index}
                height={item}
                width={thickness}
                offset={{ x: index * (thickness + spaceAround) + spaceAround, y: canvasHeight - item }}
              />
            ))}
            <SvgText
              fill="black"
              fontSize={10}
              fontWeight="bold"
              textAnchor="middle"
              x={50}
              y={50}
            >
              Hello
            </SvgText>
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

