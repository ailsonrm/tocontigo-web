import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { FaRestroom } from 'react-icons/fa';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const GenderChart = ({ data }) => {
  Chart.register(ChartDataLabels);

  const config = {
    labels: ['Masculino', 'Feminino'],
    datasets: [
      {
        label: 'Distribuição de Gênero',
        data: data,
        backgroundColor: ['#4472C4', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['#4472C4', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ],
    plugins: [ChartDataLabels]
  };

  const options = {
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
          weight: 'bold'
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
          let valueFormated = value ? `\n(${value})` : '';
          return `${percentage}${valueFormated}`;
        }
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: '\u00A0\u00A0\u00A0Quantidade por Gênero',
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
    <div
      style={{
        width: '250px',
        heigth: '250px',
        position: 'relative',
        border: '1px solid #dee2e6',
        borderRadius: '10px'
      }}
    >
      <Doughnut data={config} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <FaRestroom style={{ fontSize: '100px', opacity: 0.5 }} />
      </div>
    </div>
  );
};

export default GenderChart;
