import React from 'react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styled from 'styled-components';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

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

const getAgeDistribution = data => {
  const ageCounts = data.reduce((acc, { birthDate, gender }) => {
    const age = moment().diff(moment(birthDate, 'YYYY-MM-DD'), 'years');
    const ageGroup = `${Math.floor(age / 10) * 10}-${
      Math.floor(age / 10) * 10 + 9
    }`;
    if (!acc[ageGroup]) {
      acc[ageGroup] = { M: 0, F: 0 };
    }
    if (gender === 'M' || gender === 'F') {
      acc[ageGroup][gender]++;
    }
    return acc;
  }, {});

  const labels = Object.keys(ageCounts).sort((a, b) => {
    const ageA = parseInt(a.split('-')[0], 10);
    const ageB = parseInt(b.split('-')[0], 10);
    return ageA - ageB;
  });

  const maleValues = labels.map(label => ageCounts[label]['M']);
  const femaleValues = labels.map(label => ageCounts[label]['F']);

  return {
    labels,
    datasets: [
      {
        label: 'Masculino',
        data: maleValues,
        backgroundColor: '#86C7F3'
      },
      {
        label: 'Feminino',
        data: femaleValues,
        backgroundColor: '#FFA1B5'
      }
    ]
  };
};

const AgeChart = ({ data }) => {
  const ageData = getAgeDistribution(data);

  const ageOptions = {
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: 'Faixa Etária e Gênero',
        align: 'start',
        padding: 10
      },
      datalabels: {
        display: true,
        color: 'white'
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
      <Bar data={ageData} options={ageOptions} />
    </CustomChartsContainer>
  );
};

export default AgeChart;
