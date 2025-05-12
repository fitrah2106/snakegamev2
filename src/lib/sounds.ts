// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create audio objects only in browser environment
const createAudio = (src: string) => {
  if (!isBrowser) return null;
  return new Audio(src);
};

export const sounds = {
  background: createAudio('/sounds/y2mate_HrgsElu.mp3'),
  click: createAudio('/sounds/meme-click.mp3'),
  score: createAudio('/sounds/vpuxsya-vgi-00_00_03.mp3'),
  eat: createAudio('/sounds/cartoon_bite_sound_effect.mp3'),
  gameOver: createAudio('/sounds/goofy-ahh-spongebob-sound.mp3')
};

// Set background music to loop only in browser
if (isBrowser && sounds.background) {
  sounds.background.loop = true;
}

export const playSound = (sound: keyof typeof sounds) => {
  if (!isBrowser) return;
  
  const audio = sounds[sound];
  if (!audio) return;

  // Clone the audio to allow multiple instances to play
  const audioClone = audio.cloneNode() as HTMLAudioElement;
  audioClone.play().catch(error => console.error('Error playing sound:', error));
};

export const stopSound = (sound: keyof typeof sounds) => {
  if (!isBrowser) return;
  
  const audio = sounds[sound];
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}; 