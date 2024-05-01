import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridManagement = ({ voterList }) => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    setRowData(voterList || []);
  }, [voterList]);

  const columnDefs = [
    { headerName: '#ID', field: 'id', filter: true},
    { headerName: 'Nome', field: 'name', filter: true },
    { headerName: 'Nome da Mãe', field: 'motherName', filter: true },
    {
      headerName: 'Data de Nascimento',
      field: 'birthDate',
      valueFormatter: params =>
        params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    { headerName: 'Gênero', field: 'gender' },
    { headerName: 'Telefone', field: 'cellPhone' },
    { headerName: 'Nº Título', field: 'registryId' },
    { headerName: 'Local de Votação', field: 'place' },
    { headerName: 'Zona', field: 'zone' },
    { headerName: 'Seção', field: 'section' },
    { headerName: 'Situação Eleitoral', field: 'situation' }
  ];

  return (
    <div
      className="ag-theme-alpine" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default GridManagement;
