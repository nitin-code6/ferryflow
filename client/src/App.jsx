import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";
import AuthProvider from "./context/AuthContext";


import { useEffect } from "react";
import { socket } from "./services/socketService";

function App() {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0F172A",
            color: "#F8FAFC",
            border: "1px solid rgba(226, 232, 240, 0.08)",
            borderRadius: "16px",
            padding: "12px 20px",
            fontSize: "13px",
            fontWeight: "600",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#0F172A",
            },
            style: {
              border: "1px solid rgba(16, 185, 129, 0.25)",
            }
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#0F172A",
            },
            style: {
              border: "1px solid rgba(239, 68, 68, 0.25)",
            }
          }
        }}
      />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>

    </>
  );

}

export default App;