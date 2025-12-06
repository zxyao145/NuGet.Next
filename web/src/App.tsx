import "./App.css";
import GlobalLayout from "./_layout/GlobalLayout";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

function App() {
  return (
    <GlobalLayout>
      <RouterProvider router={routes} />
    </GlobalLayout>
  );
}

export default App;
