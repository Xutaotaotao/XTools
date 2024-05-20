export function createRandomArray(length: number, min = 1, max = 1000) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return array;
}

 export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length === 1) {
    return '';
  }
  const extension = parts.pop();
  if (extension) {
    return extension.toLowerCase();
  }
  return '';
}

export function formatMs(msTotal: number) {
  const ms = msTotal % 1000;
  const secs = ((msTotal - ms) / 1000) % 60;
  const mins = (((msTotal - ms) / 1000 - secs) / 60) % 60;
  const hrs = (((msTotal - ms) / 1000 - secs) / 60 - mins) / 60;
  const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';

  return `${hrsString}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
    .toString()
    .padStart(3, '0')}`;
}