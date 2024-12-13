// src/components/DashboardHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ContentView from './ContentView'; // Import the existing ContentView component
import axios from 'axios';
import iconArchivo from  './../assets/img/simbolo-descargador-archivo.png';
import iconImagen from  './../assets/img/simbolo-de-imagen-n.png';
import iconVideo from  './../assets/img/simbolo-de-video.png';
import searchIcon from './../assets/img/lupa.png'; 

const DashboardContainer = styled.div`
  max-width: 100%;

`;

const Header = styled.header`
  text-align: center;
  color: white;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
`;

const GreenText = styled.span`
  color: white;
  text-shadow: -1px 0 green, 0 1px green, 1px 0 green, 0 -1px green;
  font-weight: bold;
  display: block;
  text-align: center;
  margin-top: 5px;
`;

const Select = styled.select`
  width: 240px;
  margin: 0 auto 2px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #666;
  border-radius: 25px; /* Hace las esquinas más redondeadas */
  background-color: #333;
  color: white;
  cursor: pointer;
  background-size: 10px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TotalsContainer = styled.div`
    background-image: linear-gradient(to bottom right, #333, #555);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
   color: white; /* Añade esta línea para cambiar el color del texto a blanco */
    h3 {
    color: #ffffff; // Cambia el color a blanco
    margin-bottom: 30px; // Añade un poco de espacio inferior
  }
`;

const TotalsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 85%;
`;

const Icon = styled.img`
  width: 40px;
  height: auto;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchButton = styled.button`
  width: 100px;
  height: 43px;
  font-size: 18px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 0 25px 25px 0; /* Hace las esquinas derechas redondeadas */
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #666;
  }
`;

const SearchInput = styled.input`
  width: calc(100% - 120px); /* Ajusta el ancho para dejar espacio para el botón */
  height: 20px;
  font-size: 18px;
  padding: 10px;
  border: 1px solid #666;
  border-radius: 25px 0 0 25px; /* Hace las esquinas izquierdas redondeadas */
  background-color: #333;
  color: white;
`;

const SearchIcon = styled.img`
  width: 20px;
  height: auto;
  margin-right: 10px;
`;


const DashboardHome = ({ isLoggedIn, role, token, username }) => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [totalImages, setTotalImages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
 // const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContents, setFilterContents] = useState([]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleSearch = useCallback(async () => {
    try {
      console.log("Buscando por:", searchTerm);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search-contents`, {
        params: { term: searchTerm },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Resultado de la búsqueda:", response.data);
      
      // Filtrar los resultados para mostrar solo los que coincidan con la búsqueda
      const filteredResults = response.data.filter(content => 
        Object.values(content).some(value => 
          typeof value === 'string' && value !== undefined && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  
      setFilterContents(filteredResults);
    } catch (error) {
      console.error('Error buscando contenidos:', error);
    }
  }, [searchTerm, token]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/list-themes`, {
          headers: { authorization: `Bearer ${token}` }
        });
        setThemes(response.data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };

    const fetchTotals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/content-totals`);
        setTotalImages(response.data.images);
        setTotalVideos(response.data.videos);
        setTotalTexts(response.data.texts);
      } catch (error) {
        console.error('Error fetching totals:', error);
       // setError('Error al obtener los totales de contenidos');
      }
    };

    fetchTotals();
    fetchThemes();
  }, [token]);

  return (
    <DashboardContainer>
      <Header>
        <div style={{
          textAlign: 'center',

        }}>
          {isLoggedIn ? (
            <>
             <h2>Bienvenido {username}</h2>
            <GreenText>Role: {role}</GreenText>
            </>
          ) : (
            <span style={{ color: '#f44336', fontWeight: 'bold' }}>No estás autorizado para acceder a este dashboard.</span>
          )}
        </div>
      </Header>

      <ContentWrapper>
      <TopRow>
          <SearchBarContainer>
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contenido..."
            />
            <SearchButton onClick={handleSearch}>
              <SearchIcon src={searchIcon} alt="Buscar" />
            </SearchButton>
          </SearchBarContainer>

          <Select
            name="theme"
            onChange={handleThemeChange}
          >
            <option value="">Seleccione un tema</option>
            {themes.map(theme => (
              <option key={theme._id} value={theme._id}>{theme.name}</option>
            ))}
          </Select>

          <TotalsContainer>
            <h3>Total de contenidos:</h3>
            <TotalsList>
              <li>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Icon src={iconImagen} alt="Icono de archivo" style={{ marginBottom: '5px' }} />
                  <span>imágenes: <strong>{totalImages}</strong></span>
                </div>
              </li>
              <li>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Icon src={iconVideo} alt="Icono de archivo" style={{ marginBottom: '5px' }} />
                  <span>videos: <strong>{totalVideos}</strong></span>
                </div>
              </li>
              <li>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Icon src={iconArchivo} alt="Icono de archivo" style={{ marginBottom: '5px' }} />
                  <span>archivos: <strong>{totalTexts}</strong></span>
                </div>
              </li>
            </TotalsList>
          </TotalsContainer>
          </TopRow>


        <ContentView themeId={selectedTheme} token={token} username={username} searchTerm={searchTerm} filterContents={filterContents} />
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default DashboardHome;