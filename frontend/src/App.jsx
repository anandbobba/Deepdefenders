import React, { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import Footer from "./components/footer";
import HowItWorks from "./pages/howitworks";
import ContactUs from "./pages/contactus";//fixed
import Features from "./pages/features";

import Confetti from "react-confetti";
import DetectionForm from "./components/DetectionForm";
import BlockchainVerification from "./components/BlockchainVerification";
import VerificationAndDetectionPage from "./components/VerificationAndDetectionPage";


import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion";

import { ThreeDots } from "react-loader-spinner";

const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true); // Start loading
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate load time
    return () => clearTimeout(timer); // Cleanup timeout
  }, [location.pathname]);

  return isLoading;
};

function AppContent({ user, setUser }) {
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (!sessionStorage.getItem("confettiShown")) {
          setCelebrationVisible(true);
          sessionStorage.setItem("confettiShown", "true");
          setTimeout(() => setCelebrationVisible(false), 5000);
        }
      } else {
        setUser(null);
        sessionStorage.removeItem("confettiShown");
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  const isLoading = useNavigationLoading();

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-black z-50">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#fff"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      )}

      <div className="min-h-screen flex flex-col bg-[#111a22] font-sans">
        {celebrationVisible && <Confetti />}
        <Navbar user={user} setUser={setUser} />
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen bg-[#111a22]">
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fff"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <div className="px-8 py-6 flex justify-center items-center">
                    <div className="w-[1237px] h-[300.4px] shadow-lg rounded-lg">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-white">
                            What is Deep Defenders?
                          </AccordionTrigger>
                          <AccordionContent className="text-white">
                            Deep Defenders is an advanced system designed to
                            detect and mitigate threats posed by deepfake media,
                            combining machine learning, deep learning, and
                            blockchain technologies for real-time media
                            authentication.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger className="text-white">
                            How does Deep Defenders detect deepfake media?
                          </AccordionTrigger>
                          <AccordionContent className="text-white">
                            Deep Defenders uses deep learning models like CNN
                            for image detection, 3D CNNs or sequential models
                            (LSTM, GRU) for video detection, and Wav2Vec for
                            audio detection.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger className="text-white">
                            How does the real-time processing work in Deep
                            Defenders?
                          </AccordionTrigger>
                          <AccordionContent className="text-white">
                            The system processes live video frames using OpenCV
                            and optimizes models with TensorFlow Lite or ONNX
                            Runtime to ensure minimal latency during real-time
                            media verification.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger className="text-white">
                            What is the role of blockchain in Deep Defenders?
                          </AccordionTrigger>
                          <AccordionContent className="text-white">
                            Blockchain is used to store detection results in a
                            tamper-proof and immutable manner. It ensures that
                            media authentication is verified and recorded
                            securely using smart contracts.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger className="text-white">
                            What technologies are used in Deep Defenders?
                          </AccordionTrigger>
                          <AccordionContent className="text-white">
                            The project uses TensorFlow, PyTorch, Keras for
                            machine learning and deep learning, Ethereum for
                            blockchain, and tools like OpenCV, Solidity, and
                            Web3.js for integration and deployment.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/features" element={<Features user={user} />} />
            
            <Route path="/detectionform" element={<DetectionForm />} />
            <Route path="/verify" element={<BlockchainVerification />} />
            <Route path="/verifidet" element={<VerificationAndDetectionPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;
