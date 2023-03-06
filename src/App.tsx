import { Suspense } from "react";
import { Canvas } from "./components/Canvas/Canvas";
import { LiveList } from "@liveblocks/client";
import { Presence, Storage } from "./types";
import { Toolbar } from "./components/Toolbar/Toolbar";
import styles from "./App.module.css";
import { RoomProvider } from "./liveblocks.config";

const initialPresence: Presence = {
  color: "#000000",
  coordinates: null,
  currentLine: null,
};

const initialStorage: Storage = {
  lines: new LiveList(),
};

function App() {
  return (
    <RoomProvider
      id="together"
      initialPresence={initialPresence}
      initialStorage={initialStorage}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas />
        <div className={styles.floating}>
          <Toolbar />
        </div>
      </Suspense>
    </RoomProvider>
  );
}

export default App;
