import React, { useState, useContext } from 'react';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { Alert, Form, Button, InputGroup } from 'react-bootstrap';
import '../../../app/custom-bootstrap-colors.scss';
import Box from '../../../components/layout/box';
import { ContextUser } from '../../../providers/ContextUser';
import {
  AuthTitle,
  CustomInputGroupText,
  CustomFormControl,
  CustomInputGroup
} from '../styled';
import SubmitButton from '../../../components/form/submit-button';

const handleAction = () => {};

const Login = ({ handleAction }) => {
  const [warning, setWarning] = useState();
  const [requesting, setRequesting] = useState(false);
  const [fields, setFields] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(ContextUser);

  const handleChange = e => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setRequesting(true);
    handleLogin(fields).finally(() => setRequesting(false));
  };

  const eyeIcon = (show, ref: value => void) =>
    show ? (
      <BsEye onClick={() => ref(!show)} />
    ) : (
      <BsEyeSlash onClick={() => ref(!show)} />
    );

  return (
    <>
      <Box style={{ maxWidth: 400, width: '100%' }}>
        <div className="login">
          {warning && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => {
                setWarning(null);
              }}
            >
              {warning}
            </Alert>
          )}
          <div className="box">
            <form onSubmit={handleSubmit} action="">
              <Form.Group className="mb-3">
                <CustomFormControl
                  placeholder="Seu email"
                  type="email"
                  name="email"
                  id="email"
                  value={fields.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <CustomInputGroup>
                  <CustomFormControl
                    placeholder="Senha"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    value={fields.password}
                  />
                  <CustomInputGroupText>
                    {eyeIcon(showPassword, setShowPassword)}
                  </CustomInputGroupText>
                </CustomInputGroup>
              </Form.Group>
              <SubmitButton
                type="submit"
                loading={requesting}
                block={false}
                fullwidth
                variant="custom"
              >
                Entrar
              </SubmitButton>
            </form>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Login;
