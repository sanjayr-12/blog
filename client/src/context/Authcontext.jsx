/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });

  const navigate = useNavigate();
  // console.log(user);

  useEffect(() => {
    const verrifyFunction = async () => {
      if (user) {
        try {
          const verify = await axios.get(
            `http://localhost:8080/api/auth/verifyme/${user._id}`,
            { withCredentials: true }
          );
          if (verify.status === 200) {
            // console.log(verify.data);

            localStorage.setItem("user", JSON.stringify(verify.data));
            navigate("/dashboard");
          }
        } catch (error) {
          if (error.response.status === 401) {
            navigate("/login");
              localStorage.removeItem("user");
              setUser(null)
          }
          console.log(error.response.data.error);
        }
      }
    };

    verrifyFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
    
  // console.log(localStorage.getItem("user"));

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
