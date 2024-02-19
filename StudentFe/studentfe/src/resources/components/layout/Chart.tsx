'use client';

import React, { useState, useEffect } from 'react';
import { Chart as PrimeChart } from 'primereact/chart';
import { PointParamType, PointType } from '@assets/interface';
import { useGetList } from '@assets/hooks/useGet';

const Chart = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const pointQuery = useGetList<PointType, PointParamType>({
        module: 'point_by_thesis',
        params: {
            isGetPointMe: true,
        },
    });

    useEffect(() => {
        if (pointQuery.response?.data && pointQuery.response?.data.length > 0) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            const data = {
                labels: pointQuery?.response?.data?.[0].scores?.map((t) => t.teacher.name),
                datasets: [
                    {
                        label: 'Kết quả',
                        backgroundColor: pointQuery.response?.data?.[0].scores?.map((score) =>
                            score.type === 'R'
                                ? documentStyle.getPropertyValue('--blue-600')
                                : score.type === 'I'
                                ? documentStyle.getPropertyValue('--green-500')
                                : documentStyle.getPropertyValue('--bluegray-800'),
                        ),
                        borderColor: pointQuery.response?.data?.[0].scores?.map((score) =>
                            score.type === 'R'
                                ? documentStyle.getPropertyValue('--blue-600')
                                : score.type === 'I'
                                ? documentStyle.getPropertyValue('--green-500')
                                : documentStyle.getPropertyValue('--bluegray-800'),
                        ),
                        data: pointQuery?.response?.data?.[0].scores?.map((t) => t.score),
                    },
                ],
            };

            const options = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            fontColor: textColor,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500,
                            },
                        },
                        grid: {
                            display: false,
                            drawBorder: false,
                        },
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary,
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false,
                        },
                    },
                },
            };

            setChartData(data);
            setChartOptions(options);
        }
    }, [pointQuery.response?.data]);

    return <PrimeChart type='bar' data={chartData} options={chartOptions} />;
};

export default Chart;
