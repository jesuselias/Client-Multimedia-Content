// src/components/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ContentView from './ContentView'; // Import the existing ContentView component
import axios from 'axios';

const DashboardContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 0px;
`;

const Select = styled.select`
  width: 200px;
  margin: 0 auto 2px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  gap: 10px;
  
`;

const TotalsContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 50px;
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

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 00px;
`;

const SearchButton = styled.button`
  width: 30%;
  height: 42px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 20px;
  font-size: 18px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
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
          marginBottom: '30px',
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {isLoggedIn ? (
            <>
              <h2 style={{ marginRight: '10px' }}>Bienvenido:</h2>
              <h2 style={{ color: '#4CAF50', fontWeight: 'bold' }}>{role}</h2>
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