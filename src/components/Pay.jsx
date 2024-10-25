import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Pay = () => {
  const [formData, setFormData] = useState({
    documento: '',
    celular: '',
    valor: ''
  });

  const [sessionFormData, setSessionFormData] = useState({
    sessionId: ''
  });
  
  const [message, setMessage] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setFormData({
        documento: '',
        celular: '',
        valor: ''
      });
      setSessionFormData({ sessionId: '' });
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'sessionId') {
      setSessionFormData({ sessionId: e.target.value });
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/pay-email', formData);
      setMessage(response.data.message);
      setIsPaymentConfirmed(true);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Ocurrió un error al enviar el correo.');
    }
  };

  const handleBack = () => {
    setMessage('');
    setFormData({
      documento: '',
      celular: '',
      valor: ''
    });
    setSessionFormData({ sessionId: '' });
    setIsPaymentConfirmed(false);
    navigate('/'); // Redirigir a la página principal
  };  

  const handleConfirmPayment = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/confirm-payment', {
        ...formData,
        sessionId: sessionFormData.sessionId
      });
      console.log('Pago confirmado con éxito');
      setMessage(response.data.message);
      setTimeout(() => {
        handleBack();
      }, 3000); // Muestra el mensaje por 3 segundos antes de redirigir
    } catch (error) {
      console.error('Ocurrió un error al confirmar el pago:', error.response ? error.response.data.message : 'Error desconocido');
      setMessage(error.response ? error.response.data.message : 'Error al confirmar el pago');
    }
  };

  return (
    <Container>
      {isPaymentConfirmed ? (
        <ConfirmationForm>
          <h2>Confirmación de Pago</h2>
          <Input
            type="number"
            name="valor"
            value={formData.valor}
            onChange={(e) => handleChange(e)}
            placeholder="Valor a pagar"
            required
          />
         <Input
          type="text"
          name="sessionId"
          defaultValue={sessionFormData.sessionId}
          onChange={(e) => handleChange(e)}
          placeholder="ID de sesión"
          required
        />
          <Button onClick={handleConfirmPayment}>Confirmar Pago</Button>
          {message && <p style={{color: message.startsWith('Error') ? 'red' : 'green'}}>{message}</p>}
        </ConfirmationForm>
      ) : (
        <FormContainer>
          <h2>Pagar por Correo Electrónico</h2>
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
                placeholder="Valor a pagar"
                required
              />
            </Column>
          </Row>
          <Button onClick={handleBack} style={{marginRight: '10px'}}>Regresar</Button>
          <Button type="submit" onClick={handleSubmit}>Pagar</Button>
          {message && <p style={{color: message.startsWith('Error') ? 'red' : 'green'}}>{message}</p>}
        </FormContainer>
      )}
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

const ConfirmationForm = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 40%;
`;

export default Pay;
