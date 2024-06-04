import { writeBinaryFile } from '@tauri-apps/api/fs';
import { path, dialog } from '@tauri-apps/api';
import JSZip from 'jszip';
import dayJS from 'dayjs';
import { FileBase64List } from '@/type';

export const downloadFileBase64 = async (data: any, fileName: string) => {
  if (window.__TAURI__){
    const binaryString = atob(data.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    try {
      const basePath = await path.downloadDir();
      let selPath:any = await dialog.save({
        defaultPath: basePath,
      });
      selPath = selPath.replace(/Untitled$/, '');
      writeBinaryFile({ contents: bytes, path: `${selPath}${fileName}` });
    } catch (error) {
      console.error(error);
    }
  } else {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const downloadBase64FileWithZip =async (data:FileBase64List,callback:Function) => {
  const zip = new JSZip();
  data.forEach(item => {
    zip.file(item.name, item.data.replace(/^data:image\/(png|jpg);base64,/, ""), { base64: true });
  });
  const date = dayJS().format('YYYYMMDDHHmmss');
  const basePath = await path.downloadDir();
  let selPath:any = await dialog.save({
    defaultPath: basePath,
  });
  selPath = selPath.replace(/Untitled$/, '');
  zip.generateAsync({ type: 'blob' }).then((content) => {
    let file = new FileReader();
    file.readAsArrayBuffer(content);
    file.onload = function (e:any) {
      let fileU8A = new Uint8Array(e.target.result);
      writeBinaryFile({ contents: fileU8A, path: `${selPath}IMG_${date}.zip` });
      callback();
    };
  });
}

export const downloadFileBase64List = async (data:FileBase64List,callback:Function) => {
  if (window.__TAURI__){
    downloadBase64FileWithZip(data,callback)
  } else {
    data.forEach(item => {
      downloadFileBase64(item.data, item.name)
    })
  }
}