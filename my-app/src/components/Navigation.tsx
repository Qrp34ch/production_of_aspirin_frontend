// import { type FC, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../Routes';
// import './Navigation.css';

// export const Navigation: FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleNavigation = (path: string) => {
//     closeMenu();
//     navigate(path);
//   };

//   const NavItem = ({ path, children, className }: { path: string; children: React.ReactNode; className?: string }) => (
//     <div 
//       className={className}
//       onClick={() => handleNavigation(path)}
//       style={{ cursor: 'pointer' }}
//     >
//       {children}
//     </div>
//   );

//   return (
//     <div className="custom-navbar">
//       <div className="nav-header">
//         <button 
//           className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
//           onClick={toggleMenu}
//           aria-label="Открыть меню"
//         >
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>

//         <div className="nav-links-desktop">
//           <NavItem 
//             path={ROUTES.HOME}
//             className={`navi-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
//           >
//             🏠︎
//           </NavItem>
//           <NavItem 
//             path={ROUTES.REACTION}
//             className={`navi-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
//           >
//             Реакции
//           </NavItem>
//         </div>

//         <div className="nav-title">
//           <span>Производство аспирина</span>
//         </div>

//         <div className="nav-space"></div>

//         <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
//           <div className="mobile-menu-content">
//             <NavItem 
//               path={ROUTES.HOME}
//               className={`mobile-nav-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
//             >
//               Главная
//             </NavItem>
//             <NavItem 
//               path={ROUTES.REACTION}
//               className={`mobile-nav-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
//             >
//               Реакции
//             </NavItem>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="menu-overlay" onClick={closeMenu}></div>
//         )} 
//       </div>
//     </div>
//   );
// };
import { type FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../Routes';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store/store';
import { logoutUser, getProfile } from '../slices/userSlice';
import { getSynthesisIcon } from '../slices/synthesisSlice';
import './Navigation.css';

export const Navigation: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  // const { synthesisIcon } = useSelector((state: RootState) => state.synthesis);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated) {
      dispatch(getProfile());
    }
    
    // Загружаем иконку синтеза если авторизован
    if (isAuthenticated) {
      dispatch(getSynthesisIcon());
    }
  }, [dispatch, isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    closeMenu();
    navigate(path);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    closeMenu();
    navigate(ROUTES.HOME);
  };

  // const handleSynthesisClick = () => {
  //   if (synthesisIcon?.id) {
  //     handleNavigation(`${ROUTES.SYNTHESIS.replace(':id', synthesisIcon.id.toString())}`);
  //   }
  // };

  const NavItem = ({ path, children, className }: { path: string; children: React.ReactNode; className?: string }) => (
    <div 
      className={className}
      onClick={() => handleNavigation(path)}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );

  return (
    <div className="custom-navbar">
      <div className="nav-header">
        <button 
          className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="nav-links-desktop">
          <NavItem 
            path={ROUTES.HOME}
            className={`navi-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
          >
            🏠︎
          </NavItem>
          <NavItem 
            path={ROUTES.REACTION}
            className={`navi-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
          >
            Реакции
          </NavItem>
          
          {isAuthenticated && (
            <>
              <NavItem 
                path={ROUTES.SYNTHESES}
                className={`navi-link ${location.pathname.startsWith(ROUTES.SYNTHESES) ? 'active' : ''}`}
              >
                Мои синтезы
              </NavItem>
              {/* <div 
                className={`navi-link synthesis-icon ${!synthesisIcon?.id ? 'disabled' : ''}`}
                onClick={handleSynthesisClick}
                style={{ cursor: synthesisIcon?.id ? 'pointer' : 'not-allowed' }}
              >
                ⚗️
                {synthesisIcon && synthesisIcon.count > 0 && (
                  <span className="synthesis-badge">{synthesisIcon.count}</span>
                )}
              </div> */}
            </>
          )}
        </div>

        <div className="nav-title">
          <span>Производство аспирина</span>
        </div>

        <div className="nav-auth-section">
          {isAuthenticated ? (
            <div className="user-menu">
              {/* <span className="user-name">{user?.fio || user?.login}</span> */}
              <NavItem 
                path={ROUTES.PROFILE}
                className={`user-name ${location.pathname === ROUTES.PROFILE ? 'active' : ''}`}
              >
                {user?.fio || user?.login}
              </NavItem>
              <div className="navi-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Выйти
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <NavItem 
                path={ROUTES.LOGIN}
                className={`navi-link ${location.pathname === ROUTES.LOGIN ? 'active' : ''}`}
              >
                Войти
              </NavItem>
              <NavItem 
                path={ROUTES.REGISTER}
                className={`navi-link ${location.pathname === ROUTES.REGISTER ? 'active' : ''}`}
              >
                Регистрация
              </NavItem>
            </div>
          )}
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <NavItem 
              path={ROUTES.HOME}
              className={`mobile-nav-link ${location.pathname === ROUTES.HOME ? 'active' : ''}`}
            >
              Главная
            </NavItem>
            <NavItem 
              path={ROUTES.REACTION}
              className={`mobile-nav-link ${location.pathname.startsWith(ROUTES.REACTION) ? 'active' : ''}`}
            >
              Реакции
            </NavItem>
            
            {isAuthenticated ? (
              <>
                <NavItem 
                  path={ROUTES.SYNTHESES}
                  className={`mobile-nav-link ${location.pathname.startsWith(ROUTES.SYNTHESES) ? 'active' : ''}`}
                >
                  Мои синтезы
                </NavItem>
                <NavItem 
                  path={ROUTES.PROFILE}
                  className={`mobile-nav-link ${location.pathname === ROUTES.PROFILE ? 'active' : ''}`}
                >
                  Профиль
                </NavItem>
                {/* {synthesisIcon?.id && (
                  <div 
                    className="mobile-nav-link"
                    onClick={handleSynthesisClick}
                  >
                    Текущий синтез ({synthesisIcon.count})
                  </div>
                )} */}
                <div className="mobile-nav-link" onClick={handleLogout}>
                  Выйти
                </div>
              </>
            ) : (
              <>
                <NavItem 
                  path={ROUTES.LOGIN}
                  className={`mobile-nav-link ${location.pathname === ROUTES.LOGIN ? 'active' : ''}`}
                >
                  Войти
                </NavItem>
                <NavItem 
                  path={ROUTES.REGISTER}
                  className={`mobile-nav-link ${location.pathname === ROUTES.REGISTER ? 'active' : ''}`}
                >
                  Регистрация
                </NavItem>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="menu-overlay" onClick={closeMenu}></div>
        )} 
      </div>
    </div>
  );
};