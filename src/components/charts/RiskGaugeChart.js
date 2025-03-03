import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const RiskGaugeChart = ({ riskValue }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return; // Ensure chartDom is defined

    const myChart = echarts.init(chartDom);

    // Convert riskValue to a number between 0 and 1 (normal decimal value)
    let decimalValue = 0;
    if (typeof riskValue === 'string') {
      const value = parseFloat(riskValue.replace('%', ''));
      if (!isNaN(value)) {
        decimalValue = value / 100;
      } else {
        console.error('Invalid riskValue format:', riskValue);
      }
    } else if (typeof riskValue === 'number') {
      decimalValue = riskValue / 100;
    } else {
      console.error('Invalid riskValue type:', riskValue);
    }

    const option = {
      series: [
        {
          type: 'gauge',
          radius: '100%',
          startAngle: 180,
          endAngle: 0,
          splitNumber: 4, // Number of segments
          axisLine: {
            lineStyle: {
              width: 4,
              color: [
                [0.25, '#2E7D32'], // Green
                [0.5, '#43A047'], // Light Green
                [0.75, '#FFB300'], // Yellow
                [1, '#E53935'] // Red
              ]
            }
          },
          pointer: {
            show: true,
            length: '60%', // Reduced length of the pointer
            width: 2, // Reduced width of the pointer
            itemStyle: {
              color: '#000'
            }
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 3, // Reduced size of the anchor
            itemStyle: {
              color: '#000',
              borderColor: '#000',
              borderWidth: 1
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [{ value: decimalValue * 100 }] // Normal decimal value
        }
      ],
      // tooltip: {
      //   formatter: 'Risk Level: {c}'
      // }
    };

    // Update chart option
    myChart.setOption(option, true); // Set the second argument to true for merging options

    // Add resize listener
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      myChart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [riskValue]);

  return (
    <div
      ref={chartRef}
      style={{ width: '40px', height: '40px'}}
    />
  );
};

export default RiskGaugeChart;
