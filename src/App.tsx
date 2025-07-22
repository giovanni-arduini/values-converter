import "./App.css";
import { GlobalProvider } from "./Contexts/GlobalContext";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </>
  );
}

export default App;
