"use client";

import { observer } from "mobx-react-lite";
import { Toaster } from "sonner";

import { SoundProvider, SoundToggle } from "./components/sound";
import { EditorLayout } from "./components/editor-layout/EditorLayout";
import { useEditorController } from "./hooks/useEditorController";

export const EditorPage = observer(() => {
  const controller = useEditorController();

  return (
    <SoundProvider>
      <EditorLayout controller={controller} />
      <SoundToggle />
      <Toaster position="bottom-right" />
    </SoundProvider>
  );
});

export default EditorPage;
