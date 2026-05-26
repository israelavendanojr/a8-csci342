import { Routes, Route } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import HomePage from '../../pages/HomePage';
import LoginForm from '../../forms/LoginForm';
import SignupForm from '../../forms/SignUpForm';
import Profile from '../../pages/Profile';
import PageNotFound from '../../pages/PageNotFound';
import ProtectedRoute from '../ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}