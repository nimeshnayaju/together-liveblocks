import { LiveList } from "@liveblocks/client";

export type Point = [number, number, number];

export type Line = {
  id: number;
  color: string;
  points: Point[];
};

export type Presence = {
  color: string;
  coordinates: [number, number] | null;
  currentLine: Point[] | null;
};

export type Storage = {
  lines: LiveList<Line>;
};
