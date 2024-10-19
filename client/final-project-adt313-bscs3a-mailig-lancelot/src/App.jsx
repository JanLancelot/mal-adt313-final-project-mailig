import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'

import Authentication from "./pages/Login&Register/Authentication";
import Home from "./pages/Home/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Authentication />,
    },
    {
      path: "/home",
      element: <Home />,
    }
  ]);

  return (
  <RouterProvider router={router} />
  );
}

export default App
