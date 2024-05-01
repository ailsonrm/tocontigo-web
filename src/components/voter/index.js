import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {
  Accordion,
  Button,
  Modal,
  Form,
  Spinner,
  Tooltip,
  OverlayTrigger,
  ButtonGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import { FaUserCheck } from 'react-icons/fa';
import { RiDeleteBin5Line, RiEditLine } from 'react-icons/ri';
import { LuRefreshCw } from 'react-icons/lu';

import {
  Formik,
  Field,
  ErrorMessage,
  Form as FormikForm,
  useField
} from 'formik';
import * as Yup from 'yup';
import { api } from '../../providers/apiClient';
import noResultsImg from '../../assets/noResults.png';
import { SiReacthookform } from 'react-icons/si';
import { FaSpinner } from 'react-icons/fa6';
import Search from '../../components/search';

moment();

const EmptyContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const EmptyMsg = styled.h2`
  color: #999999;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ResponsibleDesc = styled.span`
  font-size: 14px;
`;

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  nomeMae: Yup.string().required('Nome da mãe é obrigatório'),
  dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
  genero: Yup.string().required('Gênero é obrigatório'),
  ownerId: Yup.number().required('Responsável é obrigatório')
});

const VoterInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  @media (max-width: 470px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        {...field}
        isInvalid={!!meta.error && meta.touched}
      >
        {props.children}
      </Form.Control>
      <Form.Control.Feedback type="invalid">{meta.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

const cleanPhoneNumber = phoneNumber => {
  return phoneNumber.replace(/\D/g, '');
};

const PageVoter = ({ ownerId, fetchDashboardData }) => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const { role } = currentUser;
  const [showModal, setShowModal] = useState(false);
  const [voters, setVoters] = useState([]);
  const [searchVoterResult, setSearchVoterResult] = useState([]);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [loadingInfos, setLoadingInfos] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const [selectedVoter, setSelectedVoter] = useState(null);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    event.preventDefault();

    const formattedValues = {
      name: values.nome,
      motherName: values.nomeMae,
      birthDate: values.dataNascimento,
      gender: values.genero,
      cellPhone: cleanPhoneNumber(values.celular)
    };

    const response = await api
      .post('/votersTC', formattedValues)
      .then(response => {
        resetForm();
        setShowModal(false);
        showSnackbar('Apoiador cadastrado com sucesso!', 'success');
        fetchVoters();
        fetchDashboardData();
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });
    setSubmitting(false);
  };

  function fetchVoters() {
    api
      .get('/votersTC')
      .then(response => {
        setVoters([]);
        setVoters(response.data);
        setSearchVoterResult(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  async function handleSearchInfos(voter) {
    showSnackbar('Funcionalidade em manutenção!!!', 'error');
    // setLoadingInfos(prevLoadingInfos => ({
    //   ...prevLoadingInfos,
    //   [voter.id]: true
    // }));

    // var formattedValues = {
    //   id: voter.id,
    //   nome: voter.name,
    //   dataNascimento: moment(voter.birthDate).utc().format('YYYY-MM-DD'),
    //   nomeMae: voter.motherName,
    //   nroTitulo: voter.registryId
    // };

    // api
    //   .patch('/votersTC/searchInfos', formattedValues)
    //   .then(r => {
    //     handleSupplementInfos(voter, { situacao: 'Na fila para validação' });
    //   })
    //   .catch(error => {
    //     console.error('Erro na API', error.response.data.error);
    //     showSnackbar(error.response.data.error, 'error');
    //   })
    //   .finally(() =>
    //     setLoadingInfos(prevLoadingInfos => ({
    //       ...prevLoadingInfos,
    //       [voter.id]: false
    //     }))
    //   );
  }

  async function handleEditVoter(voter) {
    setSelectedVoter(voter);
    handleShowEditModal();
  }

  const handleUpdateVoter = async (values, { setSubmitting, resetForm }) => {
    const formattedBirthDate = moment(values.dataNascimento).toISOString();
    var updateVoterData = {
      id: values.id,
      name: values.nome,
      motherName: values.nomeMae,
      birthDate: values.dataNascimento,
      gender: values.genero,
      cellPhone: cleanPhoneNumber(values.celular)
    };

    api
      .patch('/votersTC', updateVoterData)
      .then(response => {
        resetForm();
        handleCloseEditModal();
        showSnackbar('Apoiador atualizado com sucesso!', 'success');
        fetchVoters();
        fetchDashboardData();
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });
    setSubmitting(false);
  };

  function handleRemoveVoter(voter) {
    const removeVoterData = {
      id: voter.id,
      status: 'INACTIVE'
    };

    api
      .patch(`/votersTC`, removeVoterData)
      .then(response => {
        fetchDashboardData();
        fetchVoters();
      })
      .catch(() => {})
      .finally(() => fetchVoters());
  }

  function handleSupplementInfos(voter, complementInfos) {
    const complementData = {
      id: voter.id,
      registryId: complementInfos.inscricao,
      zone: complementInfos.zona,
      section: complementInfos.secao,
      place: complementInfos.local,
      placeAddress: complementInfos.endereco,
      placeDistrict: complementInfos.municipio,
      situation: complementInfos.situacao,
      responseText: complementInfos.responseText
    };

    api
      .patch(`/votersTC/supplementInfos`, complementData)
      .then(response => {
        fetchDashboardData();
      })
      .catch(() => {})
      .finally(() => fetchVoters());
  }

  useEffect(() => {
    fetchVoters();
  }, []);

  const getColor = situation => {
    switch (situation) {
      case 'REGULAR':
        return '#008000';
      case 'CANCELADO':
      case 'SUSPENSO':
      case 'NÃO-QUITE':
        return '#f94848';
      case 'INCOMPLETO':
      case 'NÃO VALIDADO':
      case null:
        return '#808080';
      default:
        if (situation.startsWith('Dados não conferem')) {
          return '#f94848';
        }
        if (situation === 'Na fila para validação') {
          return '#ff993e';
        }
        return '#007bff';
    }
  };

  const getValidVoter = placeDistrict => {
    return (
      placeDistrict === null ||
      placeDistrict.toLowerCase().includes('guarulhos')
    );
  };

  function getResponsibleDesc(voter) {
    const roleDescriptions = {
      ADMIN: '',
      PILLAR: 'Pilar',
      LEADER: 'Líder'
    };

    const personDesc = `${
      roleDescriptions[voter.role.name]
        ? roleDescriptions[voter.role.name] + ': '
        : ''
    }${voter.name.trim()}`;

    let managerDesc = '';
    if (voter.manager && roleDescriptions[voter.manager.role.name]) {
      managerDesc = `${
        roleDescriptions[voter.manager.role.name]
      }: ${voter.manager.name.trim()}`;
    }

    return managerDesc ? `${managerDesc} / ${personDesc}` : personDesc;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '10px'
      }}
    >
      <Search
        data={voters}
        fields={['name', 'email']}
        placeholder="Busque por apoiadores..."
        setSearchResult={setSearchVoterResult}
      />
      <ButtonGroup>
        <Button
          variant="outline-success"
          onClick={handleShowModal}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Novo apoiador
          <FaUserCheck
            style={{
              fontSize: 20
            }}
          />
        </Button>
        <Button
          variant="outline-success"
          onClick={() => {
            fetchVoters();
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

      {searchVoterResult.length > 0 ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-start',
            gap: '5px'
          }}
        >
          {[...searchVoterResult]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((voter, index) => (
              <Accordion
                key={voter.id}
                defaultActiveKey=""
                style={{ marginTop: '5px' }}
              >
                <Accordion.Item eventKey={voter.id}>
                  <Accordion.Header
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <VoterInfoContainer>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: '5px',
                          color: getValidVoter(voter.placeDistrict)
                            ? undefined
                            : '#f94848',
                          fontWeight: getValidVoter(voter.placeDistrict)
                            ? undefined
                            : 'bold'
                        }}
                      >
                        {`#${voter.id} - ${voter.name}${
                          getValidVoter(voter.placeDistrict)
                            ? ''
                            : ' - (local inválido)'
                        }`}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          float: 'right',
                          flexDirection: 'row',
                          gap: '10px',
                          marginRight: '10px',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <OverlayTrigger
                          placement="bottom-start"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip
                              id={`tooltip-${voter.id}-delete`}
                              className="custom-tooltip-inner"
                              style={{
                                display: voter.responseText ? undefined : 'none'
                              }}
                            >
                              {voter.responseText}
                            </Tooltip>
                          }
                        >
                          <span>
                            <div
                              style={{
                                color:
                                  voter.situation !== null
                                    ? getColor(voter.situation)
                                    : voter.registryId
                                    ? getColor('INCOMPLETO')
                                    : getColor('NÃO VALIDADO'),
                                border: `1px solid ${
                                  voter.situation !== null
                                    ? getColor(voter.situation)
                                    : voter.registryId
                                    ? getColor('INCOMPLETO')
                                    : getColor('NÃO VALIDADO')
                                }`,
                                padding: '2px 10px 1px 10px',
                                borderRadius: '10px',
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: '900'
                              }}
                            >
                              {voter.situation !== null
                                ? voter.situation
                                : voter.registryId
                                ? 'INCOMPLETO'
                                : 'NÃO VALIDADO'}
                            </div>
                          </span>
                        </OverlayTrigger>
                        {(voter.registryId === null ||
                          voter.situation !== 'REGULAR') && (
                          <>
                            {loadingInfos[voter.id] ? (
                              <Spinner
                                variant="success"
                                style={{ width: '20px', height: '20px' }}
                              />
                            ) : (
                              <OverlayTrigger
                                placement="bottom-start"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip
                                    id={`tooltip-${voter.id}`}
                                    className="custom-tooltip-inner"
                                  >
                                    Buscar dados complementares
                                  </Tooltip>
                                }
                              >
                                <span style={{ width: '20px' }}>
                                  <SiReacthookform
                                    onClick={event => {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      handleSearchInfos(voter);
                                    }}
                                    style={{
                                      fontSize: '18px',
                                      color: 'green',
                                      strokeWidth: '1px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                </span>
                              </OverlayTrigger>
                            )}
                            <OverlayTrigger
                              placement="bottom-start"
                              delay={{ show: 250, hide: 400 }}
                              overlay={
                                <Tooltip
                                  id={`tooltip-${voter.id}`}
                                  className="custom-tooltip-inner"
                                >
                                  Editar dados do apoiador
                                </Tooltip>
                              }
                            >
                              <span style={{ width: '20px' }}>
                                <RiEditLine
                                  onClick={event => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    handleEditVoter(voter);
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    color: '#007bff',
                                    fontSize: '20px',
                                    marginRight: '10px'
                                  }}
                                />
                              </span>
                            </OverlayTrigger>
                          </>
                        )}

                        <OverlayTrigger
                          placement="bottom-start"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip
                              id={`tooltip-${voter.id}-delete`}
                              className="custom-tooltip-inner"
                            >
                              Excluir apoiador
                            </Tooltip>
                          }
                        >
                          <span style={{ width: '20px' }}>
                            <RiDeleteBin5Line
                              onClick={() => handleRemoveVoter(voter)}
                              style={{
                                cursor: 'pointer',
                                color: '#dc3545',
                                fontSize: '20px'
                              }}
                            />
                          </span>
                        </OverlayTrigger>
                      </div>
                    </VoterInfoContainer>
                  </Accordion.Header>
                  <Accordion.Body
                    style={{
                      display: 'flex',
                      padding: '10px',
                      flexDirection: 'column',
                      gap: '5px'
                    }}
                  >
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Nome da mãe:
                      </label>
                      <span>{voter.motherName}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Data de nascimento:
                      </label>
                      <span>
                        {moment(voter.birthDate).utc().format('DD/MM/YYYY')}
                      </span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Telefone:
                      </label>
                      <span>{voter.cellPhone}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Gênero:
                      </label>
                      <span>{voter.gender}</span>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Escola:
                      </label>
                      <span>{voter.place}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Endereço:
                      </label>
                      <span>{voter.placeAddress}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Cidade/UF:
                      </label>
                      <span>{voter.placeDistrict}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Título:
                      </label>
                      <span>{voter.registryId}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Zona:
                      </label>
                      <span>{voter.zone}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Seção:
                      </label>
                      <span>{voter.section} </span>
                    </div>
                    {role.name === 'ADMIN' && (
                      <div>
                        <hr style={{ margin: '2px' }} />
                        <div>
                          <ResponsibleDesc>
                            {getResponsibleDesc(voter.owner)}
                          </ResponsibleDesc>
                        </div>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ))}
        </div>
      ) : (
        <EmptyContainer>
          <img src={noResultsImg} alt="noResults" />
          <EmptyMsg>Nenhum apoiador encontrado.</EmptyMsg>
        </EmptyContainer>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Novo Apoiador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              nome: '',
              nomeMae: '',
              dataNascimento: '',
              genero: '',
              celular: '',
              ownerId
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <FormikForm>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="nome"
                    isInvalid={!!errors.nome && touched.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Mãe</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="nomeMae"
                    isInvalid={!!errors.nomeMae && touched.nomeMae}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomeMae}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Field
                    as={Form.Control}
                    type="date"
                    name="dataNascimento"
                    isInvalid={
                      !!errors.dataNascimento && touched.dataNascimento
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dataNascimento}
                  </Form.Control.Feedback>
                </Form.Group>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <MySelect label="Gênero" name="genero">
                    <option value="">Selecione um gênero</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </MySelect>
                  <Form.Group className="mb-3">
                    <Form.Label>Celular</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="celular"
                      isInvalid={!!errors.celular && touched.celular}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.celular}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button
                    variant="light"
                    disabled={isSubmitting}
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Cadastrar
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Apoiador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVoter && (
            <Formik
              initialValues={{
                id: selectedVoter.id,
                nome: selectedVoter.name,
                nomeMae: selectedVoter.motherName,
                dataNascimento: moment(selectedVoter.birthDate)
                  .utc()
                  .format('YYYY-MM-DD'),
                genero: selectedVoter.gender,
                celular: selectedVoter.cellPhone,
                ownerId: selectedVoter.owner.id
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateVoter}
            >
              {({ isSubmitting, errors, touched }) => (
                <FormikForm>
                  <Form.Group className="mb-3">
                    <Form.Label>Id</Form.Label>
                    <Field as={Form.Control} type="text" name="id" disabled />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="nome"
                      isInvalid={!!errors.nome && touched.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Mãe</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="nomeMae"
                      isInvalid={!!errors.nomeMae && touched.nomeMae}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nomeMae}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Field
                      as={Form.Control}
                      type="date"
                      name="dataNascimento"
                      isInvalid={
                        !!errors.dataNascimento && touched.dataNascimento
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.dataNascimento}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      variant="light"
                      disabled={isSubmitting}
                      onClick={handleCloseEditModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Atualizar
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PageVoter;
