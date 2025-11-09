import React from 'react';
import { Outlet } from 'react-router-dom';
// We will create and import <Navbar /> and <Footer /> here later

function App() {
  return (
    <div className="app-container">
      {/* <Navbar /> */}
      <main>
        {/* All our pages will be rendered here */}
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;