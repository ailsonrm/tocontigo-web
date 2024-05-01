import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { FaRestroom } from 'react-icons/fa';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styled from 'styled-components';

const CustomChartsContainer = styled.div`
  position: relative;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 220px;
  flex: 1;

  @media (max-width: 470px) {
    height: auto;
  }
`;

const GenderChart = ({ data }) => {
  Chart.register(ChartDataLabels);

  const doughnutConfig = {
    labels: ['Masculino', 'Feminino'],
    datasets: [
      {
        label: 'Distribuição de Gênero',
        data: data,
        backgroundColor: ['#86C7F3', '#ffa1b5'],
        borderColor: ['#86C7F3', '#ffa1b5'],
        borderWidth: 1
      }
    ],
    plugins: [ChartDataLabels]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 14
        },
        padding: 10
      },
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold',
          size: 10
        },
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = sum ? `${((value * 100) / sum).toFixed(0)}%` : '';
          if (percentage === '0%') {
            percentage = '';
          }
          let valueFormated = value
            ? `\n${' '.repeat(
                Math.floor((percentage.length + 1) / 2)
              )}(${value})`
            : '';
          return `${percentage}${valueFormated}`;
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          boxWidth: 20,
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Quantidade por Gênero',
        position: 'top',
        align: 'start',
        font: {
          size: 12,
          weight: 'bold'
        },
        padding: 10,
        left: 10
      }
    },
    cutout: '70%'
  };

  return (
    <CustomChartsContainer>
      <Doughnut data={doughnutConfig} options={doughnutOptions} />
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <FaRestroom style={{ fontSize: '70px', opacity: 0.5 }} />
      </div>
    </CustomChartsContainer>
  );
};

export default GenderChart;
