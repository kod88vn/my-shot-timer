
import { StyleSheet, Text, View, Button } from 'react-native';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts';

const MeterVisualizer = ({data} : any) =>  {
  // const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80, 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
  const axesSvg = { fontSize: 10, fill: 'grey' };
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 10;

  return (
    <View style={{ height: 200, width: 300, padding: 0, flexDirection: 'row' }}>
      <YAxis
        data={data}
        // min={-160}
        // max={0}
        style={{ marginBottom: xAxisHeight }}
        contentInset={verticalContentInset}
        svg={axesSvg}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <LineChart
          style={{ flex: 1 }}
          data={data}
          contentInset={verticalContentInset}
          svg={{ stroke: 'rgb(134, 65, 244)' }}
        >
          <Grid/>
        </LineChart>
        <XAxis
          style={{ marginHorizontal: -10, height: xAxisHeight }}
          data={data}
          formatLabel={() => ''}
          contentInset={{ left: 10, right: 10 }}
          svg={axesSvg}
        />
      </View>
    </View>
  );
}

export default MeterVisualizer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
