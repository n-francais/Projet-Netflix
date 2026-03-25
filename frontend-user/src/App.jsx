import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Search from "./pages/Search";
import MyRentals from "./pages/MyRentals";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            {/* Routes protégées */}
            <Route
              path="/my-rentals"
              element={
                <ProtectedRoute>
                  <MyRentals />
                </ProtectedRoute>
              }
            />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;
