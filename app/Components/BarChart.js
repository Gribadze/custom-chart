// @flow
import React from 'react';
import { ScrollView, View } from 'react-native';
import type { LayoutEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { Svg } from 'react-native-svg';
import styles from './BarChart.styles';
import LabelGroup from './LabelGroup';
import BarGroup from './BarGroup';

const LABEL_PADDING = 10;

type DefaultProps = {
  getValue: (key: string, value: number, index?: number) => number,
  getLabel: (key: string, value?: number, index?: number) => string,
  thickness: number,
  spaceAround: number,
  scrollable: boolean,
  coloring: string,
  vertical: boolean,
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
  vertical?: boolean,
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
  scale: number,
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
    vertical: false,
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
    scale: 1,
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

  calcBarRect = (scale: number) => (index: number) => {
    const { data, thickness, spaceAround, vertical, getValue } = this.props;
    const [key, value] = Object.entries(data)[index];
    const currentValue = getValue(key, +value, index);
    const scaledValue = scale * currentValue;
    const step = index * (thickness + spaceAround) + spaceAround;
    return {
      value: currentValue,
      ...(vertical
        ? {
            offset: {
              x: scaledValue < 0 ? scaledValue : 0,
              y: step,
            },
            height: thickness,
            width: scaledValue,
          }
        : {
            offset: {
              x: step,
              y: scaledValue > 0 ? -scaledValue : 0,
            },
            height: scaledValue,
            width: thickness,
          }),
    };
  };

  calcCanvasProps = (
    x: number,
    y: number,
    width: number,
    height: number,
    fullSize?: boolean = false,
  ) => {
    const { vertical, scrollable } = this.props;
    return vertical
      ? {
          width: fullSize ? '100%' : height,
          height: scrollable ? width : '100%',
          viewBox: `${y} ${x} ${height} ${width}`,
        }
      : {
          width: scrollable ? width : '100%',
          height: fullSize ? '100%' : height,
          viewBox: `${x} ${y} ${width} ${height}`,
        };
  };

  render() {
    const {
      data,
      thickness,
      spaceAround,
      coloring,
      vertical,
      labelColor,
      labelRotation,
      labelFontSize,
      showLabel,
      scrollable,
      getLabel,
    } = this.props;
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
          <View style={[styles.canvas, styles.container]}>
            <Svg
              {...this.calcCanvasProps(
                leftOverflow,
                vertical ? scale * negativeHeight : -scale * positiveHeight,
                containerWidth,
                chartHeight,
                true,
              )}
              preserveAspectRatio="none"
              onLayout={this.handleCanvasLayout}
            >
              <BarGroup
                data={data}
                color={coloring}
                getValue={this.calcBarRect(scale)}
                fontSize={labelFontSize}
                fontColor={labelColor}
                // textRotation={labelRotation}
              />
            </Svg>
          </View>
          {showLabel ? (
            <View style={styles.canvas}>
              <Svg
                {...this.calcCanvasProps(
                  leftOverflow,
                  -(labelHeight / 2 + LABEL_PADDING),
                  containerWidth,
                  labelHeight + LABEL_PADDING * 2,
                )}
                x={leftOverflow}
                preserveAspectRatio="none"
              >
                <LabelGroup
                  data={data}
                  fontColor={labelColor}
                  fontSize={labelFontSize}
                  textRotation={labelRotation}
                  getLabel={getLabel}
                  getOffset={this.calcLabelOffset}
                  onLayout={this.handleLabelLayout}
                />
              </Svg>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
