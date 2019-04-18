// @flow
import React from 'react';
import Bar from './Bar';
import type { CategoryType } from './Chart.types';

type DefaultProps = {
  textRotation: number,
};

type Props = DefaultProps & {
  data: CategoryType,
  color: string | string[],
  fontColor: string,
  fontSize: number,
  offset: { x: number, y: number },
  getValue: (
    index: number,
  ) => { value: number, height: number, width: number, offset: { x: number, y: number } },
  textRotation?: number,
};

export default class BarGroup extends React.PureComponent<Props> {
  static defaultProps = {
    textRotation: 0,
  };

  render() {
    const { data, color, getValue, fontSize, fontColor, textRotation, offset } = this.props;
    return (
      <>
        {Object.keys.call(data, data).map((key, index) => {
          const { height, width, value, offset: barOffset } = getValue(index);
          return (
            <Bar
              key={key}
              height={height}
              width={width}
              color={typeof color === 'string' ? color : color[index % color.length]}
              fontColor={fontColor}
              offset={{
                x: offset.x + barOffset.x,
                y: offset.y + barOffset.y,
              }}
              text={value.toString()}
              fontSize={fontSize}
              textRotation={textRotation}
            />
          );
        })}
      </>
    );
  }
}
