import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 35%;
  height: 20px;
  font-size: 18px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
`;

const SearchButton = styled.button`
  width: 10%;
  height: 42px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
`;

const ThemeList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ThemeItem = styled.li`
  background-color: #f4f4f4;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ThemeName = styled.h3`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Header = styled.h2`
  margin-bottom: 50px;
`;

const ThemeSearcher = ({ token }) => {
  const [themes, setThemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search-themes`, {
        params: { term: searchTerm },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setThemes(response.data);
    } catch (error) {
      console.error('Error searching themes:', error);
    }
  };

  return (
    <>
    <Header>Buscador de Temáticas</Header>
      <SearchBarContainer>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar temática..."
        />
        <SearchButton onClick={handleSearch}>Buscar</SearchButton>
      </SearchBarContainer>

      <ThemeList>
        {themes.map((theme) => (
          <ThemeItem key={theme._id}>
            <ThemeName>{theme.name}</ThemeName>
            <p>{theme.description}</p>
          </ThemeItem>
        ))}
      </ThemeList>
    </>
  );
};

export default ThemeSearcher;