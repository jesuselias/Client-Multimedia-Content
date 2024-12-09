// PhindChatComponent.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 60px; // Ajusta esta posición

  width: 300px;
  height: 50%; // Calcula la altura restante de la pantalla
  background-color: #333333; // Cambia el fondo a negro oscuro
  border: 1px solid #444444;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background-color: #333;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatBody = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  &.user-message {
    background-color: #727272;
    align-self: flex-end;
  }
  &.ai-message {
    background-color: #1d1b1b;
    align-self: flex-start;
  }
  pre { // Estilo para contenido preformateado (como código)
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
    background-color: #000;
    color: #fff;
    padding: 4px;
    border-radius: 2px;
  }
`;

const ChatInput = styled.input`
  width: 94%;
  padding: 10px;
  border: none;
  border-top: 1px solid #ddd;
  color: white;
  background-color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const PhindChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll al final del chat cuando se añade un nuevo mensaje
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [messages]);

  const API_KEY = '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'; // Reemplaza con tu API key real

// ... (código anterior permanece igual)

const handleSubmit = async (e) => {
  e.preventDefault();
  if (inputValue.trim()) {
    setMessages(prevMessages => [...prevMessages, { text: inputValue, type: 'user' }]);
    setInputValue('');
    
    try {
      setIsLoading(true);
      const response = await axios.post(`https://openrouter.ai/api/v1/chat/completions`, {
        model: "amazon/nova-micro-v1",
        messages: [
          { role: "system", content: "You are an AI assistant." },
          { role: "user", content: inputValue }
        ],
        transforms: ["middle-out"],
        max_tokens: 0
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      console.log('Response data:', response.data);
      
      if (Array.isArray(response.data.choices)) {
        const aiMessage = response.data.choices[0]?.message?.content;
        if (aiMessage) {
          setMessages(prevMessages => [
            ...prevMessages,
            { 
              text: aiMessage, 
              type: 'ai', 
              timestamp: new Date().toISOString() 
            }
          ]);
        } else {
          console.log('No se encontró el mensaje del asistente AI');
          setMessages(prevMessages => [...prevMessages, { text: 'No se obtuvo respuesta esperada.', type: 'ai' }]);
        }
      } else {
        console.log('La estructura de la respuesta no es esperada');
        setMessages(prevMessages => [...prevMessages, { text: 'No se obtuvo respuesta esperada.', type: 'ai' }]);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessages(prevMessages => [...prevMessages, { text: 'Lo siento, hubo un error al obtener la respuesta.', type: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  }
};

return (
    <ChatContainer>
      <ChatHeader>
        <span style={{ color: '#ffffff' }}>Asistente de IA</span>
        <CloseButton style={{ color: '#ffffff' }}>&times;</CloseButton>
      </ChatHeader>
      <ChatBody className="chat-body">
        {messages.map((message, index) => (
          <Message 
            className={`${message.type}-message`} 
            key={index}
            style={{ color: '#ffffff' }}
          >
            {message.text}
          </Message>
        ))}
        {isLoading && <div style={{ color: '#ffffff', textAlign: 'center' }}>Cargando respuesta...</div>}
      </ChatBody>
      <form onSubmit={handleSubmit}>
        <ChatInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={isLoading}
   
        />
      </form>
    </ChatContainer>
  );
};


export default PhindChatComponent;