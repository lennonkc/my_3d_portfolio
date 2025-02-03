import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { About, Contact, Home, Projects, Gallery } from "./pages";


const pexel = (id) => `/galleryOut${id}.png`
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1),title: "Everything on Chat",idname:'eoc',idurl:'/galleryOut1.png'},
  // Back
  // { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  // { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  // { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  // { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  { position: [-1.5, 0, 2.15], rotation: [0, Math.PI / 3, 0], url: pexel(2),title: "Meeting Assistant",idname:'ma',idurl:'/galleryOut1.png'},
  // Right
  // { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675) },
  // { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  { position: [1.5, 0, 2.15], rotation: [0, -Math.PI / 3, 0], url: pexel(3), title: "SmartDove",idname:'sd',idurl:'/galleryOut1.png'},
]

const App = () => {
  return (
    <main className='bg-slate-300/20 app-container'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/*'
            element={
              <>
                <Routes>
                  <Route path='/about' element={<About />} />
                  <Route path='/projects' element={<Projects />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/gallery' element={<Gallery images={images}/>} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
