// import { useContext, useState } from "react";
// import { AuthContext } from "../context/Authcontext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Message from "../utils/Message";
import "./Dashboard.css";

export const Dashboard = () => {
  // const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [message, setMessage] = useState(null);

  const api = import.meta.env.VITE_API_URL;

  const handleClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (response.status == 200) {
        navigate("/login");
        localStorage.removeItem("user");
        setMessage({ text: "Logged out successfully", type: "success" });
      }
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${api}post/create`,
        { imgUrl, title, content: description },
        { withCredentials: true }
      );
      setMessage({ text: response.data.message, type: "success" });
      setTitle("");
      setDescription("");
      setImgUrl("");
    } catch (error) {
      setMessage({ text: error.response.data.error, type: "error" });
      }
  };

  return (
    <div className="dashboard">
      {message && <Message message={message.text} type={message.type} />}
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Image URL"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Create Post</button>
      </form>

      <div className="preview">
        <h2>Preview</h2>
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>

      <button onClick={handleClick} className="logout-btn">
        Logout
      </button>
    </div>
  );
};
