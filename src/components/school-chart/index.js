import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SchoolChart = ({ data }) => {
  Chart.register(ChartDataLabels);

  const barConfig = {
    labels: data.labels,
    datasets: [
      {
        label: 'Votos por Escola',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: '\u00A0\u00A0\u00A0Votos por Escola',
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div
        style={{
          width: '500px',
          height: '250px',
          border: '1px solid #dee2e6',
          borderRadius: '10px'
        }}
      >
        <Bar data={barConfig} options={barOptions} />
      </div>
    </div>
  );
};

export default SchoolChart;
