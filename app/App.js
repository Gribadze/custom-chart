/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import BarChart from './Components/BarChart';
import LineChart from './Components/LineChart';

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
  return (
    <View style={styles.container}>
      <BarChart data={data} coloring={['yellow', 'blue']} labelRotation={60} vertical />
      <LineChart data={data} coloring={['yellow', 'blue']} />
    </View>
  );
}
