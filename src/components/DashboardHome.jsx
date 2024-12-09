// src/components/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ContentView from './ContentView'; // Import the existing ContentView component
import axios from 'axios';

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
  width: 200px;
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
  width: 80%;
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
`;

const TotalsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 85%;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchButton = styled.button`
  width: 120px;
  height: 42px;
  font-size: 18px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 0 25px 25px 0; /* Hace las esquinas derechas redondeadas */
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #0056b3;
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



const DashboardHome = ({ isLoggedIn, role, token, username }) => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [totalImages, setTotalImages] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
 // const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
 // const [contents, setContents] = useState([]);

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleSearch = async () => {
    try {
     await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search-contents`, {
        params: { term: searchTerm },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //setContents(response.data);
    } catch (error) {
      console.error('Error searching contents:', error);
    }
  };

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
            <SearchButton onClick={handleSearch}>Buscar</SearchButton>
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
              <li>imágenes: <strong>{totalImages}</strong></li>
              <li>videos: <strong>{totalVideos}</strong></li>
              <li>archivos: <strong>{totalTexts}</strong></li>
            </TotalsList>
          </TotalsContainer>
          </TopRow>


        <ContentView themeId={selectedTheme} token={token} username={username} />
      </ContentWrapper>
    </DashboardContainer>
  );
};

export default DashboardHome;