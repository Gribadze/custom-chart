/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Line, Svg } from 'react-native-svg';
import BarChart from './Components/BarChart';
import LineChart from './Components/LineChart';
import Pie from './Components/Chart/Pie';

const data = {
  January: { '2018': -20, '2019': -25 },
  February: { '2018': -10, '2019': -15 },
  March: { '2018': 3, '2019': -5 },
  April: { '2018': 10, '2019': 5 },
  May: { '2018': 15, '2019': 20 },
  June: { '2018': 20, '2019': 25 },
  July: { '2018': 25, '2019': 25 },
  August: { '2018': 20, '2019': 30 },
  September: { '2018': 15, '2019': 25 },
  October: { '2018': 10, '2019': 5 },
  November: { '2018': -10, '2019': -5 },
  December: { '2018': -20, '2019': -25 },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default function App() {
  const d = {
    Male: 0.33,
    Female: 0.45,
    Bot: 0.22,
  };
  const r = 150;
  return (
    <View style={styles.container}>
      <BarChart data={data} coloring={['yellow', 'blue']} labelRotation={60} vertical />
      <LineChart data={data} coloring={['green', 'cyan']} />
      <Svg width="100%" height="100%" viewBox="-200 -200 500 500">
        <Pie
          radius={r}
          offset={0}
          part={d.Male}
          text="Male"
          textRotation={60}
          fontColor="black"
          fontSize={14}
          color="cyan"
        />
        <Pie
          radius={r}
          offset={d.Male}
          part={d.Female}
          text="Female"
          textRotation={60}
          fontColor="black"
          fontSize={14}
          color="magenta"
        />
        <Pie
          radius={r}
          offset={d.Male + d.Female}
          part={d.Bot}
          text="Bot"
          textRotation={60}
          fontColor="black"
          fontSize={14}
          color="silver"
        />
        <Line x1={-200} y1={0} x2={300} y2={0} stroke="silver" />
        <Line x1={0} y1={-200} x2={0} y2={300} stroke="silver" />
      </Svg>
    </View>
  );
}
