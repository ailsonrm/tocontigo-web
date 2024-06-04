import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  Formik,
  Field,
  Form as FormikForm,
  useField,
  useFormikContext
} from 'formik';
import * as Yup from 'yup';
import { Button, Form, Spinner } from 'react-bootstrap';
import { api } from '../../providers/apiClient';
import InputMask from 'react-input-mask';
import { ContextUser } from '../../providers/ContextUser';
import logo from '../../assets/logo-tocontigo.png';

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

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f9fa;
`;

const cleanPhoneNumber = phoneNumber => {
  return phoneNumber.replace(/\D/g, '');
};

const PageSelfRegister = () => {
  const { currentUser, showSnackbar } = useContext(ContextUser);
  const { selfurl } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const [isFetchingOwner, setIsFetchingOwner] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const fullUrl = window.location.href;
      const selfurlPart = fullUrl.split('/').pop();

      const formattedValues = {
        selfid: selfurlPart
      };

      try {
        const response = await api.post('/auth/ownerData', formattedValues);
        setOwnerId(response.data.user.id);
      } catch (error) {
        console.error('Erro ao buscar dados do proprietário', error);
      } finally {
        setIsFetchingOwner(false);
      }
    };

    fetchOwnerData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);

    console.log('AUI', ownerId);

    const formattedValues = {
      name: values.nome,
      motherName: values.nomeMae,
      birthDate: values.dataNascimento,
      gender: values.genero,
      cellPhone: cleanPhoneNumber(values.celular),
      ownerId: Number(ownerId),
    };


    try {
      await api.post('/votersTC/self', formattedValues);
      showSnackbar('Apoiador cadastrado com sucesso!', 'success', { vertical: 'top', horizontal: 'right' });
      setRegistered(true);
    } catch (error) {
      console.error('Erro na API', error.response.data.error);
      showSnackbar(error.response.data.error, 'error', { vertical: 'top', horizontal: 'right' });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
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
      <Form.Group className="mb-3 w-50">
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
        justifyContent: 'center',
        padding: '0 20px'
      }}
    >
      {registered ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '35px'
          }}
        >
          <a>
            <img
              style={{
                maxWidth: '250px',
                marginTop: '10px'
              }}
              src={logo}
              alt=""
            />
          </a>
          <h1>Obrigado por declarar seu apoio!</h1>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '35px'
            }}
          >
            <a>
              <img
                style={{
                  maxWidth: '250px',
                  marginTop: '10px'
                }}
                src={logo}
                alt=""
              />
            </a>
            <h1>Seja nosso apoiador!</h1>
          </div>
          <FormContainer>
            <Formik
              initialValues={{
                nome: '',
                nomeMae: '',
                dataNascimento: '',
                genero: '',
                celular: '',
                ownerId: Number(ownerId)
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
                      alignItems: 'baseline',
                      gap: '10px'
                    }}
                  >
                    <CustomSelect
                      label="Gênero"
                      name="genero"
                      style={{ with: '50%' }}
                    >
                      <option value="">Selecione um gênero</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </CustomSelect>
                    <Field
                      name="celular"
                      label="Celular"
                      mask="(99) 9 9999-9999"
                      maskChar=" "
                      component={CustomPhoneInputMask}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
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
          </FormContainer>
        </div>
      )}
    </div>
  );
};

export default PageSelfRegister;
