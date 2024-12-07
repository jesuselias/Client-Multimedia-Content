import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const CreateContentsForm = styled.form`
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

  ${({ disabled }) =>
    disabled &&
    `
      background-color: #f0f0f0;
      color: #666;
      cursor: not-allowed;
      opacity: 0.8;
    `}
`;

const Select = styled.select`
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

const ErrorText = styled.span`
  color: red;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  margin-bottom: 10px;
`;

function CreateContents({ token, userRole }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    videoUrl: '',
    themeId: '',
    creatorId: '',
    credits: '',
    createdAt: new Date().toISOString()
  });
  const [themes, setThemes] = useState([]);
  const [creators, setCreators] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [contentType, setContentType] = useState('');
  const [image, setImage] = useState(null);
  const [videoUrl, setvideoUrl] = useState('');
  const [file, setFile] = useState(null);
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
    
    const fetchThemes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/list-themes`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setThemes(response.data);
      } catch (error) {
        setErrors(error)
        console.error('Error fetching themes:', error);
        setMessage('Error al cargar los temas');
      }
    };
    
  
    const fetchCreators = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && Array.isArray(response.data.creators)) {
          setCreators(response.data.creators);
        } else {
          console.error('La respuesta no contiene un array de creadores');
          setCreators([]); // Establece un array vacío si la respuesta no es válida
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
        setMessage('Error al cargar los creadores');
        setCreators([]); // Establece un array vacío en caso de error
      }
    };

    fetchCategories();
    fetchThemes();
    fetchCreators();
  }, [token]);

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formData.title) newErrors.title = 'El título es requerido';
  //   if (!formData.type) newErrors.type = 'El tipo de contenido es requerido';
  //   if (!formData.url) newErrors.url = 'La URL es requerida';
  //   if (!formData.theme) newErrors.theme = 'El tema es requerido';
  //   if (!formData.creator) newErrors.creator = 'El creador es requerido';
  //   if (!formData.credits) newErrors.credits = 'Los créditos son requeridos';

  //   // Validación de URL según el tipo de contenido
  //   if (formData.type === 'imagen' && !formData.url.endsWith('.jpg') && !formData.url.endsWith('.png')) {
  //     newErrors.url = 'La URL de la imagen debe terminar en .jpg o .png';
  //   } else if (formData.type === 'video' && !formData.url.endsWith('.mp4')) {
  //     newErrors.url = 'La URL del video debe terminar en .mp4';
  //   } else if (formData.type === 'text' && !formData.url.startsWith('http')) {
  //     newErrors.url = 'La URL del texto debe ser una URL válida';
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name === 'creator') {
        const selectedCreator = creators.find(creator => creator._id === value);
        return {
          ...prevFormData,
          [name]: value,
          creatorId: selectedCreator ? selectedCreator._id : '',
          credits: selectedCreator ? selectedCreator.username : ''
        };
      } else if (name === 'theme') {
        const selectedTheme = themes.find(theme => theme._id === value);
        return {
          ...prevFormData,
          [name]: value,
          themeId: selectedTheme ? selectedTheme._id : ''
        };
      }
      return { ...prevFormData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contentData = {
        title: formData.title,
        type: contentType,
        themeId: formData.themeId,
        creatorId: formData.creatorId,
        credits: formData.credits
      };
  
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: "application/json, text/plain, */*"
        }
      };

      //let fileContent;
      let fileObject;
      if (contentType === 'imagen' || contentType === 'archivo' || contentType === 'video') {
        const formData = new FormData();
        
        formData.append('title', contentData.title);
        formData.append('type', contentData.type);
        formData.append('themeId', contentData.themeId);
        formData.append('creatorId', contentData.creatorId);
        formData.append('credits', contentData.credits);
  
        if (contentType === 'imagen') {
          formData.append('image', image);
        } else if (contentType === 'archivo') {
        //  fileContent = file?.content;
          fileObject = file?.originalFile;
          formData.append('file', fileObject);
        } else if (contentType === 'video') {
          formData.append('videoUrl', videoUrl);
        }
  
        console.log("formData", formData);
  
        await axios.post(`${process.env.REACT_APP_API_URL}/api/user/contents`, formData, axiosConfig);
      } else {
        throw new Error('Tipo de contenido no válido');
      }
  
      setMessage(<SuccessMessage>Contenido creado con éxito!</SuccessMessage>);
    } catch (error) {
      console.error('Error al crear el contenido:', error);
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage('Error al crear el contenido');
      }
    }
  };

  function covertToBase64(e) {
    console.log(e)
    var reader = new FileReader();
    console.log("console.log(e.target.files[0])",console.log(e.target.files[0]))
    reader.readAsDataURL(e.target.files[0])
    console.log(e.target.files[0])
    reader.onload = () => {
      console.log("aqui",reader.result)
      setImage(reader.result)
    }
  }


  function uploadFile(e) {
    console.log("Event:", e);
    console.log("Selected file:", e.target.files[0]);
  
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        console.log("File contents:", reader.result);
        setFile({ originalFile: file, content: reader.result });
      };
  
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setMessage('Error al leer el archivo seleccionado');
      };
  
      reader.onabort = () => {
        console.warn('File read aborted');
        setMessage('Leer del archivo abortado');
      };
  
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Para archivos .docx
        reader.readAsDataURL(file);
      } else if (file.type === 'text/plain') {
        // Para archivos de texto plano (.txt)
        reader.readAsText(file);
      } else {
        // Para otros tipos de archivos (incluyendo imágenes)
        reader.readAsDataURL(file);
      }
    }
  }


  return (
    <Container>
      <CreateContentsForm onSubmit={handleSubmit}>
        <Header>Crear Contenido</Header>
        {message && <ErrorText>{message}</ErrorText>}
        <InputField
          //type="texto"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título del contenido"
          required
        />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}
        <Select
          name="type"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          required
        >
        <option value="">Seleccione una Categoria</option>
          {categories.map(categorie => (
            <option key={categorie._id} value={categorie.name}>{categorie.name}</option>
          ))}
        </Select>
        {errors.type && <ErrorText>{errors.type}</ErrorText>}
        {contentType === 'imagen' ? (
          <InputField
            accept="image/*" 
            type="file"
            name="image"
            onChange={covertToBase64}
            required
          />
        ) : contentType === 'video' ? (
          <InputField
            type="url"
            name="videoUrl"
            value={videoUrl}
            onChange={(e) => setvideoUrl(e.target.value)}
            placeholder="URL de YouTube"
            required
          />
        ) : contentType === 'archivo' ? (
          <InputField
          type="file"
          name="file"
          onChange={uploadFile}
          required
        />
        ) : null}
        {errors.url && <ErrorText>{errors.url}</ErrorText>}
        <Select
          name="theme"
          value={formData.themeId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un tema</option>
          {themes.map(theme => (
            <option key={theme._id} value={theme._id}>{theme.name}</option>
          ))}
        </Select>
        {errors.theme && <ErrorText>{errors.theme}</ErrorText>}
        <Select
          name="creator"
          value={formData.creatorId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un creador</option>
          {Array.isArray(creators) && creators.length > 0 ? (
            creators.map(creator => (
              <option key={creator._id} value={creator._id}>{creator.username}</option>
            ))
          ) : (
            <option value="">No hay creadores disponibles</option>
          )}
        </Select>
        {errors.creator && <ErrorText>{errors.creator}</ErrorText>}
        <InputField
          type="text"
          name="credits"
          value={formData.credits}
          onChange={(e) => {
            // No permitimos que el usuario edite manualmente este campo
            e.preventDefault();
          }}
          placeholder="Créditos del creador"
          disabled
          required
        />
        {errors.credits && <ErrorText>{errors.credits}</ErrorText>}
        <Button type="submit">Crear Contenido</Button>
      </CreateContentsForm>
    </Container>
  );
}

export default CreateContents;