// src/components/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ContentView from './ContentView'; // Import the existing ContentView component
import axios from 'axios';



const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Select = styled.select`
  width: 200px;
  margin: 0 auto 20px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DashboardHome = ({ isLoggedIn, role, token, username }) => {
  console.log("akkkkaaaa",username)
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');


  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
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
   
  
    fetchThemes();
  }, [token]);

  return (
    <DashboardContainer>
      <Header>
        <h2>Bienvenido al dashboard</h2>
        {isLoggedIn ? (
          <>
            <h3>Tu rol: {role}</h3>
            <p>En el menu lateral podras ver tu el menu de opciones dependiendo de tu Rol: {role} </p>
          </>
        ) : (
          <p>No estás autorizado para acceder a este dashboard.</p>
        )}
      </Header>


      <Select
          name="theme"
          onChange={handleThemeChange}
        >
          <option value="">Seleccione un tema</option>
          {themes.map(theme => (
            <option key={theme._id} value={theme._id}>{theme.name}</option>
          ))}
        </Select>


      <ContentWrapper>
        <ContentView themeId={selectedTheme} token={token} username={username} />
      </ContentWrapper>

    </DashboardContainer>
  );
};

export default DashboardHome;