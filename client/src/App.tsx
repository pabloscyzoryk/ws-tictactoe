// imports
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";

// pages
import Home from "./pages/Home";
import Game from "./pages/Game";

// components
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <Box className="App">
      <BrowserRouter>
        <NavBar />

        <Box pos="relative" top={50}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  );
};

export default App;
