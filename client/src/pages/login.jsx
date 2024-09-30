import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/Authcontext";

export const Login = () => {
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status == 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="email" placeholder="email" required />
      <br />
      <input type="password" name="password" placeholder="password" required />
      <br />
      <input type="submit" />
    </form>
  );
};
