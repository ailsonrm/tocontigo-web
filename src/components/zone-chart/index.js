import React from 'react';
import { Bar } from 'react-chartjs-2';
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

const ZoneChart = ({ data }) => {
  const additionalInfoForZone = {
    '176ª': {
      juiz: 'Marcela Filus Coelho',
      chefe: 'Roberto Langanke',
      email: 'ze176@tre-sp.jus.br',
      telefone: '(11) 94997-1861',
      endereco: 'Rua dos Crisântemos, 29 1º Andar, Sala 102'
    },
    "185ª": {
      juiz: 'Valmir Maurici Júnior',
      chefe: 'Antonio Willyams da Silva Assis',
      email: 'ze185@tre-sp.jus.br',
      telefone: '(11) 2412-1598',
      endereco: 'Avenida João Veloso da Silva, 1181'
    },
    "278ª": {
      juiz: 'Gilberto Azevedo de Moraes Costa',
      chefe: 'Rodrigo da Silva Barros',
      email: 'ze278@tre-sp.jus.br',
      telefone: '(11) 94997-1659',
      endereco: 'Rua dos Crisântemos, 29 1º Andar, Sala 102'
    },
    "279ª": {
      juiz: 'Priscila Devechi Ferraz Maia',
      chefe: 'Jose Maurício Bortoluzzi Correa',
      email: 'ze279@tre-sp.jus.br',
      telefone: '(11) 2461-0556',
      endereco: 'Rua dos Crisântemos, 29 1º Andar, Sala 102'
    },
    "393ª": {
      juiz: 'Mirian Keiko Sanches Macedo',
      chefe: 'Rogerio Alves da Silva',
      email: 'ze393@tre-sp.jus.br',
      telefone: '(11) 94997-0345',
      endereco: 'Rua dos Crisântemos, 29 1º Andar, Sala 102'
    },
    "394ª": {
      juiz: 'Patricia Padilha',
      chefe: 'Antônio Reberte de Brito',
      email: 'ze394@tre-sp.jus.br',
      telefone: '(11) 94997-0712',
      endereco: 'Avenida João Veloso da Silva, 1181'
    },
    "395ª": {
      juiz: 'Adriana Porto Mendes',
      chefe: 'Jorge Soares',
      email: 'ze395@tre-sp.jus.br',
      telefone: '(11) 94997-3018',
      endereco: 'Rua Cariri Açu, 32'
    }
  };

  const barData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Zona Eleitoral',
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
        text: 'Votos por Zona Eleitoral',
        align: 'start',
        padding: 10
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const zoneLabel = context[0].label;
            return `Zona Eleitoral: ${zoneLabel}`;
          },
          label: function (context) {
            const zoneLabel = context.label;
            const value = context.parsed.y;
            const info = additionalInfoForZone[zoneLabel] || {};
            const quantityLine = ` Apoiadores: ${value}`;
            const infoLines = [
              '',
              `Juiz: ${info.juiz || 'N/D'}`,
              `Chefe: ${info.chefe || 'N/D'}`,
              `Email: ${info.email || 'N/D'}`,
              `Telefone: ${info.telefone || 'N/D'}`,
              `Endereço: ${info.endereco || 'N/D'}`
            ];
            return [quantityLine, ...infoLines];
          }
        }
      },
      datalabels: {
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
      <Bar data={barData} options={barOptions} />
    </CustomChartsContainer>
  );
};

export default ZoneChart;
