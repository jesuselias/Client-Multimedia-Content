import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const RegisterClient = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Ocurrió un error al registrar al cliente.');
    }
  };

  const handleBack = () => {
    setMessage('');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: ''
    });
    navigate('/');
  };

  return (
    <Container>
      <FormContainer>
        <h2>Registro de Usuario</h2>
        <Row>
          <Column>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nombre de usuario"
              required
            />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              <option value="Lector">Lector</option>
              <option value="Creador">Creador</option>
            </Select>
          </Column>
        </Row>
        <Button onClick={handleBack} style={{marginRight: '10px'}}>Regresar</Button>
        <Button type="submit" onClick={handleSubmit}>Registrar</Button>
        {message && <p style={{color: message.startsWith('Error') ? 'red' : 'green'}}>{message}</p>}
      </FormContainer>
    </Container>
  );
};

// Estilos con styled-components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 25%;
  max-width: 600px;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
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

export default RegisterClient;
