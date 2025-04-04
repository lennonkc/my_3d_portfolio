import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Footer, Navbar } from "./components";
import { About, Contact, Home, Projects, Gallery } from "./pages";

const pexel = (id) => `/galleryOut${id}.png`
const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(3),title: "Agentic AI",idname:'agentai',idurl:'/galleryOut4.png',videoUrl:'https://drive.google.com/file/d/1Ptr3n7GGzBgn1enujw3XvEYoBRGufLF1/view?usp=sharing',introduce:'Intergrate AI into Daily Work'},
  // Back
  // { position: [-0.6, 0, 1.5], rotation: [0, 0, 0], url: pexel(1),title: "Everything on Chat",idname:'eoc',idurl:'/galleryOut1.png',videoUrl:'https://vimeo.com/1052963291',introduce:'AI chat with APIs' },
  // { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  // { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  // { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  { position: [-1.35, 0, 1.95], rotation: [0, Math.PI / 3, 0], url: pexel(2),title: "Meeting Assistant",idname:'ma',idurl:'/galleryOut2.png',videoUrl:'https://vimeo.com/1052963540',introduce:'ASR + TTS + Translate with AI'},
  // Right
  // { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], url: pexel(227675) },
  // { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  { position: [1.35, 0, 1.95], rotation: [0, -Math.PI / 3, 0], url: pexel(1),title: "Everything on Chat",idname:'eoc',idurl:'/galleryOut1.png',videoUrl:'https://vimeo.com/1052963291',introduce:'AI chat with APIs'},
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
                  <Route path='/gallery/:id' element={<Gallery images={images}/>} />
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
