import { createContext, useReducer, useEffect } from 'react';
import { setTokens, clearTokens, getUserInfo, setUserInfo, hasToken } from '../utils/tokenUtils';
import { getUserById } from '../api/userApi';
import { decodeToken } from '../utils/tokenUtils';

const AuthContext = createContext();

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Khôi phục session khi load app
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (hasToken()) {
          const userInfo = getUserInfo();
          if (userInfo) {
            dispatch({
              type: 'LOGIN',
              payload: {
                user: userInfo,
                accessToken: localStorage.getItem('fas_access_token'),
                refreshToken: localStorage.getItem('fas_refresh_token'),
              },
            });
          } else {
            // Nếu không có user info, thử lấy từ token
            const token = localStorage.getItem('fas_access_token');
            const decoded = decodeToken(token);
            if (decoded && decoded.sub) {
              const { data } = await getUserById(decoded.sub);
              setUserInfo(data);
              dispatch({
                type: 'LOGIN',
                payload: {
                  user: data,
                  accessToken: token,
                  refreshToken: localStorage.getItem('fas_refresh_token'),
                },
              });
            } else {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearTokens();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  const login = (user, accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    setUserInfo(user);
    dispatch({
      type: 'LOGIN',
      payload: { user, accessToken, refreshToken },
    });
  };

  const logout = () => {
    clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    setUserInfo(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
