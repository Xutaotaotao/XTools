import { InboxOutlined } from "@ant-design/icons";
import { Slider } from "@douyinfe/semi-ui";
import type { UploadFile } from "antd";
import { Col, Row, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import fx from "glfx";
import "./index.scss";

const { Dragger } = Upload;

export default function ImgFilter() {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [currentImg, setCurrentImg] = useState<any>(null);
  const [fxData, setFxData] = useState<any>({
    canvas: null,
    textur: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filterValue, setFilterValue] = useState<any>({
    brightness: 0,
    contrast: 0,
    hue: 0,
    saturation: 0,
    vibrance:0,
    denoise:25,
  });

  const filterSetting = [
    { key: "brightness", label: "Brightness", min: -1, max: 1, step: 0.01 },
    { key: "contrast", label: "Contrast", min: -1, max: 1, step: 0.01 },
    { key: "hue", label: "Hue", min: -1, max: 1, step: 0.01 },
    { key: "saturation", label: "Saturation", min: -1, max: 1, step: 0.01 },
    { key: "vibrance", label: "Vibrance", min: -1, max: 1, step: 0.01 },
    { key: "denoise", label: "Denoise", min: 0, max: 50, step: 1,defaultValue:25 },

  ];

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
    });
  };

  const sliderOnChange = (key: any, value: any) => {
    setFilterValue((prev: any) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (currentImg) {
      redrawCanvas();
    }
  }, [currentImg]);

  useEffect(() => {
    if (fxData.canvas) {
      fxData.canvas
        .draw(fxData.textur)
        .brightnessContrast(filterValue.brightness, filterValue.contrast)
        .hueSaturation(filterValue.hue, filterValue.saturation)
        .vibrance(filterValue.vibrance)
        .denoise(filterValue.denoise)
        .update();
      const displayCanvas: any = canvasRef.current;
      displayCanvas.width = currentImg.width;
      displayCanvas.height = currentImg.height;
      const ctx = displayCanvas.getContext("2d");
      ctx.drawImage(fxData.canvas, 0, 0);
    }
  }, [filterValue]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          {filterSetting.map((item: any) => (
            <div className="filter-item" key={item.key}>
              <div>{item.label}</div>
              <Slider
                showBoundary={true}
                min={item.min}
                max={item.max}
                step={item.step}
                defaultValue={item.defaultValue}
                onChange={(val) => {sliderOnChange(item.key, val) }}
              ></Slider>
            </div>
          ))}
        </Col>
        <Col span={16}>
          {fileList.length ? (
            <canvas style={{ maxWidth: "100%",maxHeight:'700px' }} ref={canvasRef} />
          ) : (
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
