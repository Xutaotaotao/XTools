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