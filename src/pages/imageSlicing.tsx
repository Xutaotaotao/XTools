import { Row, Col, Upload, UploadFile, Button } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Radio, RadioGroup } from "@douyinfe/semi-ui";
import ScreenSplitIcon from "@/components/ScreenSplitIcon";
import { IconSync } from "@douyinfe/semi-icons";
import { createRandomArray } from "@/utils";

const { Dragger } = Upload;

interface FileItem extends UploadFile {
  dealData?: any;
  originImgBuffer: ArrayBuffer;
}
interface Image {
  new (): HTMLImageElement;
}
interface RadioGroupItem {
  x: number;
  y: number;
  text: string;
}

interface RadioGroupList {
  [key: string]: RadioGroupItem;
}

const RadioGroupList: RadioGroupList = {
  "1": { x: 2, y: 2, text: "4张" },
  "2": { x: 3, y: 2, text: "6张" },
  "3": { x: 4, y: 2, text: "8张" },
  "4": { x: 2, y: 3, text: "6张" },
  "5": { x: 3, y: 3, text: "9张" },
  "6": { x: 4, y: 3, text: "12张" },
  "7": { x: 2, y: 4, text: "8张" },
  "8": { x: 3, y: 4, text: "12张" },
  "9": { x: 4, y: 4, text: "16张" },
};

const ImageSlicing = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [currentImg, setCurrentImg] = useState("");

  const [customX, setCustomX] = useState(0); // 自定义列数
  const [customY, setCustomY] = useState(0); // 自定义行数

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resetCustom = () => {
    setCustomX(0);
    setCustomY(0);
  };

  const filesChange = (info: any) => {
    const hasFile = fileList.find(
      (file: FileItem) => info.file.name === file.name
    );
    if (hasFile) {
      return;
    } else {
      setFileList([info.file]);
      let reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj);
      const img: any = document.createElement("img");
      reader.onload = function (e: any) {
        setCurrentImg(img);
        img.src = e.target.result;
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

  const handleDrag = (e: any, data: any) => {};


  const renderDraggableList = (val: number, axis: "x" | "y" = "x") => {
    if (val) {
      const list = createRandomArray(val - 1);
      const canvas: any = canvasRef.current;
      const unitSize = (axis === "x" ? canvas.width : canvas.height) / (val + 1);
      
      return list.map((item, index) => {
        const position = unitSize * (index + 1);
        const lineStyle = axis === "x"
          ? { width: '2px', height: '100%', top: 0, left: position,zIndex: 100 }
          : { width: "100%", height: '2px', top: position, left: 0,zIndex: 100 };
        
        return (
          <Draggable
            axis={axis}
            defaultPosition={axis === "x" ? { x: position, y: 0 } : { x: 0, y: position }}
            handle={`.handle-${axis}-${index}`}
            key={axis + item}
          >
            <div
              style={{
                position: 'absolute',
                ...lineStyle,
                background: "red",
              }}
            >
              <div
                className={`handle-${axis}-${index}`}
                style={{
                  ...lineStyle,
                  cursor: axis === "x" ? "ew-resize" : "ns-resize",
                }}
              />
            </div>
          </Draggable>
        );
      });
    }
    return null;
  }

  const radioGroupOnChange = (e: any) => {
    const { x, y } = RadioGroupList[e.target.value];
    setCustomX(x);
    setCustomY(y);
  };

  return (
    <Row>
      <Col span={5}>
        <RadioGroup
          type="pureCard"
          direction="horizontal"
          aria-label="单选组合示例"
          name="demo-radio-group-pureCard"
          onChange={radioGroupOnChange}
        >
          <Row>
            {Object.keys(RadioGroupList).map((key) => {
              return (
                <Col span={8}>
                  <Radio
                    key={key}
                    value={key}
                    extra={
                      <ScreenSplitIcon
                        x={RadioGroupList[key].x}
                        y={RadioGroupList[key].y}
                        size={16}
                      />
                    }
                  >
                    {RadioGroupList[key].text}
                  </Radio>
                </Col>
              );
            })}
          </Row>
        </RadioGroup>
        <Form
          labelPosition="left"
          onValueChange={(values) => {
            setCustomX(values.xVal || 0);
            setCustomY(values.yVal || 0);
          }}
        >
          <Form.InputNumber field="yVal" label="自定义行" />
          <Form.InputNumber field="xVal" label="自定义列" />
        </Form>
        <Button
          style={{ width: "100%" }}
          icon={<IconSync />}
          aria-label="恢复原图"
          onClick={resetCustom}
        >
          恢复原图
        </Button>
      </Col>
      <Col span={17} offset={1}>
        <div style={{ width: "100%", height: "100%" }}>
          {fileList.length ? (
            <>
              <canvas
                style={{ width: "100%", height: "100%",position: "relative" }}
                ref={canvasRef}
              />
                {renderDraggableList(customX,'x')}
                {renderDraggableList(customY,'y')}
            </>
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
              <p className="ant-upload-text">
                {t("Click or drag file to this area to upload")}
              </p>
            </Dragger>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default ImageSlicing;
