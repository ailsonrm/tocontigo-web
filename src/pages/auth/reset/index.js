import React, { useContext, useState } from 'react';
import { ChangeEvent } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import SubmitButton from '../../../components/form/submit-button';
import Box from '../../../components/layout/box';
import { ContextUser } from '../../../providers/ContextUser';
import {
  AuthTitle,
  AuthSubTitle,
  AuthTitleContainer,
  CustomInputGroup,
  CustomFormControl,
  CustomInputGroupText,
  BsXCircleRed,
  BsCheckCircleGreen,
  PasswordErrosDesc,
  CustomListGroupItem,
  CustomFormControlFeedback
} from '../styled';

const Recover = ({ token, firstAccess }) => {
  const navigate = useNavigate();
  const { handleReset, handleLogout } = useContext(ContextUser);
  const [requesting, setRequesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    hasMinimumLimit: false,
    hasLowercaseLetter: false,
    hasUppercaseLatter: false,
    hasNumber: false
  });

  const passwordValidation = (value) => {
    const errors = {
      hasMinimumLimit: value.length >= 8,
      hasLowercaseLetter: /^(?=.*[a-z])/.test(value),
      hasUppercaseLatter: /^(?=.*[A-Z])/.test(value),
      hasNumber: /^(?=.*\d)/.test(value)
    };

    setPasswordErrors(errors);
    return (
      errors.hasMinimumLimit &&
      errors.hasLowercaseLetter &&
      errors.hasUppercaseLatter &&
      errors.hasNumber
    );
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      password2: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required('Campo obrigatório')
        .test('passwordValidation', passwordValidation),
      password2: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'As senhas não coincidem')
        .required('Campo obrigatório')
    }),
    onSubmit: values => {
      setRequesting(true);
      return handleReset(token, values.password).finally(() =>
        setRequesting(false)
      );
    }
  });

  const { values, handleChange, handleSubmit, errors } = formik;

  const eyeIcon = (show, ref) =>
    show ? (
      <BsEye onClick={() => ref(!show)} />
    ) : (
      <BsEyeSlash onClick={() => ref(!show)} />
    );

  const passwordValidIcon = (valid) =>
    valid ? <BsCheckCircleGreen /> : <BsXCircleRed />;

  return (
    <>
      {firstAccess ? (
        <AuthTitleContainer>
          <AuthTitle>Redefinição de senha para primeiro acesso</AuthTitle>
          <AuthSubTitle>
            Bem-vindo à nossa plataforma! Para garantir a segurança de sua
            conta, solicitamos que você redefina sua senha.
          </AuthSubTitle>
        </AuthTitleContainer>
      ) : (
        <AuthTitle>Redefinir senha</AuthTitle>
      )}

      <Box style={{ maxWidth: 400, width: '100%' }}>
        <div className="forgot">
          <div className="box">
            <form onSubmit={handleSubmit} action="">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Nova senha</Form.Label>
                <CustomInputGroup>
                  <CustomFormControl
                    placeholder="Digite a nova senha"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={(e) => {
                      passwordValidation(e.target.value);
                      handleChange(e);
                    }}
                    isInvalid={Boolean(errors.password)}
                  />
                  <CustomInputGroupText>
                    {eyeIcon(showPassword, setShowPassword)}
                  </CustomInputGroupText>
                  <Form.Control.Feedback type="invalid">
                    <ListGroup variant="flush">
                      <CustomListGroupItem>
                        {passwordErrors.hasMinimumLimit ? (
                          <BsCheckCircleGreen />
                        ) : (
                          <BsXCircleRed />
                        )}
                        <PasswordErrosDesc>
                          Mínimo 8 caracteres
                        </PasswordErrosDesc>
                      </CustomListGroupItem>
                      <CustomListGroupItem>
                        {passwordValidIcon(passwordErrors.hasNumber)}
                        <PasswordErrosDesc>Números</PasswordErrosDesc>
                      </CustomListGroupItem>
                      <CustomListGroupItem>
                        {passwordValidIcon(passwordErrors.hasUppercaseLatter)}
                        <PasswordErrosDesc>Letras maiúsculas</PasswordErrosDesc>
                      </CustomListGroupItem>
                      <CustomListGroupItem>
                        {passwordValidIcon(passwordErrors.hasLowercaseLetter)}
                        <PasswordErrosDesc>Letras minúsculas</PasswordErrosDesc>
                      </CustomListGroupItem>
                    </ListGroup>
                  </Form.Control.Feedback>
                </CustomInputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Confirme a senha</Form.Label>
                <CustomInputGroup>
                  <CustomFormControl
                    placeholder="Confirme a nova senha"
                    type={showPassword2 ? 'text' : 'password'}
                    name="password2"
                    id="password2"
                    value={values.password2}
                    onChange={handleChange}
                    isInvalid={Boolean(errors.password2)}
                  />
                  <CustomInputGroupText>
                    {eyeIcon(showPassword2, setShowPassword2)}
                  </CustomInputGroupText>
                  <CustomFormControlFeedback type="invalid">
                    {errors.password2}
                  </CustomFormControlFeedback>
                </CustomInputGroup>
              </Form.Group>
              <SubmitButton
                type="submit"
                loading={requesting}
                block={false}
                fullwidth
              >
                Definir nova senha
              </SubmitButton>
            </form>
          </div>
        </div>
      </Box>
      <Button
        variant="link"
        className="mt-2 mb-2"
        onClick={() => {
          handleLogout();
          navigate('/acessar');
        }}
      >
        Retornar ao login
      </Button>
    </>
  );
};

export default Recover;
