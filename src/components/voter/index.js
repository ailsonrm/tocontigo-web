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
import { FaUserCheck, FaUserEdit } from 'react-icons/fa';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuRefreshCw } from 'react-icons/lu';
import InputMask from 'react-input-mask';

import {
  Formik,
  Field,
  ErrorMessage,
  Form as FormikForm,
  useField,
  useFormikContext
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
  nome: Yup.string().required('Nome obrigatório'),
  nomeMae: Yup.string().required('Nome da mãe obrigatório'),
  dataNascimento: Yup.date().required('Data de nascimento obrigatória'),
  genero: Yup.string().required('Gênero obrigatório'),
  ownerId: Yup.number().required('Responsável obrigatório'),
  celular: Yup.string()
    .required('Celular obrigatório')
    .transform(value => value.replace(/\D/g, ''))
    .matches(
      /^[1-9]{2}9[1-9]\d{7}$/,
      'Celular deve ter 11 dígitos e seguir o formato (XX) 9 XXXX-XXXX'
    )
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

const CustomFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const CustomModal = styled(Modal)`
  .modal-dialog {
    max-width: 80%;
  }
`;

const CustomSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group className="mb-3 w-50">
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

const MySelect = ({ label, width, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group className="mb-3" style={{ width: width }}>
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

const PageVoter = ({ voters, ownerId, fetchVoters, fetchDashboardData }) => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const { role } = currentUser;
  const [showModal, setShowModal] = useState(false);
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

  async function handleSearchInfos(voter) {
    //showSnackbar('Funcionalidade em manutenção!!!', 'error');
    setLoadingInfos(prevLoadingInfos => ({
      ...prevLoadingInfos,
      [voter.id]: true
    }));

    var formattedValues = {
      id: voter.id,
      nome: voter.name,
      dataNascimento: moment(voter.birthDate).utc().format('DDMMYYYY'),
      nomeMae: voter.motherName,
      nroTitulo: voter.registryId
    };

    api
      .patch('/votersTC/searchInfos', formattedValues)
      .then(r => {
        handleSupplementInfos(voter, { situacao: 'Na fila para validação' });
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

  async function handleEditVoter(voter) {
    setSelectedVoter(voter);
    handleShowEditModal();
  }

  const handleUpdateVoter = async (values, { setSubmitting, resetForm }) => {
    var updateVoterData = {
      id: values.id,
      observation: values.observacao,
      status: values.status
    };

    console.log('updateVoterData', updateVoterData);

    api
      .patch('/lawyer/updateVoterFCD', updateVoterData)
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
        if (
          situation.includes('Não Encontrada') ||
          situation.includes('Inválid')
        ) {
          return '#f94848';
        }
        if (situation.includes('Na fila')) {
          return '#ff993e';
        }
        return '#007bff';
    }
  };

  const getValidVoter = placeDistrict => {
    return (
      placeDistrict === null ||
      placeDistrict === '**********' ||
      placeDistrict.toLowerCase().includes('guarulhos')
    );
  };

  function getResponsibleDesc(owner) {
    const personDesc = `${
      roleDescriptions[owner.role] ? roleDescriptions[owner.role] + ': ' : ''
    }${owner.name.trim()}`;

    let managerDesc = '';

    if (Object.keys(owner.manager).length !== 0) {
      managerDesc = `${
        roleDescriptions[owner.manager?.role]
          ? `${
              roleDescriptions[owner.manager?.role]
            }: ${owner.manager?.name?.trim()}`
          : owner.manager?.name?.trim()
      }`;
    }

    if (managerDesc !== undefined && managerDesc !== '') {
      return `${managerDesc} / ${personDesc}`.trim();
    } else {
      return personDesc;
    }
  }

  const CustomPhoneInputMask = ({ label, ...props }) => {
    const [field, meta] = useField(props.field.name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const handleChange = event => {
      const { value } = event.target;
      setFieldValue(props.field.name, value, true);
    };

    const handleBlur = () => {
      setFieldTouched(props.field.name, true, true);
    };

    return (
      <Form.Group className="mb-3  w-50">
        <Form.Label>{label}</Form.Label>
        <InputMask
          {...field}
          {...props}
          value={props.field.value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-control ${
            meta.touched && meta.error ? 'is-invalid' : ''
          }`}
        />
        {meta.touched && meta.error && (
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  };

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
        fields={['lawyer.nome', 'lawyer.endereco']}
        placeholder="Busque por apoiadores..."
        setSearchResult={setSearchVoterResult}
      />
      <ButtonGroup>
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
            .sort((a, b) => a.lawyer.nome.localeCompare(b.lawyer.nome))
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
                      <div>{`#${voter.id} - ${voter.lawyer.nome}`}</div>

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
                              id={`tooltip-${voter.id}`}
                              className="custom-tooltip-inner"
                            >
                              Editar dados do apoiador
                            </Tooltip>
                          }
                        >
                          <span style={{ width: '20px' }}>
                            <FaUserEdit
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
                        Subseção:
                      </label>
                      <span>{voter.lawyer.subsecao}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Inscrição:
                      </label>
                      <span>{voter.lawyer.inscricao}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Tipo:
                      </label>
                      <span>{voter.lawyer.tipo}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Endereco:
                      </label>
                      <span>{`${voter.lawyer.endereco}, nº ${
                        voter.lawyer.numero
                      }${
                        voter.lawyer.complemento
                          ? ` - ${voter.lawyer.complemento}`
                          : ''
                      }`}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        CEP:
                      </label>
                      <span>{voter.lawyer.cep}</span>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Bairro:
                      </label>
                      <span>{voter.lawyer.bairro}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Telefone:
                      </label>
                      <span>{voter.lawyer.telefone}</span>
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Celular:
                      </label>
                      <span>{voter.lawyer.celular}</span>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        border: '1px solid #dcd9dc',
                        borderRadius: '5px',
                        backgroundColor: '#d1d1d1'
                      }}
                    >
                      <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        Observação:
                      </label>
                      <span>{voter.observation}</span>
                    </div>

                    {role.name === 'ADMIN' && (
                      <div>
                        <hr style={{ margin: '2px' }} />
                        <div>
                          <ResponsibleDesc>
                            {`Responsável: ${voter.owner.name}`}
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

      <CustomModal
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
                nome: selectedVoter.lawyer.nome,
                subsecao: selectedVoter.lawyer.subsecao,
                tipo: selectedVoter.lawyer.tipo,
                celular: selectedVoter.lawyer.celular,
                telefone: selectedVoter.lawyer.telefone,
                endereco: `${selectedVoter.lawyer.endereco}, nº ${
                  selectedVoter.lawyer.numero
                }${
                  selectedVoter.lawyer.complemento
                    ? ` - ${selectedVoter.lawyer.complemento}`
                    : ''
                }`,
                cep: selectedVoter.lawyer.cep,
                bairro: selectedVoter.lawyer.bairro,
                observacao: selectedVoter.observation,
                status: selectedVoter.status
              }}
              onSubmit={handleUpdateVoter}
            >
              {({ isSubmitting, errors, touched, values, handleChange }) => (
                <FormikForm>
                  <CustomFieldContainer>
                    <Form.Group className="mb-3" style={{ width: '15%' }}>
                      <Form.Label>Id</Form.Label>
                      <Field as={Form.Control} type="text" name="id" disabled />
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ width: '85%' }}>
                      <Form.Label>Nome</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="nome"
                        disabled
                        isInvalid={!!errors.nome && touched.nome}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </CustomFieldContainer>
                  <Form.Group className="mb-3">
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      type="text"
                      name="observacao"
                      isInvalid={!!errors.observacao && touched.observacao}
                      value={values.observacao}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.observacao}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <CustomFieldContainer>
                    <Form.Group className="mb-3" style={{ width: '35%' }}>
                      <Form.Label>Subseção</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="subsecao"
                        disabled
                        isInvalid={!!errors.subsecao && touched.subsecao}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.subsecao}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" style={{ width: '35%' }}>
                      <Form.Label>Tipo</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="tipo"
                        disabled
                        isInvalid={!!errors.tipo && touched.tipo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.tipo}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <MySelect label="Status" name="status" width="30%">
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="ACCEPTED">Confirmado</option>
                      <option value="REJECTED">Rejeitado</option>
                    </MySelect>
                  </CustomFieldContainer>

                  <CustomFieldContainer>
                  <Form.Group className="mb-3" style={{ width: '50%' }}>
                    <Form.Label>Endereço</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="endereco"
                      disabled
                      isInvalid={!!errors.tipo && touched.tipo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endereco}
                    </Form.Control.Feedback>
                  </Form.Group>
                    <Form.Group className="mb-3" style={{ width: '25%' }}>
                      <Form.Label>CEP</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="cep"
                        disabled
                        isInvalid={!!errors.cep && touched.cep}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cep}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ width: '25%' }}>
                      <Form.Label>Bairro</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="bairro"
                        disabled
                        isInvalid={!!errors.bairro && touched.bairro}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bairro}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </CustomFieldContainer>

                  <CustomFieldContainer>
                    <Field
                      name="celular"
                      label="Celular"
                      mask="(99) 9 9999-9999"
                      maskChar=" "
                      component={CustomPhoneInputMask}
                      disabled
                    />

                    <Field
                      name="telefone"
                      label="Telefone"
                      mask="(99) 9999-9999"
                      maskChar=" "
                      component={CustomPhoneInputMask}
                      disabled
                    />
                  </CustomFieldContainer>

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
      </CustomModal>
    </div>
  );
};

export default PageVoter;
