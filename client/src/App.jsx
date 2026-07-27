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
          duration: 3000,
          style: {
            background: "#0F172A",
            color: "#fff",
            border:
              "1px solid rgba(14,165,233,0.25)",
            borderRadius: "14px",
            padding: "14px 18px"
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