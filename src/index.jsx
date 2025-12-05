import {createRoot} from "react-dom/client";
import {SpaContainer} from "pithekos-lib";
import {createHashRouter, RouterProvider} from "react-router-dom";
import './index.css';
import NewBcvContent from "./pages/NewBcvContent";
import NewBcvBook from "./pages/NewBcvBook";
import App from "./App";

const router = createHashRouter([
    {
        path:"/",
        element:<App/>
    },
    {
        path: "/createDocument/bookChapterVerse",
        element: <NewBcvContent/>
    },
    {
        path:"newBook",
        element:<NewBcvBook/>
    }
]);

createRoot(document.getElementById("root"))
    .render(
        <SpaContainer>
            <RouterProvider router={router}/>
        </SpaContainer>
    );