import ScreenSplitIcon from "@/components/ScreenSplitIcon";
import { createRandomArray } from "@/utils";
import { InboxOutlined } from "@ant-design/icons";
import { IconAlignBottom, IconAlignTop, IconSync } from "@douyinfe/semi-icons";
import { Form, Radio, RadioGroup, Space } from "@douyinfe/semi-ui";
import { Button, Col, Row, Spin, Upload, message } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";
import { downloadFileBase64List } from "@/bridge/index"
import "./index.less";
import { FileBase64List } from "@/type";
import { useTranslation } from "react-i18next";
import { UploadChangeParam } from "antd/es/upload";


const { Dragger } = Upload;

interface RadioGroupItem {
  x: number;
  y: number;
  text: string;
}

interface RadioGroupList {
  [key: string]: RadioGroupItem;
}

type DraggableAxis = "none" | "both" | "x" | "y" | undefined;

interface DraggableItem {
  axis: DraggableAxis;
  defaultPosition: { x: number; y: number };
  handle: string;
  key: string;
  lineStyle: React.CSSProperties;
  newPosition?: { x: number; y: number };
}

interface FileWithPreview extends UploadFile {
  preview?: string;
}

const FIXED_WIDTH = 600;
const FIXED_HEIGHT = 800;



const ImageSlicing = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const imageRef = useRef<HTMLImageElement>(null);
  const [fileList, setFileList] = useState<FileWithPreview[]>([]);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [customX, setCustomX] = useState<number>(0);
  const [customY, setCustomY] = useState<number>(0);
  const [imgNaturalSize, setImgNaturalSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [scale, setScale] = useState<number>(1);
  const [draggableListData, setDraggableListData] = useState<DraggableItem[]>(
    []
  );
  const [radioGroupValue, setRadioGroupValue] = useState<string>("");
  const [loadingState, setLoadingState]=useState({
    loading: false,
    tip: `${t("saving")}...`
  })
  const RadioGroupList: RadioGroupList = {
    "1": { x: 2, y: 2, text: `4${t("piece")}` },
    "2": { x: 3, y: 2, text: `6${t("piece")}` },
    "3": { x: 4, y: 2, text: `8${t("piece")}` },
    "4": { x: 2, y: 3, text: `6${t("piece")}` },
    "5": { x: 3, y: 3, text: `9${t("piece")}` },
    "6": { x: 4, y: 3, text: `12${t("piece")}` },
    "7": { x: 2, y: 4, text: `8${t("piece")}` },
    "8": { x: 3, y: 4, text: `12${t("piece")}` },
    "9": { x: 4, y: 4, text: `16${t("piece")}` },
  };

  const resetCustom = () => {
    setCustomX(0);
    setCustomY(0);
    setRadioGroupValue("");
  };

  const filesChange = (info: UploadChangeParam<FileWithPreview>) => {
    const hasFile = fileList.find((file) => info.file.name === file.name);
    if (hasFile) {
      return;
    } else {
      setFileList([info.file]);
      const reader = new FileReader();
      if (info.file.originFileObj) {
        reader.readAsDataURL(info.file.originFileObj);
        reader.onload = function (e: ProgressEvent<FileReader>) {
          const result = e.target?.result;
          if (typeof result === "string") {
            setCurrentImg(result);
          }
        };
      }
      
    }
  };

  const handleDragOnStop = (data:DraggableData, key:string) => {
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

  const radioGroupOnChange = (e:any) => {
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

  const downloadSlice = (sliceData:FileBase64List) => {
    setLoadingState({
      loading: true,
      tip: `${t("saving")}...`
    })
    downloadFileBase64List(sliceData,() => {
      setLoadingState({
        loading: false,
        tip: ""
      })
      messageApi.open({
        type: 'success',
        content: t('picturesHaveBeenSaved'),
        duration: 5
      });
    })
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
    const yLines = draggableListData
      .filter((item) => item.axis === "y")
      .map((item) =>
        item.newPosition ? item.newPosition.y : item.defaultPosition.y
      )
      .map((item) => Math.round(item / scale))
      .concat(imageHeight)
      .sort((a, b) => a - b);
    const sliceList:FileBase64List = [];
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
        sliceList.push({
          name: `slice_${x}_${y}.png`,
          data: sliceData,
        });
      }
    }
    downloadSlice(sliceList);
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
          .map((item:any, index:number) => {
            const position = xUnitSize * (index + 1);
            return {
              axis: "x" as DraggableAxis,
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
                axis: "y" as DraggableAxis,
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
    <Spin spinning={loadingState.loading} tip={loadingState.tip}>
      <Row gutter={24}>
      <Col lg={8} xs={24}>
        <RadioGroup
          type="pureCard"
          direction="horizontal"
          name="demo-radio-group-pureCard"
          onChange={radioGroupOnChange}
          value={radioGroupValue}
        >
          <Row>
            {Object.keys(RadioGroupList).map((key) => {
              return (
                <Col span={8} key={key}>
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
          <Form.InputNumber field="yVal" label={t("customX")}/>
          <Form.InputNumber field="xVal" label={t("customY")} />
        </Form>
        <Space vertical style={{ width: "100%" }}>
          {fileList.length && customX > 0 && customY > 0 ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconSync />}
              onClick={resetCustom}
              type="dashed"
            >
              {t("reset")}
            </Button>
          ) : null}

          {fileList.length ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconAlignTop />}
              onClick={reUpload}
            >
              {t("reuploadImage")}
            </Button>
          ) : null}

          {fileList.length && customX > 0 && customY > 0 ? (
            <Button
              style={{ width: "100%" }}
              icon={<IconAlignBottom />}
              onClick={sliceImage}
              type="primary"
            >
              {t("download")}
            </Button>
          ) : null}
        </Space>
      </Col>
      <Col lg={16} xs={24}>
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
                      onStop={(_e, data: DraggableData) => {
                        handleDragOnStop(data, key);
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
            onChange={filesChange}
            fileList={fileList}
            customRequest={() => { }}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t("clickOrDrag")}</p>
          </Dragger>
        )}
      </Col>
    </Row>
    {contextHolder}
    </Spin>
    
  );
};

export default ImageSlicing;
