import {createRoot} from "react-dom/client";
import {SpaContainer} from "pithekos-lib";
import {createHashRouter, RouterProvider} from "react-router-dom";
import './index.css';
import NewBcvContent from "./pages/NewBcvContent";
import App from "./App";

const router = createHashRouter([
    {
        path:"/",
        element:<App/>
    },
    {
        path: "bookChapterVerse",
        element: <NewBcvContent/>
    },
]);

createRoot(document.getElementById("root"))
    .render(
        <SpaContainer>
            <RouterProvider router={router}/>
        </SpaContainer>
    );