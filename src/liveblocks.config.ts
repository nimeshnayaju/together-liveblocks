import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Presence, Storage } from "./types";

export const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_API_KEY,
  throttle: 16,
});

export const {
  suspense: {
    useRoom,
    RoomProvider,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
    useUpdateMyPresence,
  },
} = createRoomContext<Presence, Storage>(client);
