import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { Col, Row, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@douyinfe/semi-ui";
// @ts-ignore
import fx from "glfx";
import "./index.scss";

const { Dragger } = Upload;

export default function ImgFilter() {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [currentImg, setCurrentImg] = useState<any>(null);
  const [fxData,setFxData] = useState<any>({
    canvas:null,
    textur:null,
  })
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filterValue, setFilterValue] = useState<any>({
    brightness: 0,
    contrast: 0,
  });

  const filesChange = (info: any) => {
    const hasFile = fileList.find(
      (file: UploadFile) => info.file.name === file.name
    );
    if (hasFile) {
      return;
    } else {
      setFileList([info.file]);
      let reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj);
      const img: any = document.createElement("img");
      reader.onload = function (e: any) {
        img.src = e.target.result;
        setCurrentImg(img);
      };
      img.onload = function () {
        const canvas: any = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const redrawCanvas = () => {
    const canvas = fx.canvas();
    const texture = canvas.texture(currentImg);
    setFxData({
      canvas,
      textur: texture,
    }) 
  };
  

  const brightnessOnChange = (value: any) => {
    setFilterValue((prev:any) => ({...prev, brightness: value }));
    if (fxData.canvas) {
      fxData.canvas.draw(fxData.textur).brightnessContrast(value,filterValue.contrast).update();
      const displayCanvas:any = canvasRef.current;
      displayCanvas.width = currentImg.width;
      displayCanvas.height = currentImg.height;
      const ctx = displayCanvas.getContext("2d");
      ctx.drawImage(fxData.canvas, 0, 0);
    }
  };

  const contrastOnChange = (value: any) => {
    setFilterValue((prev:any) => ({...prev, contrast: value }));
    if (fxData.canvas) {
      fxData.canvas.draw(fxData.textur).brightnessContrast(filterValue.brightness,value).update();
      const displayCanvas:any = canvasRef.current;
      displayCanvas.width = currentImg.width;
      displayCanvas.height = currentImg.height;
      const ctx = displayCanvas.getContext("2d");
      ctx.drawImage(fxData.canvas, 0, 0);
    }
  }

  useEffect(() => {
    if (currentImg) {
      redrawCanvas();
    }
  }, [currentImg]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <div className="filter-item">
            <div>Brightness</div>
            <Slider  showBoundary={true} min={-1} max={1} step={0.01} onChange={brightnessOnChange}></Slider>
          </div>
          <div className="filter-item">
            <div>Contrast</div>
            <Slider showBoundary={true} min={-1} max={1} step={0.01} onChange={contrastOnChange}></Slider>
          </div>
        </Col>
        <Col span={16}>
          {fileList.length ? <canvas style={{ width: "100%" }} ref={canvasRef} /> : (
            <Dragger
              name="file"
              multiple
              onChange={filesChange}
              fileList={fileList}
              customRequest={() => {}}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽上传图片</p>
            </Dragger>
          )}
        </Col>
      </Row>
    </div>
  );
}
