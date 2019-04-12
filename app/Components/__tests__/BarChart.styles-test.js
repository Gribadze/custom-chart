import styles from '../BarChart.styles';

it('BarChart styles should contain required props', () => {
  expect(styles).toBeDefined();
  expect(styles).toHaveProperty('container');
  expect(styles).toHaveProperty('contentContainer');
  expect(styles).toHaveProperty('canvas');
});
