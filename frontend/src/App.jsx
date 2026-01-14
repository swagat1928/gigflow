import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Gigs from "./pages/Gigs.jsx";
import PostGig from "./pages/PostGig.jsx";
import GigDetail from "./pages/GigDetail.jsx";
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Layout from "./components/layout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
              <Gigs />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-gig"
          element={
            <ProtectedRoute>
              <Layout>
              <PostGig />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gig/:id"
          element={
            <ProtectedRoute>
              <layout>
              <GigDetail />
              </layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
