// utility function to make been with specified duration, freq. and volume
const myAudioContext = new AudioContext();
export const beep = (
  duration?: number,
  frequency?: number,
  volume?: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    duration = duration ?? 200;
    frequency = frequency ?? 440;
    volume = volume ?? 100;
    try {
      const oscillatorNode = myAudioContext.createOscillator();
      const gainNode = myAudioContext.createGain();
      oscillatorNode.connect(gainNode);
      oscillatorNode.frequency.value = frequency;
      oscillatorNode.type = "square";
      gainNode.connect(myAudioContext.destination);
      gainNode.gain.value = volume * 0.01;
      oscillatorNode.start(myAudioContext.currentTime);
      oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);
      oscillatorNode.onended = () => {
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
};
