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
import CircularMenu from './CircularMenu';
import PhindChatComponent from './PhindChatComponent';
import createIcon from '../assets/img/crear.png'; // Asegúrate de que esta ruta sea correcta
import searchIcon from '../assets/img/lupa.png';
import folderCIcon from '../assets/img/crear-carpeta.png';
import folderBIcon from '../assets/img/buscar-carpeta.png';
import CategoriaIcon from '../assets/img/categoria.png';   


const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 60px;
  width: 250px;
  background-color: #000000;
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
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 7px;
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
  //background-image: linear-gradient(to bottom right, #e3e2e2, #cacaca);
  background-color: #000000;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  padding: 1px;
  overflow-y: auto;
  margin-left: 270px; /* Añade este margen para desplazar el contenido */
  
`;

const Container = styled.div`
  text-align: center;
  margin-bottom: 20px;
  width:100%
`;

const ProfileContainer = styled.div`
  position: absolute; // Usamos position: absolute
  top: 5px;
  right: 7px;
  display: flex;
  align-items: center;
  z-index: 1000; // Aseguramos que esté encima de otros elementos
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;

`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;


// const VerticalSeparator = styled.hr`
//   height: 100%;

//   background-color: white;
//   opacity: 1;
//   margin-top: 0px;
//   position: absolute;
//   left: 240px; // Ajusta este valor según el ancho del Sidebar
// `;

// const LogoutButton = styled.button`
//   background-color: #6c757d;
//   color: white;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
//   width: 70%;
//   margin-top: 600px;

//   &:hover {
//     background-color: #5a6268;
//   }

//   @media (max-width: 768px) {
//     padding: 8px 16px;
//     font-size: 14px;
//   }
// `;



const Dashboard = ({ isLoggedIn, role, token, username }) => {
  const menuItems = {
    Admin: [
      { label: 'Contenido', path: '/dashboard' },
      { label: 'Temática', path: '/dashboard/search-theme' },
      // { label: 'Buscar Contenido', path: '/dashboard/search-content' },
      { label: 'Crear Categoría', path: '/dashboard/create-category' },
      { label: 'Crear Tematica', path: '/dashboard/create-themes' },
      { label: 'Crear Contenido', path: '/dashboard/create-contents' },
    ],
    Creador: [
      { label: 'Contenido', path: '/dashboard' },
      { label: 'Temática', path: '/dashboard/search-theme' },
      { label: 'Buscar Contenido', path: '/dashboard/search-content' },
      { label: 'Crear Contenido', path: '/dashboard/create-contents' },
    ],
    Lector: [
      { label: 'Contenido', path: '/dashboard' },
      { label: 'Temática', path: '/dashboard/search-theme' },
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
                <SidebarItemLink to={item.path}>
                  {item.label.includes('Crear Contenido') ? (
                    <img src={createIcon} alt="Crear" style={{ width: '20px', marginRight: '10px' }} />
                  ) : item.label.includes('Crear Tematica') ? (
                    <img src={folderCIcon} alt="Carpeta" style={{ width: '20px', marginRight: '10px' }} />
                  ) : item.label.includes('Temática') ? (
                    <img src={folderBIcon} alt="Carpeta" style={{ width: '20px', marginRight: '10px' }} />
                  ) : item.label.includes('Crear Categoría') ? (
                    <img src={CategoriaIcon} alt="Carpeta" style={{ width: '20px', marginRight: '10px' }} />
                  ) : (
                    <img src={searchIcon} alt="Buscar" style={{ width: '20px', marginRight: '10px' }} />
                  )}
                  {item.label}
                  </SidebarItemLink>
              </SidebarMenuItem>
            ))
          ) : (
            <p>No tienes permisos para ver este menú</p>
          )}
         
        </SidebarMenu>
          <PhindChatComponent />
        {/* <LogoutButton onClick={handleLogout}>Mas</LogoutButton> */}
      </Sidebar>
      {/* <VerticalSeparator /> */}
      <ContentArea>
        <Container>
        <ProfileContainer>
          <UserProfile>
            <ProfileImage src="https://via.placeholder.com/40" alt="Profile" />
            <UserName>{username}</UserName>
          </UserProfile>
          <CircularMenu handleLogout={handleLogout} />
        </ProfileContainer>
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