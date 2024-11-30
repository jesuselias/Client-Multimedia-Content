import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const CreateThemesForm = styled.form`
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

function SelectInput({ name, options, value, onChange }) {
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
        <option value="">Seleccione una opción</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    );
  }

function CreateThemes({ token }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contentTypes: [],
    permissions: []
  });
  const [themes, setThemes] = useState([]);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, [token]); // Agrega token aquí

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => {
      const newState = { ...prevData };
      
      if (type === 'checkbox') {
        // Para checkboxes, solo cambiamos el valor booleano
        newState.permissions = newState.permissions.map((permission, index) => {
          if (name.startsWith(`permissions.${index}.`) && name.endsWith(permission.name)) {
            permission[name.split('.').pop()] = checked;
          }
          return permission;
        });
      } else {
        // Para otros inputs, actualizamos su valor
        newState[name] = value;
      }
      
      return newState;
    });
  };

 

  const handleChangeCategory = (e) => {
    const { value } = e.target;

  
    setFormData(prevData => {
      const newState = {
        ...prevData,
        permissions: prevData.permissions.map((permission, index) => {
          if (index === prevData.permissions.length - 1) {
            // Solo modificamos el último elemento de permissions
            return {
              ...permission,
              category: value
            };
          }
          return permission;
        })
      };
  
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Primero, validamos si la temática ya existe
      const existingTheme = themes.find(t => t.name.toLowerCase() === formData.name.toLowerCase());
      if (existingTheme) {
        setMessage('La temática ya existe');
        return;
      }

        // Preparamos los datos para enviar
        const preparedData = {
            name: formData.name,
            description: formData.description,
            contentTypes: formData.contentTypes,
            permissions: formData.permissions.map(permission => ({
                category: permission.category,
                read: permission.read,
                write: permission.write
            }))
            };

      // Luego, creamos la nueva temática
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/themes`, preparedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Si todo salió bien, actualizamos el estado de temas
      setThemes([...themes, response.data]);
      setMessage(response.data.message || 'Temática creada con éxito');
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error al crear la temática');
    }
  };

  const handleContentTypeChange = (value, isChecked) => {
    setFormData(prevData => ({
      ...prevData,
      contentTypes: isChecked 
        ? [...prevData.contentTypes, value]
        : prevData.contentTypes.filter(type => type !== value)
    }));
  };

  const handleContentPermission = (field, isChecked) => {
    setFormData(prevData => ({
      ...prevData,
      permissions: prevData.permissions.map((permission, index) => {
        if (index === formData.permissions.length - 1) {
          // Solo modificamos el último elemento de permissions
          return {
            ...permission,
            [field]: isChecked
          };
        }
        return permission;
      })
    }));
  };

  const addPermission = () => {
    setFormData(prevData => ({
      ...prevData,
      permissions: [...prevData.permissions, { category: '', read: false, write: false }]
    }));
  };

  const removePermission = (index) => {
    setFormData(prevData => ({
      ...prevData,
      permissions: prevData.permissions.filter((_, i) => i !== index)
    }));
  };

  const themeOptions = [
    { value: "ciencias", label: "Ciencias" },
    { value: "matematicas", label: "Matemáticas" },
    { value: "deporte", label: "Deporte" }
  ];

  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));


  return (
    <Container>
      <CreateThemesForm onSubmit={handleSubmit}>
        <Header>Crear Nueva Temática</Header>
        {/* Seleccionar nombre de la temática */}
         <SelectInput
          name="name"
          options={themeOptions}
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción de la temática"
          required
        />
        <Button type="submit">Crear Temática</Button>
        {message && <p style={{color: message.startsWith('Error') ? 'red' : 'green'}}>{message}</p>}
        {/* Seleccionar permisos de contenidos */}
        <h3>Permisos de Contenidos:</h3>
        <div>
          {['images', 'videos', 'texts'].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={formData.contentTypes.includes(type)}
                onChange={(e) => handleContentTypeChange(type, e.target.checked)}
              />
              Permite {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        {/* Agregar permisos */}
        <h3>Permitir acceso a categorías:</h3>
        <button onClick={(e) => {
            e.preventDefault(); // Evita que se propague el evento
            addPermission();
        }}>Agregar Permiso</button>
       {formData.permissions.map((permission, index) => (
       
       <div key={index} style={{ marginBottom: '20px',marginTop: '20px' }}>

    {/* Seleccionar nombre de la categoría */}
        <SelectInput
          name="categorie"
          options={categoryOptions}
          value={categoryOptions.id}
          onChange={(e) => handleChangeCategory(e)}
        /> 
        <label style={{ marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={permission.read}
          onChange={(e) => handleContentPermission('read', e.target.checked)}
        />
        Leer
      </label>
      <label style={{ marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={permission.write}
          onChange={(e) => handleContentPermission('write', e.target.checked)}
        />
        Escribir
      </label>
    <button style={{ marginLeft: '20px' }} onClick={() => removePermission(index)}>Eliminar Permiso</button>
  </div>
))}
      </CreateThemesForm>
    </Container>
  );
}

export default CreateThemes;