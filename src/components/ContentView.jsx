import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import downloadIcon from '../assets/img/descarga.png';
import docxIcon from '../assets/img/docx.png';
import pdfIcon from '../assets/img/pdf.png';
import txtIcon from '../assets/img/txt.png';
import videoIcon from '../assets/img/video-descarga.png';
import musicaIcon from '../assets/img/musica.png';
import likeIcon from '../assets/img/video-descarga.png';
import shareIcon from '../assets/img/musica.png';

const ContentView = ({ themeId, token, filterContents }) => {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState(null);
  const [images, setImages] = useState({});
  const [filteredContents, setFilteredContents] = useState([]); // New state for filtered contents
  const [recommends, setRecommends] = useState({});

  useEffect(() => {
    if (contents.length > 0) {
      contents.forEach((content) => {
        setRecommends(prev => ({
          ...prev,
          [content._id]: 0
        }));
      });
    }
  }, [contents]);

  const updateLikesAndRecommends = async (contentId, action) => {
    console.log("contentId", contentId);
    console.log("action", action);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/update-like-recommend`, {
        contentId,
        action,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualiza el estado local basándose en la respuesta del servidor
      setRecommends(prev => ({
        ...prev,
        [contentId]: response.data.recommends
      }));

      console.log('Actualizado en el frontend:', response.data.recommends);
    } catch (error) {
      console.error('Error updating likes/recommends:', error);
    }
  };

  const getLikeRecommendCount = (contentId) => {
    return recommends[contentId] || 0;
  };

  const getInitialRecommendCount = useCallback(async (contentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/get-initial-recommend-counts/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching initial recommend count:', error);
      return null;
    }
  }, [token]);

  // const orderContentsByRecommends = useCallback((contents) => {
  //   return [...contents].sort((a, b) => {
  //     const recommendsA = recommends[a._id]?.recommends || 0;
  //     const recommendsB = recommends[b._id]?.recommends || 0;
      
  //     if (recommendsA !== recommendsB) {
  //       return recommendsA - recommendsB; // Ascendente
  //     } else {
  //       return 0; // Mantiene el orden original si los recommends son iguales
  //     }
  //   });
  // }, [recommends]);

  useEffect(() => {
    if (filterContents.length > 0) {
      setContents(filterContents);
      setFilteredContents(filterContents);
    } else {

    const fetchContents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/contentsTotal`, {
            headers: { Authorization: `Bearer ${token}` }
          });
       // Ordena los contenidos directamente basado en el número de recomendations
       const sortedContents = [...response.data].sort((a, b) => {
        const recommendsA = a.recommends ? a.recommends.length : 0;
        const recommendsB = b.recommends ? b.recommends.length : 0;
        console.log(`Recommends ${a._id}: ${recommendsA}, Recommends ${b._id}: ${recommendsB}`);
        return recommendsB - recommendsA; // Orden ascendente (más recomendaciones primero)
      });

      setContents(sortedContents);
      setFilteredContents(sortedContents);


        const initialRecommendCounts = {};
        for (const content of response.data) {
          const recommendData = await getInitialRecommendCount(content._id);
          if (recommendData) {
            initialRecommendCounts[content._id] = recommendData.recommends;
          }
        }
        setRecommends(initialRecommendCounts);
      } catch (error) {
        console.error('Error fetching contents:', error);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        setError(`Error al obtener todos los contenidos: ${JSON.stringify(error.message)}`);
      }
    };

    fetchContents();
  }
  // eslint-disable-next-line
  }, [filterContents, token]);

  useEffect(() => {
    const filterContents = () => {
      if (!themeId || themeId === 'all') {
        setFilteredContents(contents);
      } else {
        const filtered = contents.filter(content => content.themeId === themeId);
        setFilteredContents(filtered);
      }
    };

    filterContents();
  }, [themeId, contents]);


  // useEffect(() => {
  //   const fetchContents = async () => {
  //     if (!themeId) return;

  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/content/${themeId}`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
        
  //       if (Array.isArray(response.data)) {
  //         setContents(response.data);
  //       } else {
  //         throw new Error("La respuesta no es un array");
  //       }
  //     } catch (error) {
  //       console.error('Error fetching contents:', error);
  //       setError('Error al obtener los contenidos');
  //     }
  //   };


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


  return (
    <Container>
      <ContentsContainer>
        <h3 style={{ color:"white", width: '100%', marginBottom: '7px' }}>Listado de contenidos</h3>
        <ContentsList style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
        {filteredContents.map((content) => (
            <ContentItem key={content._id} style={{ flex: '0 0 25%' }}>
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
                      <img 
                      src={
                        content.file.toLowerCase().endsWith('.docx') ? docxIcon :
                        content.file.toLowerCase().endsWith('.pdf') ? pdfIcon :
                        content.file.toLowerCase().endsWith('.txt') ? txtIcon :
                        content.file.toLowerCase().endsWith('.mp3') ? musicaIcon :
                        content.file.toLowerCase().endsWith('.mp4') ? videoIcon :
                        downloadIcon
                      } 
                        alt="Descargar archivo" 
                        onClick={() => downloadFile(content._id)} 
                        style={{ 
                          marginTop: '100px', 
                          cursor: 'pointer',
                          width: '50px', // Ajusta el tamaño según sea necesario
                          height: 'auto'
                        }} 
                      />
                    )}
                  </ContentArchivo>
                </ContainerT>
              )}
             <ContentInfo>
                  <h4>{content.title}</h4>
                  <RecommendCounter>{getLikeRecommendCount(content._id)}</RecommendCounter>
              <InfoTop>
              <LikeButton onClick={() => updateLikesAndRecommends(content._id, 'recommend')}>
                <img src={likeIcon} alt="Me gusta" style={{ width: '25px', marginRight: '5px' }} />
                  Recomendar
              </LikeButton>
                <DownloadButton onClick={() => downloadFile(content._id)}>
                  <img src={downloadIcon} alt="Descargar" style={{ width: '25px', marginRight: '5px' }} />
                  Descargar
                </DownloadButton>
                <ShareButton>
                  <img src={shareIcon} alt="Compartir" style={{ width: '25px', marginRight: '5px' }} />
                  Compartir
                </ShareButton>
              </InfoTop>
              <p>{content.description || "No hay descripción disponible"}</p>
              <InfoBottom>
                <small>Creador: {content.credits || "Creador desconocido"}</small>
              </InfoBottom>
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoBottom = styled.div`
 // display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
`;

const ShareButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  font-size: 17px;
`;

const DownloadButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  font-size: 17px;
`;


const ErrorText = styled.p`
  color: red;
  margin-bottom: 20px;
`;

const RecommendCounter = styled.div`
  position: relative;
  right: 127px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export default ContentView;
