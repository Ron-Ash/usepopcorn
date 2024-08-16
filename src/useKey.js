import { useEffect } from "react";

export function useKey(keyCode, event, callback, deps) {
  useEffect(
    function () {
      document.addEventListener(event, callback);

      return function () {
        document.removeEventListener(event, callback);
      };
    },
    [keyCode, event, callback, ...deps]
  );
}
