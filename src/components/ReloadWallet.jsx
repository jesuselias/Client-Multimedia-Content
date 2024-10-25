import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; 

const ReloadWallet = () => {
  const [formData, setFormData] = useState({
    documento: '',
    celular: '',
    valor: ''
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reload-wallet`, formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Ocurrió un error al cargar saldo.');
    }
  };

  const handleBack = () => {
    setMessage('');
    setFormData({
      documento: '',
      nombres: '',
      email: '',
      celular: ''
    });
    navigate('/'); // Redirigir a la página principal
  };

  return (
    <Container>
      <FormContainer>
        <h2>Cargar Saldo en Billetera</h2>
        <Row>
          <Column>
            <Input
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Número de documento"
              required
            />
            <Input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Número de teléfono"
              required
            />
          </Column>
          <Column>
            <Input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              placeholder="Valor a cargar"
              required
            />
          </Column>
        </Row>
        <Button onClick={handleBack} style={{marginRight: '10px'}}>Regresar</Button>
        <Button type="submit" onClick={handleSubmit}>Cargar Saldo</Button>
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
  min-height: 100vh;
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 40%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: calc(50% - 20px);
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

export default ReloadWallet;