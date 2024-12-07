// components/Dashboard.jsx
import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DashboardHome from './DashboardHome';
import CreateCategory from './CreateCategory';
import CreateThemes from './CreateThemes';
import CreateContents from './CreateContents';
import ThemeSearcher from './ThemeSearcher';
import ContentSearcher from './ContentSearch';


const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: #212121;
  color: white;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 30px;
`;

const SidebarMenuItem = styled.li`
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 10px;
  }
`;

const SidebarItemLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  margin-left: 350px; /* Añade este margen para desplazar el contenido */
`;

const Container = styled.div`
  text-align: center;
  margin-bottom: 20px;
  width:100%
`;

const LogoutButton = styled.button`
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 70%;
  margin-top: 600px;

  &:hover {
    background-color: #5a6268;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;



const Dashboard = ({ isLoggedIn, role, token, username }) => {
  const menuItems = {
    Admin: [
      { label: 'Crear Categoría', path: '/dashboard/create-category' },
      { label: 'Crear Tematica', path: '/dashboard/create-themes' },
      { label: 'Create Content', path: '/dashboard/create-contents' },
      { label: 'Contenido Segun Temática', path: '/dashboard' },
      { label: 'Buscar Temática', path: '/dashboard/search-theme' },
      { label: 'Buscar Contenido', path: '/dashboard/search-content' },
    ],
    Creador: [
      { label: 'Create Content', path: '/dashboard/create-contents' },
      { label: 'Contenido Segun Temática', path: '/dashboard' },
      { label: 'Buscar Temática', path: '/dashboard/search-theme' },
      { label: 'Buscar Contenido', path: '/dashboard/search-content' },
    ],
    Lector: [
      { label: 'Contenido Segun Temática', path: '/dashboard' },
      { label: 'Buscar Temática', path: '/dashboard/search-theme' },
      { label: 'Buscar Contenido', path: '/dashboard/search-content' },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  const currentRole = role;

  const location = useLocation();

  return (
    <DashboardContainer>
      <Sidebar>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Menu</h2>
        <SidebarMenu>
          {currentRole && menuItems[currentRole] ? (
            menuItems[currentRole].map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarItemLink to={item.path}>{item.label}</SidebarItemLink>
              </SidebarMenuItem>
            ))
          ) : (
            <p>No tienes permisos para ver este menú</p>
          )}
        </SidebarMenu>
        <LogoutButton onClick={handleLogout}>Cerrar sesión</LogoutButton>
      </Sidebar>
      <ContentArea>
        <Container>
          {isLoggedIn && role === 'Admin' ? (
            <>
                {location.pathname === '/dashboard' && (
                <DashboardHome 
                isLoggedIn={isLoggedIn} 
                role={role} 
                token={token}
                username={username} 
              />
              )}
              {location.pathname === '/dashboard/create-contents' && (
                <CreateContents isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
              {location.pathname === '/dashboard/create-category' && (
                <CreateCategory isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
              {location.pathname === '/dashboard/create-themes' && (
                <CreateThemes isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
              {location.pathname === '/dashboard/search-theme' && (
                <ThemeSearcher isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
              {location.pathname === '/dashboard/search-content' && (
                <ContentSearcher isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
            </>
          ) : (
            <>
              {location.pathname === '/dashboard' && (
                <DashboardHome 
                isLoggedIn={isLoggedIn} 
                role={role} 
                token={token}
                username={username}  
              />
              )}
             {location.pathname === '/dashboard/create-contents' && (
                <CreateContents isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
               {location.pathname === '/dashboard/search-theme' && (
                <ThemeSearcher isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
               {location.pathname === '/dashboard/search-content' && (
                <ContentSearcher isLoggedIn={isLoggedIn} role={role} token={token} />
              )}
            </>
          )}
        </Container>
      </ContentArea>
    </DashboardContainer>
  );
};

export default Dashboard;