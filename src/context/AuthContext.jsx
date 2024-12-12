import { createContext, useEffect, useReducer, useState } from "react";

const initialState = {
  user:
    localStorage.getItem("user") !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };

    case "LOGIN_SUCCESS":
      // Update local storage
      console.log(action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("token", action.payload.token);

      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };

    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: JSON.parse(storedUser),
          role: storedRole,
          token: storedToken,
        },
      });
    }
  }, []);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
        userToken,
        setUserToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
