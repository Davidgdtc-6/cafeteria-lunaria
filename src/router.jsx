import { useEffect, useState } from "react";

const NAVIGATE_EVENT = "lunaria:navigate";

function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

/**
 * Enrutador minimo basado en la History API. El proyecto no traia router, asi que
 * se resuelve sin dependencias nuevas: basta con leer la ruta y navegar con
 * pushState para que el boton de atras del navegador siga funcionando.
 */
export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const handle = () => setPath(currentPath());

    window.addEventListener("popstate", handle);
    window.addEventListener(NAVIGATE_EVENT, handle);

    return () => {
      window.removeEventListener("popstate", handle);
      window.removeEventListener(NAVIGATE_EVENT, handle);
    };
  }, []);

  return path;
}

export function navigate(to) {
  const target = to.startsWith("/") ? to : `/${to}`;

  if (currentPath() === target) return;

  window.history.pushState({}, "", target);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}
