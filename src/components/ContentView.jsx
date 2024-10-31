import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Buffer } from 'buffer';

const ContentView = ({ themeId, token, username }) => {
  const [contents, setContents] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
  const [error, setError] = useState(null);
  const [loadImages, setLoadImages] = useState({});

  useEffect(() => {
    const fetchContents = async () => {
      console.log("URL de contenido:", `${process.env.REACT_APP_API_URL}/api/user/content/${themeId}`);
      console.log("Token de autenticación:", token);
      
      if (!themeId) {
        return; // Salimos si no hay un themeId válido
      }

      const url = `${process.env.REACT_APP_API_URL}/api/user/content/${themeId}`;
      console.log("URL:", url);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log("data", response.data);
        
        if (Array.isArray(response.data)) {
          setContents(response.data);
        } else {
          setError("La respuesta no es un array");
        }
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError('Error al obtener los contenidos');
      }
    };

    const fetchTotals = async () => {
      console.log("URL de totales:", `${process.env.REACT_APP_API_URL}/api/user/content-totals}`);
      
      if (!themeId) {
        return; // Salimos si no hay un themeId válido
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/content-totals`);
        console.log("response totals", response);
        setTotalImages(response.data.images);
        setTotalVideos(response.data.videos);
        setTotalTexts(response.data.texts);
      } catch (error) {
        console.error('Error fetching totals:', error);
        setError('Error al obtener los totales de contenidos');
      }
    };

    fetchContents();
    fetchTotals();
  }, [themeId, token]);

  useEffect(() => {
    const loadImages = async () => {
      console.log("Comenzando a cargar imágenes");
      console.log("contents", contents);
      
      const promises = contents.map(async (content) => {
        console.log("Procesando contenido:", content);
        try {
          if (content.type === 'imagen') {
            const buffer = Buffer.from(content.file.data, 'base64');
            const imageType = getMimeType(content.title);
            
            
            return {
              id: content._id,
              url: `data:${imageType};base64,${buffer.toString('base64')}`
            };
          } else if (content.type === 'texto') {
            console.log(`Texto: ${content.title}`);
            return { id: content._id.$oid, type: 'text' };
          }
          
          console.log("Tipo de contenido no soportado");
          return null;
        } catch (error) {
          console.error('Error procesando contenido:', error);
          return null;
        }
      });
      
      const results = Promise.all(promises);
      
      return results.then(results => {
        const newContentUrls = {};
        results.forEach((result) => {
          if (result && result.url) {
            newContentUrls[result.id] = result.url;
            console.log(`Cargado: ${JSON.stringify(result)}`);
          } else {
            console.log(`No se pudo cargar: ${JSON.stringify(result)}`);
          }
        });
        return newContentUrls;
      });
    };

    loadImages().then(images => {
      console.log("Imágenes cargadas:", images);
      setLoadImages(images);
    }).catch(error => {
      console.error("Error al cargar imágenes:", error);
    });
  }, [contents]);

  function getMimeType(filename) {
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript'
    };
  
    const ext = '.' + filename.split('.').pop();
    return mimeTypes[ext] || 'image/octet-stream';
  }

  return (
    <Container>
      <Header>
        <h2>Contenidos relacionados con "{username}"</h2>
      </Header>
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : !themeId ? (
        <p>No hay contenidos para mostrar. Por favor, seleccione un tema.</p>
      ) : (
        <>
          <TotalsContainer>
            <h3>Total de contenidos:</h3>
            <TotalsList>
              <li>imágenes: <strong>{totalImages}</strong> </li>
              <li>videos: <strong>{totalVideos}</strong> </li>
              <li>textos: <strong>{totalTexts}</strong></li>
            </TotalsList>
          </TotalsContainer>
          <ContentsContainer>
            <h3>Listado de contenidos</h3>
            <ContentsList>
              {contents.map((content, index) => (
                <ContentItem key={index}>
                  {content.type === 'imagen' ? (
                    <ContentImage
                      src={loadImages[content._id]}
                      alt={content.title}
                      onError={(e) => {
                        e.target.src = require('../assets/img/logo-multimedia.png');
                      }}
                    />
                  ) : content.type === 'video' ? (
                    <ContentVideo src={`https://www.youtube.com/embed/${new URL(content.videoUrl).searchParams.get('v')}`} title={content.title} />
                  ) : (
                    <ContentText>{content.text || "No hay texto disponible"}</ContentText>
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
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const TotalsContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const TotalsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 85%;
`;

const ContentsContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
`;

const ContentsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;


const ContentItem = styled.li`
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 200px; // Ajusta el tamaño mínimo del item
`;

const ContentImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  display: block; // Asegura que la imagen ocupe todo el espacio
`;

const ContentText = styled.p`
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px; // Aumenta el tamaño del texto
`;

const ContentVideo = styled.iframe`
  width: 100%;
  height: 150px;
  border: none;
`;



const ContentInfo = styled.div`
  padding: 15px;
`;

const ErrorText = styled.p`
  color: red;
  margin-bottom: 20px;
`;



export default ContentView;