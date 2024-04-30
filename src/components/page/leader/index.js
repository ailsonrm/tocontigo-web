import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Modal, Form, Card, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Page from '../../page';
import { ContextUser } from '../../../providers/ContextUser';
import { FaUsers } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import {
  Formik,
  Field,
  ErrorMessage,
  Form as FormikForm,
  useField
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

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().required('Email é obrigatório'),
  managedBy: Yup.string().required('Responsável é obrigatório')
});

const Leader = ({ managedBy, fetchDashboardData }) => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const [showModal, setShowModal] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [searchLeaderResult, setSearchLeaderResult] = useState([]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
      meta: Number(values.meta) || 100,
      roleId: 3,
      managedBy
    };

    const response = await api
      .post('/usersTC', formattedValues)
      .then(response => {
        resetForm();
        setShowModal(false);
        showSnackbar('Lider cadastrado com sucesso!', 'success');
        fetchLeaders();
      })
      .catch(error => {
        console.error('Erro na API', error.response.data.error);
        showSnackbar(error.response.data.error, 'error');
      });
    setSubmitting(false);
  };

  function fetchLeaders() {
    api
      .get(`/usersTC/leaders`)
      .then(response => {
        setLeaders([]);
        setLeaders(response.data);
        setSearchLeaderResult(response.data);
      })
      .catch(() => {})
      .finally(() => {});
  }

  useEffect(() => {
    fetchLeaders();
  }, []);

  function sumAllOwnedVoters(manages, ownedVoters) {
    let totalVoters = 0;

    manages.forEach(manage => {
      totalVoters += manage.ownedVoters.length;
    });

    return totalVoters + ownedVoters;
  }

  function calcPercentageMeta(totalVoters, meta) {
    if (
      typeof totalVoters !== 'number' ||
      typeof meta !== 'number' ||
      meta === 0
    ) {
      console.error('Invalid input:', totalVoters, meta);
      return 0;
    }
    return (totalVoters * 100) / meta;
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
        data={leaders}
        fields={['name', 'email']}
        placeholder="Busque por lideranças..."
        setSearchResult={setSearchLeaderResult}
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
          Novo Líder
          <FaUsers
            style={{
              fontSize: 20
            }}
          />
        </Button>
        <Button
          variant="outline-success"
          onClick={() => {
            fetchLeaders();
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

      {searchLeaderResult.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: '10px'
          }}
        >
          {[...searchLeaderResult]
            .sort((a, b) => {
              const totalVotersA = sumAllOwnedVoters(
                a.manages,
                a.ownedVoters.length
              );
              const totalVotersB = sumAllOwnedVoters(
                b.manages,
                b.ownedVoters.length
              );
              return totalVotersB - totalVotersA;
            })
            .map((leader, index) => (
              <div key={leader.id} style={{ width: '311px' }}>
                <Card>
                  <Card.Body>
                    <Card.Title
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {leader.name}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {leader.email}
                    </Card.Subtitle>
                    <Card.Text
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        Apoiadores:{' '}
                        {sumAllOwnedVoters(
                          leader.manages,
                          leader.ownedVoters.length
                        )}
                      </div>
                      <div>Meta: {leader.meta || 0}</div>
                      <div>
                        {calcPercentageMeta(
                          sumAllOwnedVoters(
                            leader.manages,
                            leader.ownedVoters.length
                          ),
                          leader.meta
                        )}
                        %
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
        </div>
      ) : (
        <EmptyContainer>
          <img src={noResultsImg} alt="noResults" />
          <EmptyMsg>Nenhuma liderança encontrado.</EmptyMsg>
        </EmptyContainer>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Novo Líder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              nome: '',
              email: '',
              meta: 100,
              roleId: 3,
              managedBy
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <FormikForm>
                <div
                  style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
                >
                  <Form.Group className="mb-3" style={{ width: '85%' }}>
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
                  <Form.Group className="mb-3" style={{ width: '15%' }}>
                    <Form.Label>Meta</Form.Label>
                    <Field
                      as={Form.Control}
                      type="text"
                      name="meta"
                      isInvalid={!!errors.meta && touched.meta}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.meta}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

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
    </div>
  );
};

export default Leader;
