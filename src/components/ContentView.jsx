// src/components/ContentView.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ContentView = ({ themeId, token, username }) => {
  const [contents, setContents] = useState([]);
  const [totalImages, setTotalImages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        console.log("token", token);
        console.log("themeId", themeId);
        
        if (!themeId) {
          return; // Salimos si no hay un themeId válido
        }

        const url = `${process.env.REACT_APP_API_URL}/api/user/content/${themeId}`;
        console.log("URL:", url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data", data);
        
        if (Array.isArray(data)) {
          setContents(data);
        } else {
          setError("La respuesta no es un array");
        }
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError(error.message || 'Error al obtener los contenidos');
      }
    };

    const fetchTotals = async () => {
      try {
        if (!themeId) {
          return; // Salimos si no hay un themeId válido
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/content-totals`);
        console.log("response totals", response);
        setTotalImages(response.data.images);
        setTotalVideos(response.data.videos);
        setTotalTexts(response.data.texts);
      } catch (error) {
        console.error('Error fetching totals:', error);
        setError('Error al obtener los totales');
      }
    };
    
    fetchContents();
    fetchTotals();
  }, [themeId, token]);

  useEffect(() => {
    console.log("contents actualizados:", contents);
    console.log('URL imagen:', `${process.env.REACT_APP_API_URL}/api/files/${contents.imageUrl}`);
  }, [contents]);

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
              {content.type === 'image' ? (
                    <ContentImage
                      src="http://localhost:4000/api/files/1730237630753_billetera.png"
                      alt={content.title} 
                      onError={(e) => {
                        e.target.src = '/path/to/default-image.jpg'; // Reemplaza esto con la ruta real a una imagen predeterminada
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