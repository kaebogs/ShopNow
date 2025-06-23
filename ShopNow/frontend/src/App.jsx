import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import UserRoutes from "./components/Routes/UserRoutes";
import AdminRoutes from "./components/Routes/AdminRoutes";

function App() {
  const userRoutes = UserRoutes();
  const adminRoutes = AdminRoutes();

  return (
    <>
      <Router>
        <div className="App">
          <Header />
          <Toaster />
          <div className="container">
            <Routes>
              {userRoutes}
              {adminRoutes}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
