import ImageEditor from "tui-image-editor";
import "tui-color-picker/dist/tui-color-picker.css";
import "tui-image-editor/dist/tui-image-editor.css";
import { useEffect, useRef } from "react";
import TestImg from "@/assets/img/test.jpg"

export default function ImageEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);

  const options = {
    includeUI: {
      menuBarPosition: "left",
      initMenu: "filter",
      loadImage:{
        path:TestImg,
        name:'预览'
      },
      locale:{
        Download: "下载",
        Load: "上传",
      },
      theme:{
        "common.bi.image": "",
        "downloadButton.backgroundColor": "#00a9ff",
        "downloadButton.border":"#00a9ff"
      }
    },
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
    
  };

  useEffect(() => {
    if (!editorRef.current) return;
    new ImageEditor(editorRef.current,options);
  }, []);

  return <div style={{ width: "100%", height: 'calc(100vh - 160px)' }}>
    <div id="tui-image-editor" style={{ width: "100%", height: "100%" }} ref={editorRef}></div>
  </div> 

}