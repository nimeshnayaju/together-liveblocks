import { PointerEvent, useEffect, useRef } from "react";
import {
  useMutation,
  useOthers,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "../../liveblocks.config";
import { Line, Point } from "../../types";
import { getSvgPathFromStroke } from "../../utils/getSvgPathFromStroke";
import getStroke from "perfect-freehand";
import styles from "./Canvas.module.css";

const date = new Date();
date.setUTCHours(0, 0, 0, 0);

const START_TIME = date.getTime();

const getYOffset = () => (Date.now() - START_TIME) / 50;

export function Canvas() {
  const svgRef = useRef<SVGGElement>(null);
  const updatePresence = useUpdateMyPresence();

  const startLine = useMutation((root, point: Point) => {
    const { setMyPresence } = root;
    setMyPresence({
      coordinates: [point[0], point[1]],
      currentLine: [point],
    });
  }, []);

  const continueLine = useMutation((root, point: Point) => {
    const { self, setMyPresence } = root;
    const { currentLine } = self.presence;

    if (currentLine == null) {
      setMyPresence({
        coordinates: [point[0], point[1]],
      });
    } else {
      setMyPresence({
        coordinates: [point[0], point[1]],
        currentLine: [...currentLine, point],
      });
    }
  }, []);

  const endLine = useMutation((root, point: Point) => {
    const { self, setMyPresence, storage } = root;
    const { currentLine } = self.presence;

    if (currentLine == null) return;

    const newLine: Line = {
      id: Date.now(),
      color: self.presence.color,
      points: [...currentLine, point],
    };

    storage.get("lines").push(newLine);

    setMyPresence({
      coordinates: [point[0], point[1]],
      currentLine: null,
    });
  }, []);

  const handlePointerDown = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startLine([e.clientX, e.clientY + getYOffset(), e.pressure]);
  };

  const handlePointerMove = (e: PointerEvent<SVGSVGElement>) => {
    continueLine([e.clientX, e.clientY + getYOffset(), e.pressure]);
  };

  const handlePointerUp = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    endLine([e.clientX, e.clientY + getYOffset(), e.pressure]);
  };

  const handlePointerEnter = (e: PointerEvent<SVGSVGElement>) => {
    updatePresence({
      coordinates: [e.clientX, e.clientY + getYOffset()],
      currentLine: null,
    });
  };

  const handlePointerLeave = (e: PointerEvent<SVGSVGElement>) => {
    updatePresence({ coordinates: null, currentLine: null });
  };

  useEffect(() => {
    const translate = () => {
      const svg = svgRef.current;

      if (!svg) return;

      svg.setAttribute("transform", `translate(0, -${getYOffset()})`);

      requestAnimationFrame(translate);
    };

    const animationFrame = requestAnimationFrame(translate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={styles.canvas}
    >
      <g ref={svgRef}>
        <Lines />
        <CurrentLines />
        <Others />
      </g>
    </svg>
  );
}

function CurrentLines() {
  const users = useOthers((others) =>
    others.filter((other) => other.presence.currentLine !== null)
  );

  const self = useSelf((self) => self.presence);

  return (
    <>
      {self && self.currentLine && (
        <LineComponent
          points={self.currentLine}
          color={self.color}
          isComplete={false}
        />
      )}

      {users.map((user) => {
        const { color, currentLine } = user.presence;

        if (currentLine === null) return null;

        return (
          <LineComponent
            key={user.connectionId}
            points={currentLine}
            color={color}
            isComplete={false}
          />
        );
      })}
    </>
  );
}

function Others() {
  const others = useOthers((others) =>
    others.filter((other) => other.presence.coordinates !== null)
  );

  return (
    <>
      {others.map((other) => {
        const { color, coordinates } = other.presence;

        if (coordinates === null) return null;

        return (
          <circle
            key={other.connectionId}
            cx={coordinates[0]}
            cy={coordinates[1]}
            r={6}
            fill={color}
          />
        );
      })}
    </>
  );
}

function Lines() {
  const lines = useStorage((root) => root.lines);

  if (!lines) return null;

  return (
    <>
      {lines.map((stroke) => {
        const { id, color, points } = stroke;

        return (
          <LineComponent key={id} points={points} color={color} isComplete />
        );
      })}
    </>
  );
}

function LineComponent({
  points,
  color,
  isComplete,
}: Omit<Line, "id"> & { isComplete: boolean }) {
  const pathData = getSvgPathFromStroke(
    getStroke(points, {
      size: 14,
      smoothing: 0.5,
      thinning: 0.5,
      streamline: 0.5,
      easing: (t) => t,
      start: { taper: 0, cap: true },
      end: { taper: 0, cap: true },
      simulatePressure: false,
      last: isComplete,
    })
  );

  return (
    <g fill={color}>
      <path d={pathData} fill={color} />
    </g>
  );
}
