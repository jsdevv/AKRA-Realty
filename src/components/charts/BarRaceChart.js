import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarRaceChart = ({ data, height = '250px', barWidth = '38%' }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        // Prepare data
        const categories = data.map(item => item.name);
        const values = data.map(item => item.value);

        // Chart option
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                }
            },
    
            xAxis: {
                type: 'value',
                name: '',
                nameLocation: 'end',
                nameGap: 25,
                axisLabel: {
                    fontSize: 10
                }
            },
            yAxis: {
                type: 'category',
                data: categories,
                name: 'Views-Category',
                nameLocation: 'end',
                nameGap: 10,
                axisLabel: {
                    fontSize: 10,
                    overflow: 'break',
                    rotate: 0
                },
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    name: 'Value',
                    type: 'bar',
                    data: values,
                    barWidth: barWidth, // Adjust bar width here
                    label: {
                        show: true,
                        position: 'right',
                        fontSize: 10,
                        formatter: '{c}'
                    },
                    itemStyle: {
                        color: '#5470C6'
                    },
                    animationDuration: 2000,
                    animationEasing: 'cubicOut',
                }
            ],
            grid: {
                left: '2%',
                right: '10%',
                top: '15%',
                bottom: '10%',
                containLabel: true
            }
        };

        chart.setOption(option);

        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [data, barWidth]);

    return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default BarRaceChart;
