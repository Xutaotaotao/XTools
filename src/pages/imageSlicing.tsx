import { Row, Col, Upload, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Radio, RadioGroup, Space } from "@douyinfe/semi-ui";
import ScreenSplitIcon from "@/components/ScreenSplitIcon";
import { IconSync, IconAlignBottom, IconAlignTop } from "@douyinfe/semi-icons";
import { createRandomArray } from "@/utils";
import "./index.scss";

const { Dragger } = Upload;

const FIXED_WIDTH = 600;
const FIXED_HEIGHT = 800;

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
  const imageRef = useRef<HTMLImageElement>(null);
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [currentImg, setCurrentImg] = useState("");
  const [customX, setCustomX] = useState(0);
  const [customY, setCustomY] = useState(0);
  const [imgNaturalSize, setImgNaturalSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [draggableListData, setDraggableListData] = useState<any[]>([]);
  const [radioGroupValue, setRadioGroupValue] = useState("");

  const resetCustom = () => {
    setCustomX(0);
    setCustomY(0);
    setRadioGroupValue("");
  };

  const filesChange = (info: any) => {
    const hasFile = fileList.find((file) => info.file.name === file.name);
    if (hasFile) {
      return;
    } else {
      setFileList([info.file]);
      let reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj);
      reader.onload = function (e: any) {
        setCurrentImg(e.target.result);
      };
    }
  };

  const handleDragOnStop = (e: any, data: any, key: string) => {
    const { x, y } = data;
    setDraggableListData(
      draggableListData.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            newPosition: { x, y },
          };
        }
        return item;
      })
    );
  };

  const radioGroupOnChange = (e: any) => {
    const { x, y } = RadioGroupList[e.target.value];
    setCustomX(x);
    setCustomY(y);
    setRadioGroupValue(e.target.value);
  };

  const reUpload = () => {
    setFileList([]);
    setCurrentImg("");
    resetCustom();
  };

  const downloadSlice = (sliceData: any, fileName: string) => {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = sliceData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sliceImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context || !imageRef.current) {
      return;
    }
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;

    const xLines = draggableListData
      .filter((item) => item.axis === "x")
      .map((item) =>
        item.newPosition ? item.newPosition.x : item.defaultPosition.x
      )
      .map((item) => Math.round(item / scale))
      .concat(imageWidth)
      .sort((a, b) => a - b);
    console.log(xLines);
    const yLines = draggableListData
      .filter((item) => item.axis === "y")
      .map((item) =>
        item.newPosition ? item.newPosition.y : item.defaultPosition.y
      )
      .map((item) => Math.round(item / scale))
      .concat(imageHeight)
      .sort((a, b) => a - b);
    for (let y = 0; y < yLines.length; y++) {
      for (let x = 0; x < xLines.length; x++) {
        const sliceX = x === 0 ? 0 : xLines[x - 1];
        const sliceY = y === 0 ? 0 : yLines[y - 1];
        const sliceWidth =
          x === xLines.length - 1 ? imageWidth - sliceX : xLines[x] - sliceX;
        const sliceHeight =
          y === yLines.length - 1 ? imageHeight - sliceY : yLines[y] - sliceY;

        canvas.width = sliceWidth;
        canvas.height = sliceHeight;

        context.drawImage(
          imageRef.current,
          sliceX,
          sliceY,
          sliceWidth,
          sliceHeight,
          0,
          0,
          sliceWidth,
          sliceHeight
        );

        const sliceData = canvas.toDataURL("image/png");
        downloadSlice(sliceData, `slice_${x}_${y}.png`);
      }
    }
  };

  useEffect(() => {
    const xDraggableList = createRandomArray(customX - 1);
    const yDraggableList = createRandomArray(customY - 1);
    if (imageRef.current) {
      const imageSize = {
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      };
      const xUnitSize = imageSize.width / customX;
      const yUnitSize = imageSize.height / customY;
      setDraggableListData(
        xDraggableList
          .map((item, index) => {
            const position = xUnitSize * (index + 1);
            return {
              axis: "x",
              defaultPosition: { x: position, y: 0 },
              handle: `handle-x-${item}`,
              key: `x-${item}`,
              lineStyle: {
                width: 1,
                height: imageSize.height,
                zIndex: 100,
              },
            };
          })
          .concat(
            yDraggableList.map((item, index) => {
              const position = yUnitSize * (index + 1);
              return {
                axis: "y",
                defaultPosition: { x: 0, y: position },
                handle: `handle-y-${item}`,
                key: `y-${item}`,
                lineStyle: {
                  width: imageSize.width,
                  height: 1,
                  zIndex: 100,
                },
              };
            })
          )
      );
    } else {
      setDraggableListData([]);
    }
  }, [customX, customY, imageRef.current]);

  return (
    <Row gutter={24}>
      <Col lg={5} xs={24}>
        <RadioGroup
          type="pureCard"
          direction="horizontal"
          aria-label="单选组合示例"
          name="demo-radio-group-pureCard"
          onChange={radioGroupOnChange}
          value={radioGroupValue}
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
        <Space vertical style={{ width: "100%" }}>
          {fileList.length && customX > 0 && customY > 0 ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconSync />}
              aria-label="恢复原图"
              onClick={resetCustom}
              type="dashed"
            >
              恢复原图
            </Button>
          ) : null}

          {fileList.length ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconAlignTop />}
              aria-label="重新上传图片"
              onClick={reUpload}
            >
              重新上传图片
            </Button>
          ) : null}

          {fileList.length && customX > 0 && customY > 0 ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconAlignBottom />}
              aria-label="重新上传图片"
              onClick={sliceImage}
              type="primary"
            >
              下载切割图片
            </Button>
          ) : null}
        </Space>
      </Col>
      <Col lg={19} xs={24}>
        {fileList.length ? (
          <div className="image-container">
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: imgNaturalSize.width * scale,
                height: imgNaturalSize.height * scale,
                transformOrigin: "top left",
              }}
            >
              <img
                ref={imageRef}
                src={currentImg}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onLoad={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  const width = imgElement.naturalWidth;
                  const height = imgElement.naturalHeight;
                  const heightScale = FIXED_HEIGHT / height;
                  const widthScale = FIXED_WIDTH / width;
                  setScale(Math.min(heightScale, widthScale));
                  setImgNaturalSize({
                    width,
                    height,
                  });
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: imgNaturalSize.width * scale,
                  height: imgNaturalSize.height * scale,
                }}
              >
                {draggableListData.map(
                  ({ axis, defaultPosition, handle, key, lineStyle }) => (
                    <Draggable
                      axis={axis}
                      defaultPosition={defaultPosition}
                      handle={`.${handle}`}
                      key={key}
                      onStop={(e, data) => {
                        handleDragOnStop(e, data, key);
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          ...lineStyle,
                          background: "red",
                        }}
                      >
                        <div
                          className={handle}
                          style={{
                            ...lineStyle,
                            cursor: axis === "x" ? "ew-resize" : "ns-resize",
                          }}
                        />
                      </div>
                    </Draggable>
                  )
                )}
              </div>
            </div>
          </div>
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
              点击或拖拽上传图片
            </p>
          </Dragger>
        )}
      </Col>
    </Row>
  );
};

export default ImageSlicing;
