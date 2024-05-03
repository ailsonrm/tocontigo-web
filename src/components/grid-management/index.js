import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './styles.css';
import { ButtonGroup, Button } from 'react-bootstrap';

const GridManagement = ({ voterList }) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridApiRef = useRef(null);

  useEffect(() => {
    async function fetchColumnDefs() {
      return [
        { headerName: '#ID', field: 'id', width: 70 },
        {
          headerName: 'Nome',
          field: 'name',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Nome da Mãe',
          field: 'motherName',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Data de Nascimento',
          field: 'birthDate',
          filter: 'agDateColumnFilter',
          floatingFilter: true,
          filterParams: {
            comparator: function (filterLocalDateAtMidnight, cellValue) {
              const filterDateUTC = new Date(
                Date.UTC(
                  filterLocalDateAtMidnight.getFullYear(),
                  filterLocalDateAtMidnight.getMonth(),
                  filterLocalDateAtMidnight.getDate()
                )
              );

              const cellDate = new Date(cellValue);
              const cellDateUTC = new Date(
                Date.UTC(
                  cellDate.getUTCFullYear(),
                  cellDate.getUTCMonth(),
                  cellDate.getUTCDate()
                )
              );

              if (cellDateUTC < filterDateUTC) {
                return -1;
              } else if (cellDateUTC > filterDateUTC) {
                return 1;
              } else {
                return 0;
              }
            },
            browserDatePicker: true
          },
          valueFormatter: params => {
            if (!params.value) return '';
            const date = new Date(params.value);
            return (
              date.getUTCDate().toString().padStart(2, '0') +
              '/' +
              (date.getUTCMonth() + 1).toString().padStart(2, '0') +
              '/' +
              date.getUTCFullYear().toString()
            );
          }
        },

        {
          headerName: 'Quem cadastrou responde para',
          field: 'owner.manager.name',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Quem cadastrou',
          field: 'owner.name',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Gênero',
          field: 'gender',
          filter: true,
          floatingFilter: true,
          valueFormatter: params =>
            params.value === 'M' ? 'Masculino' : 'Feminino',
          filterValueGetter: params =>
            params.data.gender === 'M' ? 'Masculino' : 'Feminino'
        },
        {
          headerName: 'Telefone',
          field: 'cellPhone',
          filter: true,
          floatingFilter: true,
          valueFormatter: params =>
            params.value ? params.value : 'Não informado',
          cellStyle: params =>
            params.value ? {} : { color: '#fff', backgroundColor: '#ef7878' }
        },
        { headerName: 'Nº Título', field: 'registryId' },
        {
          headerName: 'Local de Votação',
          field: 'place',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Zona',
          field: 'zone',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Seção',
          field: 'section',
          filter: true,
          floatingFilter: true
        },
        {
          headerName: 'Situação Eleitoral',
          field: 'situation',
          filter: true,
          floatingFilter: true,
          valueFormatter: params => {
            if (params.value === null) return 'Não Validado';
            return params.value
              .split(' ')
              .map(
                word =>
                  word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
              )
              .join(' ');
          }
        }
      ];
    }

    fetchColumnDefs().then(cols => {
      setColumnDefs(cols);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      const processedData = voterList.map(item => ({
        ...item
      }));
      setRowData(processedData);
    }
  }, [voterList, loading]);

  const rowClassRules = {
    'rag-green': params => params.data.situation === 'REGULAR',
    'rag-red': params => params.data.situation !== 'REGULAR',
    'rag-gray': params => params.data.situation === null
  };

  const ragCellClassRules = {
    'rag-red': params => params.situation === 'REGULAR'
  };

  const clearFilters = () => {
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel(null);
    }
  };

  const onGridReady = params => {
    gridApiRef.current = params.api;
    updateColumnWidths();
  };

  const updateColumnWidths = () => {
    if (!gridRef.current) return;
    
    gridRef.current.getColumnDefs().forEach(colDef => {
        if (colDef.field === 'value') {
            const maxWidth = data.reduce((max, row) => Math.max(max, row[colDef.field].length * 10), 100);
            gridRef.current.getColumnState().find(col => col.colId === colDef.field).width = maxWidth;
        }
    });
    
    gridRef.current.onColumnEverythingChanged();
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <ButtonGroup style={{ width: '150px' }}>
        <Button onClick={clearFilters} variant="outline-success">
          Limpar Filtros
        </Button>
      </ButtonGroup>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="ag-theme-balham-dark" style={{ height: '100%' }}>
          <AgGridReact
            onGridReady={event => {
              gridApiRef.current = event.api;
            }}
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            rowClassRules={rowClassRules}
          />
        </div>
      )}
    </div>
  );
};

export default GridManagement;
