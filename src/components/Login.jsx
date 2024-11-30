import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Agrega esta línea
import logo from '../assets/img/logo-multimedia.png'
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  max-width: 20%;
  margin: 0 auto;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorText = styled.span`
  color: red;
`;

function Login({ onSuccess }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      // Aquí iría la lógica real para enviar una solicitud POST al servidor
      const response = await axios.post('http://localhost:4000/api/user/login', credentials);

      // Devolvemos un objeto con token y role
      onSuccess(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      console.error('Error:', err.response?.data || err.message);
    }
  };

  return (
    <LoginContainer>
      <img src={logo} alt="Logo" style={{width: '100%', maxWidth: '117px'}} />
      <h1>Iniciar Sesión</h1>
      <LoginForm onSubmit={handleSubmit}>
        <Label>Usuario:</Label>
        <Input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <Label>Contraseña:</Label>
        <Input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit">Iniciar Sesión</Button>
        <Button 
          type="button"
          style={{ marginTop: '5px', backgroundColor: '#6c757d' }}
          onClick={() => navigate('/register')}
        >
          Registrarse
        </Button>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;

