import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import './styles.css';
import { ButtonGroup, Button, Modal, Pagination } from 'react-bootstrap';
import GridPagination from '../grid-management/grid-pagination';
import { getGender } from 'gender-detection-from-name';
import { desnormalizeString } from '../../utils/format-utils';
import { LuRefreshCw } from 'react-icons/lu';

const CustomBtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  @media (max-width: 470px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const GridManagement = ({
  lawyerList,
  page,
  limit,
  totalLawyers,
  onPageChange,
  onLimitChange,
  setSearchQuery,
  handleNewVoter,
  fetchDashboardData,
  fetchLawyers
}) => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridApiRef = useRef(null);
  const [showConfirmModal, setConfirmShowModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return 'Não informado';

    const cleaned = ('' + phoneNumber).replace(/\D/g, '');

    const matchCelular = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);

    if (matchCelular) {
      return (
        '(' +
        matchCelular[1] +
        ') ' +
        matchCelular[2] +
        ' ' +
        matchCelular[3] +
        '-' +
        matchCelular[4]
      );
    }

    const matchTelefone = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);

    if (matchTelefone) {
      return (
        '(' +
        matchTelefone[1] +
        ') ' +
        matchTelefone[2] +
        '-' +
        matchTelefone[3]
      );
    }

    if (cleaned.length === 10) {
      return (
        '(' +
        cleaned.slice(0, 2) +
        ') ' +
        cleaned.slice(2, 6) +
        '-' +
        cleaned.slice(6)
      );
    } else if (cleaned.length === 11) {
      return (
        '(' +
        cleaned.slice(0, 2) +
        ') ' +
        cleaned.slice(2, 3) +
        ' ' +
        cleaned.slice(3, 7) +
        '-' +
        cleaned.slice(7)
      );
    }

    return 'N/I';
  }

  useEffect(() => {
    async function fetchColumnDefs() {
      return [
        {
          headerName: '#ID',
          field: 'id',
          width: 80,
          headerCheckboxSelection: true,
          checkboxSelection: true
        },

        {
          headerName: 'Nome',
          field: 'nome',
          filter: true
        },
        {
          headerName: 'OAB Nº',
          field: 'inscricao',
          width: 100,
          filter: true
        },
        {
          headerName: 'Status',
          field: 'voters',
          width: 120,
          filter: true,
          valueGetter: params => {
            if (params.data.voters && params.data.voters.length > 0) {
              switch (params.data.voters[0].status) {
                case 'REJECTED':
                  return 'Não confirmado';
                case 'ACCEPTED':
                  return 'Confirmado';
                case 'IN_PROGRESS':
                  return 'Em andamento';
                default:
                  return 'Não está em andamento';
              }
            } else {
              return '-';
            }
          }
        },
        {
          headerName: 'Tipo',
          field: 'tipo',
          width: 120,
          filter: true
        },
        {
          headerName: 'Contato',
          field: 'contato',
          filter: true,
          width: 150,

          valueFormatter: params => {
            const celular = params.data.celular
              ? formatPhoneNumber(params.data.celular)
              : null;
            const telefone = params.data.telefone
              ? formatPhoneNumber(params.data.telefone)
              : null;
            return celular || telefone || 'N/I';
          }
        },
        {
          headerName: 'Endereço',
          field: 'endereco',
          filter: true,
          width: 230,

          valueGetter: params => {
            const rua = params.data.endereco;
            const numero = params.data.numero || 'S/N';
            return `${rua}, nº ${numero}`;
          }
        },
        {
          headerName: 'Complemento',
          field: 'complemento',
          filter: true,
          width: 120
        },
        {
          headerName: 'Bairro',
          field: 'bairro',
          filter: true,
          width: 150
        },
        {
          headerName: 'CEP',
          field: 'cep',
          filter: true,
          width: 100
        },
        {
          headerName: 'Cidade',
          field: 'cidade',
          filter: true,
          width: 120
        },
        {
          headerName: 'UF',
          field: 'estado',
          filter: true,
          width: 80
        },
        {
          headerName: 'Gênero',
          field: 'genero',
          width: 120,
          filter: true
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
      const processedData = lawyerList.map(lawyer => ({
        ...lawyer,
        genero: determineGender(lawyer.nome)
      }));
      setRowData(processedData);
    }
  }, [lawyerList, loading]);

  const rowClassRules = {
    'rag-green': params =>
      params.data.voters &&
      params.data.voters[0] &&
      params.data.voters[0].status === 'ACCEPTED',
    'rag-red': params =>
      params.data.voters &&
      params.data.voters[0] &&
      params.data.voters[0].status === 'REJECTED',
    'rag-orange': params =>
      params.data.voters &&
      params.data.voters[0] &&
      params.data.voters[0].status === 'IN_PROGRESS',
    'rag-gray': params =>
      !params.data.voters ||
      params.data.voters.length === 0 ||
      params.data.voters[0].status === null
  };

  const clearFilters = () => {
    if (gridApiRef.current) {
      gridApiRef.current.setFilterModel(null);
    }
    setSearchQuery('');
  };

  const handleShowModal = () => {
    setConfirmShowModal(true);
  };

  const handleCloseModal = () => {
    setConfirmShowModal(false);
  };

  const handleConfirm = () => {
    setConfirmShowModal(false);
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      const selectedData = selectedNodes.map(node => ({
        id: node.data.id,
        address: `${node.data.endereco} nº ${node.data.numero}, ${node.data.bairro} - ${node.data.cidade}/${node.data.estado}`
      }));

      console.log('selectedData', selectedData);

      handleNewVoter(selectedData);
    }
  };

  const onGridReady = params => {
    gridApiRef.current = params.api;
    updateColumnWidths();
  };

  const updateSelection = () => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes();
      setIsDisabled(selectedNodes.length === 0);
    }
  };

  const updateColumnWidths = () => {
    if (!gridApiRef.current) return;

    const columnDefs = gridApiRef.current.getColumnDefs();
    columnDefs.forEach(colDef => {
      if (colDef.field === 'value') {
        const maxWidth = rowData.reduce(
          (max, row) => Math.max(max, row[colDef.field]?.length * 10 || 0),
          100
        );
        colDef.width = maxWidth;
      }
    });

    gridApiRef.current.setColumnDefs(columnDefs);
  };

  const totalPages = Math.ceil(totalLawyers / limit);

  function determineGender(fullName) {
    const firstName = fullName.toLowerCase().split(' ')[0].toLowerCase();

    const commonFemaleNames = [
      'maria',
      'ana',
      'joana',
      'marina',
      'letícia',
      'camila',
      'adriana',
      'lúcia',
      'alexandra',
      'abigail',
      'agnes',
      'tamires',
      'thamires'
    ];
    const commonMaleNames = [
      'joão',
      'carlos',
      'pedro',
      'mario',
      'adilson',
      'jose',
      'luiz',
      'antonio',
      'paulo',
      'alexandre',
      'alan',
      'adonias',
      'alex'
    ];

    if (commonFemaleNames.includes(firstName)) {
      return 'Feminino';
    }

    if (commonMaleNames.includes(firstName)) {
      return 'Masculino';
    }

    const femaleSuffixes = [
      'a',
      'e',
      'i',
      'y',
      'ia',
      'ina',
      'ara',
      'ana',
      'isa',
      'ela',
      'ina',
      'ete',
      'ine',
      'triz',
      'em'
    ];

    const maleSuffixes = [
      'o',
      'r',
      'u',
      'l',
      'ão',
      'el',
      'mar',
      'nor',
      'eiro',
      'nho',
      'gno',
      'on',
      'om',
      'an'
    ];

    for (let suffix of femaleSuffixes) {
      if (firstName.endsWith(suffix)) {
        return 'Feminino';
      }
    }

    for (let suffix of maleSuffixes) {
      if (firstName.endsWith(suffix)) {
        return 'Masculino';
      }
    }

    return determineGender2(firstName) || 'Indefinido';
  }

  function determineGender2(fullName) {
    const firstName = fullName.toLowerCase().split(' ')[0].toLowerCase();

    const gender = getGender(firstName, 'es');
    if (gender === 'male') {
      return 'masculino';
    } else if (gender === 'female') {
      return 'feminino';
    } else {
      return 'desconhecido';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <CustomBtnGroup>
        <ButtonGroup>
          <Button
            onClick={handleShowModal}
            variant="outline-success"
            disabled={isDisabled}
          >
            Novo apoio
          </Button>
          <Button onClick={clearFilters} variant="outline-success">
            Limpar Filtros
          </Button>
          <Button
            variant="outline-success"
            onClick={() => {
              fetchLawyers();
              fetchDashboardData();
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <LuRefreshCw
              style={{
                fontSize: 20
              }}
            />
          </Button>
        </ButtonGroup>
        <GridPagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CustomBtnGroup>

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="ag-theme-balham-dark" style={{ height: '100%' }}>
          <AgGridReact
            onGridReady={onGridReady}
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            rowSelection="multiple"
            enableCellTextSelection={true}
            clipboardOptions={{ copyHeadersToClipboard: true }}
            suppressRowClickSelection={true}
            onSelectionChanged={updateSelection}
            rowClassRules={rowClassRules}
          />
        </div>
      )}

      <Modal show={showConfirmModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirma o envio dos dados selecionados para ser cadastrado como
          possível novo apoio?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-custom" onClick={handleCloseModal}>
            Não
          </Button>
          <Button variant="custom" onClick={handleConfirm}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GridManagement;
