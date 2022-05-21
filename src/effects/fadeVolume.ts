export function fadeVolume(node, { duration = 500 }) {
  const startVolume = node.volume;

  return {
    duration,
    tick: (t: number) => {
      node.volume = startVolume * t;
    }
  };
}