import { Route, Routes } from "react-router-dom"
import { Login } from "./pages/login"
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { Dashboard } from "./pages/Dashboard";



function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App
