import { createContext, useContext, useRef, useState } from "react";
import { bcvContext } from "pankosmia-rcl";

const BCVNavigationContext = createContext(null);

export function BCVNavigationProvider({ children }) {
  const { bcvRef } = useContext(bcvContext);
  const [ingredient, setIngredient] = useState([]);
  const [md5Ingredient, setMd5Ingredient] = useState([]);
  const [currentReference, setCurrentReference] = useState(
    `${bcvRef?.current.chapterNum}:${bcvRef?.current.verseNum}`,
  );
  const [hiddenFields, setHiddenFields] = useState([]);
  const pendingRef = useRef(null);

  return (
    <BCVNavigationContext.Provider
      value={{
        ingredient,
        setIngredient,
        md5Ingredient,
        setMd5Ingredient,
        currentReference,
        setCurrentReference,
        hiddenFields,
        setHiddenFields,
        pendingRef,
      }}
    >
      {children}
    </BCVNavigationContext.Provider>
  );
}

export function useBCVNavigation() {
  return useContext(BCVNavigationContext);
}
