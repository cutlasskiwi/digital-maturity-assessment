// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider } from './context/AssessmentContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import GettingStartedPage from './pages/GettingStartedPage';
import SelectAreasPage from './pages/SelectAreasPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  return (
    <AssessmentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/getting-started" element={
            <Layout sidebarTitle="Maturity benchmark inputs">
              <GettingStartedPage />
            </Layout>
          } />
          <Route path="/select-areas" element={
            <Layout sidebarTitle="Maturity benchmark areas">
              <SelectAreasPage />
            </Layout>
          } />
          <Route path="/assessment/:area" element={
            <Layout sidebarTitle="Maturity benchmark inputs">
              <AssessmentPage />
            </Layout>
          } />
          <Route path="/results" element={
            <Layout sidebarTitle="Maturity benchmark areas">
              <ResultsPage />
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AssessmentProvider>
  );
}

export default App;