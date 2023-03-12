// imports
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

// redux 
import { Provider as ConnectionProvider } from "react-redux";
import store from "./redux/store";

// styles
import "./style/main.css";

// main App component
import App from "./App";

// chakra-ui
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ConnectionProvider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ConnectionProvider>
  </StrictMode>
);
