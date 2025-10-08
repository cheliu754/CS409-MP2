import { BrowserRouter, Route, Routes, Link, Outlet } from 'react-router-dom';
import { ListPage, GalleryPage, DetailPage } from '../pages/pages';
import { getBaseName } from '../plugin/plugin';


const Shell = () => (
  <div>
    <header className="container appHeader">
      <nav className="nav">
        <Link to="/">List</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
    </header>
    <main className="container">
      <Outlet />
    </main>
    <footer className="container footer">Rely on: TMDB · React + TS</footer>
  </div>
);


export const App = () => (
  <BrowserRouter basename={getBaseName()}>
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<ListPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="detail/:id" element={<DetailPage />} />
        <Route path="*" element={<div className="container">404 Not Found</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);