import { useState, useCallback, useRef, useEffect } from "react";
import type { Column } from "../features/tables/types";

export function useColumnResize<T>() {
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const widthsRef = useRef(colWidths);
  useEffect(() => {
    widthsRef.current = colWidths;
  }, [colWidths]);

  const handleResize = useCallback(
    (column: Column<T>): React.MouseEventHandler => {
      return (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth =
          widthsRef.current[column.key as string] || column.defaultWidth;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const deltaX = moveEvent.clientX - startX;
          setColWidths((prev) => ({
            ...prev,
            [column.key as string]: Math.max(
              column.minWidth,
              startWidth + deltaX
            ),
          }));
        };

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      };
    },
    []
  );

  return { colWidths, handleResize };
}
