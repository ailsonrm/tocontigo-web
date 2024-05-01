import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styled from 'styled-components';

const CustomChartsContainer = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 220px;
  flex: 2;

  @media (max-width: 470px) {
    height: auto;
  }
`;

const NeighborhoodChart = ({ data }) => {
  Chart.register(ChartDataLabels);

  const barConfig = {
    labels: data.labels,
    datasets: [
      {
        label: 'Bairro',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    //indexAxis: 'y',
    plugins: {
      legend: {
        display: false // Oculta a legenda para o gráfico de barras se desejado
      },
      title: {
        display: true,
        text: '\u00A0Votos por Bairro',
        align: 'start',
        padding: 10
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <CustomChartsContainer>
      <Bar data={barConfig} options={barOptions} />
    </CustomChartsContainer>
  );
};

export default NeighborhoodChart;
