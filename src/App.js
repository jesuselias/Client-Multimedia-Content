import React from 'react';
import './App.css';
import styled from 'styled-components';
import billetera from './assets/img/billetera.png';

// Estilos para el contenedor principal
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
`;

// Estilos para el botón personalizado
const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: translateY(1px);
  }
`;

function App() {
  return (
    <AppContainer>
       <img src={billetera} alt="Billetera" style={{width: '100%', maxWidth: '117px'}} />
      <h1>Billetera Virtual</h1>
      <div className="button-group">
         <StyledButton onClick={() => window.location.href = '/register'}>
          Registro Clientes
        </StyledButton>
        <StyledButton onClick={() => window.location.href = '/reload-wallet'}>
          Recarga Billetera
        </StyledButton>
        <StyledButton onClick={() => window.location.href = '/pay'}>
          Pagar
        </StyledButton>
        <StyledButton onClick={() => window.location.href = '/check-balance'}>
          Consultar Saldo
        </StyledButton>
      </div>
    </AppContainer>
  );
}

export default App;
