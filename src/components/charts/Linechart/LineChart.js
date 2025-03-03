import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const colors = ['#5470C6', '#EE6666'];
    const option = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {},
      grid: {
        top: 40,
        bottom: 25
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[1]
            }
          },
          axisPointer: {
            label: {
              formatter: function (params) {
                return (
                  'Price  ' +
                  params.value +
                  (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                );
              }
            }
          },
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
           axisLabel: {
            color: '#5470C6' 
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#5470C6' // Change color of x-axis line if needed
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value} Cr', // Format to display in crores
          },
          interval: 0.5, // Set the interval for y-axis labels
          min: 0, // Minimum value
          max: 3.5 // Maximum value (adjust based on your data range)
        }
      ],
      series: [
        {
          name: 'Home Price',
          type: 'line',
          smooth: true,
          emphasis: {
            focus: 'series'
          },
          data: [2.0, 2.2, 2.3, 2.1, 2.05, 2.33, 2.23, 2.2, 2.45, 2.1, 2.0, 2.3]// Example data in crores
        },
        {
          name: 'Area Price',
          type: 'line',
          smooth: true,
          emphasis: {
            focus: 'series'
          },
          data: [2.1, 2.3, 2.4, 2.2, 2.15, 2.43, 2.33, 2.3, 2.5, 2.2, 2.1, 2.4]// Example data in crores
        }
      ]
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '265px' }} />
  );
};

export default LineChart;
