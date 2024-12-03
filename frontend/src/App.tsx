import "./App.css";

import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import HomeView from "./pages/HomeView.tsx";

export default function App() {
  return (
    <div id='app'>
      <Header />
      <HomeView />
      <Footer />
    </div>
  );
}
