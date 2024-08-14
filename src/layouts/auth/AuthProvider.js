import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const baseUrl = "https://david-test-webapp.azurewebsites.net/api";
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (username, password) => {
    try {
      const response = await axios.post(`${baseUrl}/user/login`, {
        username,
        password
      });

      if (response.data) {
        setUser(response.data.user);
        setRole(response.data.user.role);
        setToken(response.data.token);
      
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log(localStorage.getItem("user"));
        localStorage.setItem("role", response.data.user.role);
        console.log(localStorage.getItem("role"));
        localStorage.setItem("token", response.data.token);
        console.log(localStorage.getItem("token"));
      
        if (response.data.user.role === "admin"){
          navigate("/dashboard");
        } else {
          navigate("/dashboard-staff")
        }
        
        return;
      }
      throw new Error(response.message);
    } catch (err) {
      console.error(err);

      await new Promise((resolve) => setTimeout(resolve, 200));
      toast.error("Login gagal: Username atau password salah");
    }
  };

  const logoutAction = () => {
    setUser(null);
    setRole(null)
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};