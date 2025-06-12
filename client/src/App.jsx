import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import { Container, CssBaseline, Box } from '@mui/material';
import Header from './components/Header';

function AppWrapper() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      <CssBaseline />
      {!isAuthPage && <Header />}
      <Container maxWidth="md" sx={{ mt: !isAuthPage ? 8 : 0 }}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
