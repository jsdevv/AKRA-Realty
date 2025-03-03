import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AgePieChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const option = {
            title: {
                text: 'Views-Age Distribution',
                left: 'center',
                top: '4%',
                textStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{d}%' // Tooltip format
            },
            legend: {
                
                bottom: '0%', // Align the legend to the left
                orient: 'horizontal', // Stack legend items vertically
                itemGap: 10,
                formatter: (name) => name,
                textStyle: {
                    fontSize: 10
                }
            },
            series: [
                {
                    name: 'Age Groups',
                    type: 'pie',
                    radius: ['30%', '45%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: true, // Enable labels
                        formatter: '{d}%', // Format label to show percentage
                        position: 'outside' // Position label outside of the pie slices
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '10',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: true // Show label lines
                    },
                    data: data
                }
            ]
        };

        chart.setOption(option);

        const handleResize = () => chart.resize();

        window.addEventListener('resize', handleResize);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [data]);

    return (
        <div
            ref={chartRef}
            style={{
                width: '100%',
                height: '250px',
            }}
        />
    );
};

export default AgePieChart;
