import "./App.css";
import { GlobalProvider } from "./Contexts/GlobalContext";
import { Route, Routes, HashRouter } from "react-router-dom";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <GlobalProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </HashRouter>
      </GlobalProvider>
    </>
  );
}

export default App;
