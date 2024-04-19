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
  OverlayTrigger
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/page';
import { ContextUser } from '../../providers/ContextUser';
import { FaUserCheck } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
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

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  nomeMae: Yup.string().required('Nome da mãe é obrigatório'),
  dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
  genero: Yup.string().required('Gênero é obrigatório'),
  ownerId: Yup.string().required('Responsável é obrigatório')
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
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [loadingInfos, setLoadingInfos] = useState({});

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
      })
      .catch(() => {})
      .finally(() => {});
  }

  async function handleCompleteInfos(voter) {
    setLoadingInfos(prevLoadingInfos => ({
      ...prevLoadingInfos,
      [voter.id]: true
    }));

    var formattedValues = {
      nome: voter.name,
      nomeMae: voter.motherName,
      dataNascimento: moment(voter.birthDate).utc().format('DD/MM/YYYY')
    };

    api
      .patch('/consultarLocalDeVotacao', formattedValues)
      .then(r => {
        console.log('response', r);
        fetchDashboardData();
        handleComplementInfos(voter, r.data);
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      })
      .finally(() =>
        setLoadingInfos(prevLoadingInfos => ({
          ...prevLoadingInfos,
          [voter.id]: false
        }))
      );
  }

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

  function handleComplementInfos(voter, complementInfos) {
    const complementData = {
      id: voter.id,
      registryId: complementInfos.inscricao,
      zone: complementInfos.zona,
      section: complementInfos.secao,
      place: complementInfos.local,
      placeAddress: complementInfos.endereco,
      placeDistrict: complementInfos.municipio,
      situation: complementInfos.situacao
    };

    api
      .patch(`/votersTC/complementInfos`, complementData)
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
      case 'QUITE':
        return 'rgb(0, 128, 0)';
      case 'CANCELADO':
      case 'SUSPENSO':
      case 'NÃO-QUITE':
        return 'rgb(255, 0, 0)';
      case 'INCOMPLETO':
      case null:
        return 'rgb(128, 128, 128)';
      default:
        return 'rgb(73, 169, 255)';
    }
  };

  function showVoterInfo(voter, voterInfo) {
    if (!voter?.situation) {
      return '----------';
    }
    return voterInfo;
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

      {voters.length > 0 ? (
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
          {[...voters]
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
                      {voter.name}
                      <div
                        style={{
                          display: 'flex',
                          float: 'right',
                          flexDirection: 'row',
                          gap: '5px',
                          marginRight: '10px'
                        }}
                      >
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
                            <span>
                              <SiReacthookform
                                onClick={event => {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  handleCompleteInfos(voter);
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

                        <div
                          style={{
                            color: getColor(voter.situation),
                            border: `1px solid ${getColor(voter.situation)}`,
                            padding: '2px 10px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: '900'
                          }}
                        >
                          {voter.situation || 'NÃO VALIDADO'}
                        </div>
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
                          <span>
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
                      <span>{showVoterInfo(voter, voter.place)}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Endereço:
                      </label>
                      <span>{showVoterInfo(voter, voter.placeAddress)}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Cidade/UF:
                      </label>
                      <span>{showVoterInfo(voter, voter.placeDistrict)}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Título:
                      </label>
                      <span>{showVoterInfo(voter, voter.registryId)}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Zona:
                      </label>
                      <span>{showVoterInfo(voter, voter.zone)}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Seção:
                      </label>
                      <span>{showVoterInfo(voter, voter.section)} </span>
                    </div>
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
    </div>
  );
};

export default PageVoter;
