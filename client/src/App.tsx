import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Propiedades from "./pages/Propiedades";
import PropertyDetail from "./pages/PropertyDetail";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/propiedades" component={Propiedades} />
      <Route path="/propiedad/:id" component={PropertyDetail} />
      <Route path="/nosotros" component={Nosotros} />
      <Route path="/contacto" component={Contacto} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  // Controlar la visibilidad de ElevenLabs: Solo en /contacto
  useEffect(() => {
    const agentEl = document.querySelector("elevenlabs-convai");
    if (agentEl) {
      if (location === "/contacto") {
        (agentEl as HTMLElement).style.display = "block";
      } else {
        (agentEl as HTMLElement).style.display = "none";
      }
    }
  }, [location]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "14px",
              },
            }}
          />
          <Navbar />
          <Router />
          <Footer />
          
          {/* WhatsApp solo se muestra si NO estamos en contacto, o si queremos mostrarlo en todas partes */}
          {/* En este caso lo renderizamos globalmente, pero como ElevenLabs está en bottom-right en contacto,
              quizás WhatsApp debería moverse a la izquierda en /contacto. Vamos a ubicar WhatsApp en left. */}
          {location !== "/contacto" ? (
             <FloatingWhatsApp />
          ) : (
             <FloatingWhatsApp className="bottom-6 left-6" />
          )}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
