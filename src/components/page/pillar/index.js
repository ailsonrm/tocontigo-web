import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import {
  Button,
  Modal,
  Form,
  Card,
  ButtonGroup,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ContextUser } from '../../../providers/ContextUser';
import { FaUserShield, FaUserEdit } from 'react-icons/fa';
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
import { api } from '../../../providers/apiClient';
import noResultsImg from '../../../assets/noResults.png';
import Search from '../../search';

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

const CustomActionsEditModal = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;

  @media (max-width: 470px) {
    flex-direction: column;
    align-items: end;
  }
`;

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

const cleanPhoneNumber = phoneNumber => {
  return phoneNumber.replace(/\D/g, '');
};

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().required('Email é obrigatório'),
  celular: Yup.string()
    .required('Celular obrigatório')
    .transform(value => value.replace(/\D/g, ''))
    .matches(
      /^[1-9]{2}9[1-9]\d{7}$/,
      'Celular deve ter 11 dígitos e seguir o formato (XX) 9 XXXX-XXXX'
    )
});

const Pillar = ({ managedBy, fetchDashboardData }) => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const [coordenators, setCoordenators] = useState([]);
  const [searchCoordResult, setSearchCoordResult] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);
  const [selectedCoord, setSelectedCoord] = useState(null);

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
      email: values.email,
      cellPhone: cleanPhoneNumber(values.celular),
      roleId: 2
    };

    const response = await api
      .post('/lawyer/create_user', formattedValues)
      .then(response => {
        resetForm();
        setShowModal(false);
        showSnackbar('Coordenador cadastrado com sucesso!', 'success');
        fetchCoords();
        fetchDashboardData();
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });
    setSubmitting(false);
  };

  function fetchCoords() {
    api
      .get(`/lawyer/coordenators`)
      .then(response => {
        setCoordenators([]);
        setCoordenators(response.data);
        setSearchCoordResult(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  useEffect(() => {
    fetchCoords();
  }, []);

  async function handleEditPillar(coord) {
    setSelectedCoord(coord);
    handleShowEditModal();
  }

  const handleUpdateCoord = async (values, { setSubmitting, resetForm }) => {
    var updateCoordData = {
      id: values.id,
      name: values.nome,
      email: values.email,
      status: values.status,
      cellPhone: cleanPhoneNumber(values.celular),
      roleId: Number(values.roleId)
    };

    api
      .patch('/lawyer/update_user', updateCoordData)
      .then(response => {
        resetForm();
        handleCloseEditModal();
        showSnackbar('Coordenador atualizado com sucesso!', 'success');
        fetchCoords();
        fetchDashboardData();
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });
    setSubmitting(false);
  };

  const handleSendNewPassword = async ({ id, email }, setSubmitting) => {
    setSubmitting(true);

    api
      .patch('/lawyer/newPassword', { id, email })
      .then(response => {
        handleCloseEditModal();
        showSnackbar('Nova senha enviada com sucesso!', 'success');
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });

    setSubmitting(false);
  };

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
      <Form.Group className="mb-3">
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
        data={coordenators}
        fields={['name', 'email']}
        placeholder="Busque por pilares..."
        setSearchResult={setSearchCoordResult}
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
          Novo Coordenador
          <FaUserShield
            style={{
              fontSize: 20
            }}
          />
        </Button>
        <Button
          variant="outline-success"
          onClick={() => {
            fetchCoords();
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

      {searchCoordResult.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: '10px'
          }}
        >
          {[...searchCoordResult]
            .sort((a, b) => {
              return b.ownedVoters.length - a.ownedVoters.length;
            })
            .map((coord, index) => (
              <div key={coord.id} style={{ width: '311px' }}>
                <Card>
                  <Card.Body>
                    <Card.Title
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <OverlayTrigger
                        placement="bottom-start"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                          <Tooltip
                            id={`tooltip-${coord.id}`}
                            className="custom-tooltip-inner"
                          >
                            Editar dados do coordenador
                          </Tooltip>
                        }
                      >
                        <span style={{ width: '20px' }}>
                          <FaUserEdit
                            onClick={event => {
                              event.preventDefault();
                              event.stopPropagation();
                              handleEditPillar(coord);
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
                      {coord.name}
                    </Card.Title>
                    <Card.Subtitle
                      className="mb-2 text-muted"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {coord.email}
                    </Card.Subtitle>
                    <Card.Text
                      as="div"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>Apoiadores: {coord.ownedVoters.length}</div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      ) : (
        <EmptyContainer>
          <img src={noResultsImg} alt="noResults" />
          <EmptyMsg>Nenhum pilar encontrado.</EmptyMsg>
        </EmptyContainer>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Novo Coordenador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              nome: '',
              email: '',
              celular: '',
              roleId: 2,
              status
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
                <Field
                  name="celular"
                  label="Celular"
                  mask="(99) 9 9999-9999"
                  maskChar=" "
                  component={CustomPhoneInputMask}
                />
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Field
                    as={Form.Control}
                    type="text"
                    name="email"
                    isInvalid={!!errors.email && touched.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

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
          <Modal.Title>Editar Coordenador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCoord && (
            <Formik
              initialValues={{
                id: selectedCoord.id,
                nome: selectedCoord.name,
                email: selectedCoord.email,
                celular: selectedCoord.cellPhone,
                status: selectedCoord.status,
                roleId: selectedCoord.roleId
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateCoord}
            >
              {({ values, setSubmitting, isSubmitting, errors, touched }) => (
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
                    <Form.Label>Email</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="email"
                      isInvalid={!!errors.email && touched.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Field
                    name="celular"
                    label="Celular"
                    mask="(99) 9 9999-9999"
                    maskChar=" "
                    component={CustomPhoneInputMask}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '10px'
                    }}
                  >
                    <MySelect label="Status" name="status" width="50%">
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                    </MySelect>
                  </div>
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
                    <CustomActionsEditModal>
                      <Button
                        variant="outline-primary"
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          handleSendNewPassword(
                            {
                              id: values.id,
                              email: values.email
                            },
                            setSubmitting
                          )
                        }
                      >
                        Envia nova senha
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Atualizar
                      </Button>
                    </CustomActionsEditModal>
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

export default Pillar;
