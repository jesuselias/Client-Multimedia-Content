// CircularMenu.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  position: relative;
  float: right;
 

`;

const MenuIcon = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 24px;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(45deg);
  }
`;

const MenuList = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #333;
  color: white;
  padding: 10px;
  border-radius: 10px;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const MenuItems = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const MenuLink = styled.a`
  width: 100px;
  display: block;
  padding: 5px 20px;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const CircularMenu = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuWrapper>
      <MenuIcon onClick={toggleMenu}>⋮</MenuIcon>
      {isOpen && (
        <MenuList $isOpen={isOpen}>
          <MenuItems>
            <li><MenuLink href="#profile">Perfil</MenuLink></li>
            <li><MenuLink href="#settings">Ajustes</MenuLink></li>
            <li><MenuLink onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}>Cerrar Sesión</MenuLink></li>
          </MenuItems>
        </MenuList>
      )}
    </MenuWrapper>
  );
};

export default CircularMenu;