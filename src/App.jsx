import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import UploadSection from './components/UploadSection';
import ManualEntrySection from './components/ManualEntrySection';
import ExtractedDataSection from './components/ExtractedDataSection';
import Signup from './components/Signup';
import Login from './components/Login';
import VerifyEmail from './components/VerifyEmail';
import Sidebar from './components/Sidebar';
import About from './components/About';

const client = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_COGNITO_REGION,
});

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [manualMedications, setManualMedications] = useState([{ id: 1 }]);
  const [extractedMedications, setExtractedMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [username, setUsername] = useState('');

  const TEXT_EXTRACTION_URL = import.meta.env.VITE_TEXT_EXTRACTION_URL;
  const SCHEDULE_NOT_URL = import.meta.env.VITE_SCHEDULE_NOT_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const command = new GetUserCommand({
            AccessToken: localStorage.getItem('accessToken'),
          });
          const response = await client.send(command);
          const preferredUsername = response.UserAttributes.find(attr => attr.Name === 'preferred_username')?.Value;
          setUsername(preferredUsername || 'User');
        } catch (err) {
          console.error('Failed to fetch user:', err);
          handleLogout();
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const handleProcessImage = useCallback(async () => {
    if (!uploadedImage) {
      alert('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', uploadedImage.file);
    try {
      const response = await fetch(TEXT_EXTRACTION_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.data && data.data.medications) {
        setExtractedMedications(data.data.medications);
        setShowExtractedData(true);
      } else {
        alert('No medications extracted or error occurred.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, TEXT_EXTRACTION_URL]);

  const handleAddMedication = useCallback(() => {
    const newId = manualMedications.length + 1;
    setManualMedications((prev) => [...prev, { id: newId }]);
  }, [manualMedications.length]);

  const handleMedicationChange = useCallback((index, updatedMed) => {
    setManualMedications((prev) => {
      const newMedications = [...prev];
      newMedications[index] = updatedMed;
      return newMedications;
    });
  }, []);

  const handleSubmitManualData = useCallback(async () => {
    const validMedications = manualMedications
      .map((med) => ({
        ...med,
        timing: Array.isArray(med.timing) ? med.timing : [],
      }))
      .filter((med) => med.name && med.duration_value && med.timing.length > 0);
    if (validMedications.length === 0) {
      alert('Please add at least one medication with required fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(SCHEDULE_NOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: validMedications }),
      });
      if (response.ok) {
        alert('Manual data scheduled successfully!');
        setManualMedications([{ id: 1 }]);
      } else {
        throw new Error('Failed to schedule manual data');
      }
    } catch (error) {
      console.error('Error scheduling manual data:', error);
      alert('Failed to schedule manual data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [manualMedications, SCHEDULE_NOT_URL]);

  const handleExtractedMedicationChange = useCallback((index, updatedMed) => {
    setExtractedMedications((prev) => {
      const newMedications = [...prev];
      newMedications[index] = updatedMed;
      return newMedications;
    });
  }, []);

  const handleScheduleExtractedData = useCallback(async () => {
    const validMedications = extractedMedications
      .map((med) => ({
        ...med,
        timing: Array.isArray(med.timing) ? med.timing : [],
      }))
      .filter((med) => med.name && med.duration_value && med.timing.length > 0);
    if (validMedications.length === 0) {
      alert('No valid medications to schedule.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(SCHEDULE_NOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: validMedications }),
      });
      if (response.ok) {
        alert('Extracted data scheduled successfully!');
        setExtractedMedications([]);
        setShowExtractedData(false);
      } else {
        throw new Error('Failed to schedule extracted data');
      }
    } catch (error) {
      console.error('Error scheduling extracted data:', error);
      alert('Failed to schedule extracted data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [extractedMedications, SCHEDULE_NOT_URL]);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    window.location.href = '/';
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUsername('');
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const VerifyEmailWrapper = () => {
    const location = useLocation();
    const email = location.state?.email || '';
    return <VerifyEmail email={email} />;
  };

  return (
    <Router>
      <div className="flex min-h-screen relative">
        {isAuthenticated && <Sidebar username={username} onLogout={handleLogout} />}
        <div className="flex-1">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="/verify-email" element={<VerifyEmailWrapper />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="p-6 bg-gray-100 min-h-screen">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Prescription Scheduler</h1>
                    <p className="text-gray-600 mb-6">Upload your prescription or enter details manually to create a schedule.</p>
                    <UploadSection
                      onProcessImage={handleProcessImage}
                      uploadedImage={uploadedImage}
                      setUploadedImage={setUploadedImage}
                    />
                    <ManualEntrySection
                      medications={manualMedications}
                      onAddMedication={handleAddMedication}
                      onMedicationChange={handleMedicationChange}
                      onSubmitManualData={handleSubmitManualData}
                    />
                    {showExtractedData && extractedMedications.length > 0 && (
                      <ExtractedDataSection
                        medications={extractedMedications}
                        onMedicationChange={handleExtractedMedicationChange}
                        onSchedule={handleScheduleExtractedData}
                      />
                    )}
                    {isLoading && (
                      <div className="flex justify-center items-center mt-6">
                        <div className="spinner mr-2"></div>
                        <p className="text-gray-600">Processing...</p>
                      </div>
                    )}
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;