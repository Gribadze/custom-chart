// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import keys from 'lodash/keys';
import max from 'lodash/max';
import min from 'lodash/min';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import type { DataType } from './Chart.types';
import styles from './Styles';
import BarCanvas from './BarCanvas';
import LabelCanvas from './LabelCanvas';
import LineCanvas from './LineCanvas';
import PieCanvas from './PieCanvas';

export const ChartType = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
};

const ChartCanvas = {
  [ChartType.BAR]: BarCanvas,
  [ChartType.LINE]: LineCanvas,
  [ChartType.PIE]: PieCanvas,
};

type DefaultProps = {
  scrollable: boolean,
  vertical: boolean,
  showLabel: boolean,
  labelFontSize: number,
  thickness: number,
  spaceAround: number,
};

type Props = DefaultProps & {
  type: string,
  data: DataType,
  maxValue: number | null,
  minValue: number | null,
  thickness?: number,
  spaceAround?: number,
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
  labelHeight: number,
  leftOverflow: number,
  rightOverflow: number,
  canvasWidth: number | null,
  canvasHeight: number | null,
};

export default class Chart extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    scrollable: true,
    vertical: false,
    thickness: 0,
    spaceAround: 0,
    // clickable: false,
    showLabel: true,
    labelFontSize: 14,
  };

  state = {
    labelHeight: 0,
    leftOverflow: 0,
    rightOverflow: 0,
    canvasWidth: null,
    canvasHeight: null,
  };

  handleCanvasLayout = ({ nativeEvent }: LayoutEvent) => {
    const {
      layout: { height, width },
    } = nativeEvent;
    this.setState({
      canvasWidth: width,
      canvasHeight: height,
    });
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
    const { type, data, vertical, showLabel, scrollable } = props;
    const { labelHeight, leftOverflow, rightOverflow, canvasWidth, canvasHeight } = this.state;
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
            rightOverflow={rightOverflow}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            onLayout={this.handleCanvasLayout}
          />
          {showLabel ? (
            <LabelCanvas
              {...props}
              labels={keys(data)}
              leftOverflow={leftOverflow}
              rightOverflow={rightOverflow}
              labelHeight={labelHeight}
              onLayout={this.handleLabelLayout}
            />
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
