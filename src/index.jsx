import { createRoot } from "react-dom/client";
import { getAndSetJson } from "pankosmia-lib/http";
import { SpaContainer } from "pankosmia-rcl";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NewBcvContent from "./pages/NewBcvContent";
import NewBcvBook from "./pages/NewBcvBook";
import TsvExport from "./pages/Export/TsvExport";
import App from "./App";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import { styled } from "@mui/material";
import MuncherTest from "./pages/MuncherTest";
import TsvImport from "./pages/Import/TsvImport";
import "material-symbols/outlined.css";

const router = createHashRouter([
  {
    path: "/",
    element: <MuncherTest />,
  },
  {
    path: "/createDocument/bookChapterVerse",
    element: <NewBcvContent />,
  },
  {
    path: "newBook",
    element: <NewBcvBook />,
  },
  {
    path: "/export/tsv",
    element: <TsvExport />,
  },
  {
    path: "/MuncherTest",
    element: <MuncherTest />,
  },
  {
    path: "importBook",
    element: <TsvImport />,
  },
]);

function AppLayout() {
  const CustomSnackbarContent = styled(MaterialDesignContent)(() => ({
    "&.notistack-MuiContent-error": {
      backgroundColor: "#FDEDED",
      color: "#D32F2F",
    },
    "&.notistack-MuiContent-info": {
      backgroundColor: "#E5F6FD",
      color: "#0288D1",
    },
    "&.notistack-MuiContent-warning": {
      backgroundColor: "#FFF4E5",
      color: "#EF6C00",
    },
    "&.notistack-MuiContent-success": {
      backgroundColor: "#EDF7ED",
      color: "#2E7D32",
    },
  }));

  return (
    <SnackbarProvider
      Components={{
        error: CustomSnackbarContent,
        info: CustomSnackbarContent,
        warning: CustomSnackbarContent,
        success: CustomSnackbarContent,
      }}
      maxSnack={6}
    >
      <SpaContainer>
        <RouterProvider router={router} />
      </SpaContainer>
    </SnackbarProvider>
  );
}
createRoot(document.getElementById("root")).render(<AppLayout />);
