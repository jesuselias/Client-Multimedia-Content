import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ContentView = ({ themeId, token, username }) => {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchContents = async () => {
      if (!themeId) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/content/${themeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (Array.isArray(response.data)) {
          setContents(response.data);
        } else {
          throw new Error("La respuesta no es un array");
        }
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError('Error al obtener los contenidos');
      }
    };



    fetchContents();
  }, [themeId, token]);

  useEffect(() => {
    const loadImages = async () => {
      if (!contents.length) return;

      try {
        const imagesObject = {};
        let imageCount = 0;

        for (const content of contents) {
          if (content.type === 'imagen') {
            console.log('Cargando imagen para:', content._id);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/img-content/${content._id}`);
            console.log('Respuesta:', response.data);
            
            imagesObject[content._id] = response.data.image;
            imageCount++;
            console.log('Imagen cargada:', content._id, response.data.image);
          }
        }

        setImages(prevImages => ({
          ...prevImages,
          ...imagesObject
        }));

        console.log("images", images);

        if (imageCount > 0 && contents.length > 0) {
          console.log(`Total de imágenes cargadas: ${imageCount}`);
        } else {
          console.warn("No se han cargado imágenes o no hay contenido");
        }

      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
    // eslint-disable-next-line
  }, [contents]);

  const downloadFile = async (contentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/download-content/${contentId}`, {
        responseType: 'blob',
        timeout: 50000,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/octet-stream'
        }
      });
  
      console.log('Respuesta recibida:', response);
  
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Establecer el nombre del archivo basándose en su tipo
      let fileName = `archivo_${contentId}`;
      if (response.headers['content-type'].includes('video')) {
        fileName += '.mp4';
      } else if (response.headers['content-type'].includes('audio')) {
        fileName += '.mp3';
      } else if (response.headers['content-type'].includes('pdf')) {
        fileName += '.pdf';
      } else if (response.headers['content-type'].includes('docx')) {
        fileName += '.docx';
      }
      
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log(`Archivo descargado correctamente: ${contentId}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      
      let errorMessage = 'Ha ocurrido un error al descargar el archivo.';
      if (axios.isCancel(error)) {
        errorMessage += ' La operación ha sido cancelada.';
      } else if (error.response) {
        // El servidor respondió, pero con un estado de error
        errorMessage += ` Código de error: ${error.response.status}, Mensaje: ${error.response.data}`;
      } else if (error.request) {
        // No se recibió respuesta desde el servidor
        errorMessage += 'No se recibió respuesta desde el servidor.';
      } else {
        errorMessage += `Error: ${error.message}`;
      }
  
      alert(errorMessage);
    }
  };

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!themeId) {
    return <p>No hay contenidos para mostrar. Por favor, seleccione un tema.</p>;
  }

  return (
    <Container>
      <ContentsContainer>
        <h3 style={{ color:"white", width: '100%', marginBottom: '7px' }}>Listado de contenidos</h3>
        <ContentsList style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {contents.map((content, index) => (
            <ContentItem key={index} style={{ flex: '0 0 25%' }}>
              {content.type === 'imagen' ? (
                images[content._id] ? (
                  <ContainerT>
                  <ContentImage 
                    src={images[content._id]} 
                    alt={content.title} 
                    onError={(e) => {
                      e.target.src = require('../assets/img/logo-multimedia.png');
                      console.log('Error al cargar la imagen:', content._id);
                    }}
                  />
                  </ContainerT>
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>No se pudo cargar la imagen</div>
                )
                
              ) : content.type === 'video' ? (
                <ContainerT>
                <ContentVideo src={`https://www.youtube.com/embed/${new URL(content.videoUrl).searchParams.get('v')}`} title={content.title} />
                </ContainerT>
              ) :  (
                <ContainerT>
                <ContentArchivo>
                  
                  {content.file && (
                    <button onClick={() => downloadFile(content._id)} style={{ marginTop: '100px' }}>
                      Descargar archivo
                    </button>
                  )}
                 
                </ContentArchivo>
                </ContainerT>
              )}
              <ContentInfo>
                <h4>{content.title}</h4>
                <p>{content.description || "No hay descripción disponible"}</p>
                <small>Creador: {content.credits || "Creador desconocido"}</small>
              </ContentInfo>
            </ContentItem>
          ))}
        </ContentsList>
      </ContentsContainer>
    </Container>
  );
};



const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
 
`;


const ContentsContainer = styled.div`
  border-radius: 8px;
  width: 100%;
  //background-image: linear-gradient(to bottom right, #e3e2e2, #cacaca);
  background-color: #000000;

`;

const ContentsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;


const ContentItem = styled.li`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 320px; /* Ajustado para incluir el contenido de información */
    flex: 0 0 33.333%; /* Ajusta el ancho a 1/3 del contenedor */
  min-width: 420px; /* Ancho mínimo para asegurar suficiente espacio */
  display: flex;
  flex-direction: column;
`;


const ContentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 5px;
  display: block;
`;

const ContainerT = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  background-image: linear-gradient(to bottom right, #333, #555);
`;

const ContentArchivo = styled.p`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 5px;
  display: block;
`;

const ContentVideo = styled.iframe`
  width: 100%;
  height: 240px;
   object-fit: cover;
  border-radius: 5px;
  display: block;
`;

const ContentInfo = styled.div`
  padding: 7px;
  background-image: linear-gradient(to bottom right, #333, #555);
  color: white;
  flex-grow: 1; /* Esto hará que el contenido de información ocupe el espacio restante */
`;

const ErrorText = styled.p`
  color: red;
  margin-bottom: 20px;
`;

export default ContentView;
