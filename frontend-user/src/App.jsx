import Navbar from "./components/layout/Navbar";
import Hero from "./components/layout/Hero";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <Hero />
      <main className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Tendances actuelles</h2>
        <p className="text-gray-400">Les films arrivent bientôt...</p>
      </main>
    </div>
  );
}

export default App;
