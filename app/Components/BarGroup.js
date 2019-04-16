// @flow
import React from 'react';
import Bar from './Bar';

type DefaultProps = {
  textRotation: number,
};

type Props = DefaultProps & {
  data: { [string]: number },
  color: string,
  fontColor: string,
  fontSize: number,
  getValue: (
    index: number,
  ) => { value: number, height: number, width: number, offset: { x: number, y: number } },
  textRotation?: number,
};

class BarGroup extends React.PureComponent<Props> {
  static defaultProps = {
    textRotation: 0,
  };

  render() {
    const { data, color, getValue, fontSize, fontColor, textRotation } = this.props;
    return (
      <>
        {Object.keys(data).map((key, index) => {
          const { height, width, offset, value } = getValue(index);
          return (
            <Bar
              key={key}
              height={height}
              width={width}
              color={color}
              fontColor={fontColor}
              offset={offset}
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

export default BarGroup;
