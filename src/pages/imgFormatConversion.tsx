import { useState } from "react";
import heic2any from "heic2any";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Radio, RadioGroup, Typography } from "@douyinfe/semi-ui";
import { Image as AImage, Card, Col, Row, Spin, Upload, UploadFile } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { getFileExtension } from "@/utils";
import { BODY_HEIGHT } from "@/utils/const";


interface FileWithPreview extends UploadFile {
  preview?: string;
}

const { Dragger } = Upload;

const { Text } = Typography;

const FORMATS = ["jpg", "jpeg", "png","webp"];

export default function imgFormatConversion() {
  const [fileList, setFileList] = useState<FileWithPreview[]>([]);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [spinning, setSpinning] = useState<boolean>(false);

  const filesChange = async (info: UploadChangeParam<FileWithPreview>) => {
    setSpinning(true)
    const newFile: FileWithPreview = {
      ...info.file,
      preview: "",
    };
    setFileList([newFile]);
    if (info.file.originFileObj) {
      if(getFileExtension(newFile.name) === "heic") {
        try {
          const convertedBlob = await heic2any({
            blob: info.file.originFileObj,
            toType: "image/jpeg",
            quality: 1,
          });
          const convertedImageUrl = URL.createObjectURL(convertedBlob as Blob);
          setCurrentImg(convertedImageUrl);
          newFile.preview = convertedImageUrl; // 更新文件预览
        } catch (error) {
          console.error(error);
        }
      } else{
        let reader = new FileReader();
        reader.readAsDataURL(info.file.originFileObj);
        reader.onload = async function (e: any) {
          setCurrentImg(e.target.result);
        };
      }
    }
    setSpinning(false)
  };

  const onChange = (e: any) => {
    console.log("radio checked", e.target.value);
    setFormat(e.target.value);
  };

  const downloadImg = () => {
    if (currentImg && format) {
      if (fileList[0].name.includes("svg")) {
        downloadImageByCanvas(currentImg, fileList[0].name, format);
      } else {
          const a = document.createElement("a");
          a.href = currentImg;
          a.download = `${fileList[0].name}converted.${format}`;
          a.click();
        }
      }
  };

  const downloadImageByCanvas = (
    base64Data: string,
    fileName: string,
    fileType: string
  ) => {
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    const img: any = new Image();
    img.src = base64Data;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const linkSource = canvas.toDataURL(`image/${fileType}`);
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = `${fileName}converted.${fileType}`;
      downloadLink.click();
    };
  };

  return (
    <div>
      <Row gutter={16}>
        <Col lg={12} xs={24}>
          <Card
            title="图片上传"
            styles={{
              body: { height: BODY_HEIGHT, overflow: "auto" },
            }}
            extra={
              currentImg ? (
                <Button
                  type="primary"
                  onClick={() => {
                    setFileList([]);
                    setCurrentImg("");
                  }}
                >
                  重新上传图片
                </Button>
              ) : null
            }
          >
            {currentImg ? (
              <AImage src={currentImg} />
            ) : (
              <Spin spinning={spinning} tip="选取图片中...">
                <Dragger
                name="file"
                onChange={filesChange}
                fileList={fileList}
                customRequest={() => {}}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽上传图片,支持jpg、jpeg、png、heic、svg、webp格式</p>
              </Dragger>
              </Spin>
              
            )}
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card
            title="操作"
            styles={{
              body: { height: BODY_HEIGHT, overflow: "auto" },
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text>选择要转换成的图片格式</Text>
            </div>
            <RadioGroup
              onChange={onChange}
              value={format}
              aria-label="单选组合示例"
              name="demo-radio-group"
            >
              {FORMATS.map((format) => (
                <Radio value={format} key={format}>
                  {format}
                </Radio>
              ))}
            </RadioGroup>
            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                theme="solid"
                onClick={downloadImg}
                disabled={!currentImg || !format}
              >
                转换并下载
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
