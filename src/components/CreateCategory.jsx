import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const CreateCategoryForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 40%;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.h2`
  margin-bottom: 20px;
`;

const InputField = styled.input`
  display: block;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 95%;
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

function SelectInput({ name, value, onChange }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '10px'
      }}
    >
      <option value="">Seleccione categoria</option>
      <option value="imagen">imagen</option>
      <option value="video">video</option>
      <option value="texto">texto</option>
    </select>
  );
}


function CreateCategory({ token }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/categories`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.message || 'Categoría creada con éxito');
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error al crear la categoría');
    }
  };

  return (
    <Container>
      <CreateCategoryForm onSubmit={handleSubmit}>
        <Header>Crear Nueva Categoría</Header>
        <SelectInput
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción de la categoría"
          required
        />
        <Button type="submit">Crear Categoría</Button>
        {message && <p style={{color: message.startsWith('Error') ? 'red' : 'green'}}>{message}</p>}
      </CreateCategoryForm>
    </Container>
  );
}

export default CreateCategory;