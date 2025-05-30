# Audio Files Directory

Place your audio files in this directory to use with the SoundToggle component.

## Usage

1. Add your audio file (e.g., `background-ambience.mp3`) to this directory
2. Reference it in your component:

```tsx
<SoundToggle audioSrc="/audio/your-audio-file.mp3" />
```

## Current Implementation

The current implementation in the editor page is looking for a file named `background-ambience.mp3`.
Please add this file here, or update the reference in `apps/blog/src/app/components/pages/editor/index.tsx`:

```tsx
// Update this to match your actual audio file
const BACKGROUND_AUDIO = "/audio/your-actual-file.mp3";
```
