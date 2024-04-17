import React from 'react';
import Footer from './footer';
import Header from './header';

const Layout = ({ children }) => (
  <div
    style={{
      maxWidth: 1500,
      minHeight: '100vh',
      width: 'calc(100% - 2px)',
      position: 'relative',
    }}
  >
    <section id="top-bar">
      <div className="container">
        <div className="row">
          <div className="col text-center" />
        </div>
      </div>
    </section>
    <div
      style={{
        width: 'calc(100% - 20px)',
        margin: '10px',
        position: 'relative'
      }}
    >
      <div className="row">
        <div
          style={{
            position: 'relative'
          }}
        >
          <Header />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Layout;
