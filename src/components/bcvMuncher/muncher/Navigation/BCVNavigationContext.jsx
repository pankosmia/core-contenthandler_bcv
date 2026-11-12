import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getText } from "pankosmia-lib/http";
import md5 from "md5";
import sortIngredient from "../helpers/sortIngredient";

const BCVNavigationContext = createContext(null);

export function BCVNavigationProvider({
  metadata,
  systemBcv,
  bcvRef,
  debugRef,
  children,
}) {
  const [ingredient, setIngredient] = useState([]);
  const [md5Ingredient, setMd5Ingredient] = useState([]);
  const [currentReference, setCurrentReference] = useState(
    `${bcvRef?.current.chapterNum}:${bcvRef?.current.verseNum}`,
  );
  const [hiddenFields, setHiddenFields] = useState([]);
  const pendingRef = useRef(null);

  useEffect(() => {
    if (!metadata?.local_path || !systemBcv?.bookCode) return;
    let active = true;
    const getAllData = async () => {
      const ingredientLink = `/api/burrito/ingredient/raw/${metadata.local_path}?ipath=${systemBcv.bookCode}.tsv`;
      const response = await getText(ingredientLink, debugRef.current);
      if (active && response.ok) {
        const allRows = response.text
          .split(/\r?\n+/g)
          .map((row) =>
            row.split("\t").map((field) => field.replace(/(\\n){2,}/g, "\n\n")),
          );
        const newIngredient = sortIngredient(allRows);
        setIngredient(newIngredient);
        setMd5Ingredient(md5(JSON.stringify(newIngredient)));
      }
    };
    getAllData();
    return () => {
      active = false;
    };
  }, [metadata?.local_path, systemBcv?.bookCode, debugRef]);

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
