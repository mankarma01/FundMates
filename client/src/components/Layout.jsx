import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <main className="pt-20 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
