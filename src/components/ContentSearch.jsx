// components/ContentSearcher.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ContentSearcher = ({ token }) => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/search-contents`, {
        params: { term: searchTerm },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContents(response.data);
    } catch (error) {
      console.error('Error searching contents:', error);
    }
  };

  return (
    <>
      <Header>Buscador de Contenidos</Header>
      <SearchBarContainer>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar contenido..."
        />
        <SearchButton onClick={handleSearch}>Buscar</SearchButton>
      </SearchBarContainer>

      <ContentList>
        {contents.map((content) => (
          <ContentItem key={content._id}>
            <ContentTitle>{content.title}</ContentTitle>
            <p>Credits: {content.credits}</p>
            <p>Tema: {content.themeId}</p>
          </ContentItem>
        ))}
      </ContentList>
    </>
  );
};

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

const ContentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ContentItem = styled.li`
  background-color: #f4f4f4;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ContentTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Header = styled.h2`
  margin-bottom: 50px;
`;

export default ContentSearcher;