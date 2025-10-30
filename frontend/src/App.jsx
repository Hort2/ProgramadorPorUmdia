import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import Error from "./routes/Error";
import Sobre from "./routes/Sobre";
import Produtos from "./routes/Produtos";
 
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
 
function App() {
  const location = window.location.pathname;
  const hideLayout = location === "/" || location === "/register";
 
  return (
<Router>
      {!hideLayout && <Header />}
 
      {/* Estrutura flexível para manter o footer sempre no fim */}
<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
<main className="flex-1 flex flex-col">
<Routes>
<Route path="/" element={<Login />} />
<Route path="/home" element={<Home />} />
<Route path="/sobre" element={<Sobre />} />
<Route path="/Produtos" element={<Produtos />} />
<Route path="*" element={<Error />} />
<Route path="/register" element={<Register />} />
</Routes>
</main>
 
        {!hideLayout && <Footer />}
</div>
</Router>
  );
}
 
export default App;