import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, Image } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import type { UploadFile, UploadProps } from "antd";
import { Card, Col, Row, Upload } from "antd";
import Compressor from "compressorjs";
import { useRef, useState } from "react";

const { Dragger } = Upload;

interface CompressorOptions {
  strict?: boolean;
  checkOrientation?: boolean;
  retainExif?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  resize?: "none" | "cover" | "contain";
  quality?: number;
}

export default function ImageCompress() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [compressingImg, setCompressingImg] = useState<string>("");
  const [file, setFile] = useState<UploadFile>();
  const [compressingFile, setCompressingFile] = useState<any>();
  const api = useRef<FormApi>();

  const filesChange: UploadProps["onChange"] = (info) => {
    setFile(info.file);
    let reader = new FileReader();
    if (info.file.originFileObj) {
      reader.readAsDataURL(info.file.originFileObj);
      reader.onload = function (e: any) {
        setCurrentImg(e.target.result);
      };
      const options = api?.current?.getValues();
      new Compressor(info.file.originFileObj, {
        ...options,
        success: (result) => {
          setCompressingFile(result);
          let reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = function (e: any) {
            setCompressingImg(e.target.result);
          };
        },
      });
    }
  };

  const formOnValueChange = (value: CompressorOptions) => {
    if (file && file.originFileObj) {
      new Compressor(file.originFileObj, {
        ...value,
        success: (result) => {
          setCompressingFile(result);
          let reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = function (e: any) {
            setCompressingImg(e.target.result);
          };
        },
      });
    }
  };

  const downLoadCompressing = () => {
    if (compressingFile) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(compressingFile);
      a.download = `${compressingFile?.name}.jpg`
      a.click();
    }
  };

  const resetImg = () => {
    setFileList([]);
    setCurrentImg("");
    setCompressingImg("");
    setFile(undefined);
  };

  return (
    <Row gutter={[16, 16]} style={{overflow:'auto',height: "calc(100vh - 100px"}}>
      <Col lg={6} xs={24}>
        <Card
          title="设置"
          styles={{ body: { height: "calc(100vh - 200px", overflow: "auto" } }}
        >
          <Form
            getFormApi={(formApi) => (api.current = formApi)}
            labelPosition="left"
            onValueChange={formOnValueChange}
          >
            <Form.Checkbox field="strict" label="严格模式"></Form.Checkbox>
            <Form.Checkbox
              field="checkOrientation"
              label="检查方向"
            ></Form.Checkbox>
            <Form.Checkbox
              field="retainExif"
              label="保留EXIF信息"
            ></Form.Checkbox>
            <Form.InputNumber
              field="maxWidth"
              label="最大宽度"
            ></Form.InputNumber>
            <Form.InputNumber
              field="maxHeight"
              label="最大高度"
            ></Form.InputNumber>
            <Form.InputNumber
              field="minWidth"
              label="最小宽度"
            ></Form.InputNumber>
            <Form.InputNumber
              field="minHeight"
              label="最小高度"
            ></Form.InputNumber>
            <Form.InputNumber field="width" label="宽度"></Form.InputNumber>
            <Form.InputNumber field="height" label="高度"></Form.InputNumber>
            <Form.Select
              field="resize"
              label="缩放模式"
              style={{ width: "100%" }}
            >
              <Form.Select.Option value="none">自动</Form.Select.Option>
              <Form.Select.Option value="cover">覆盖</Form.Select.Option>
              <Form.Select.Option value="contain">包含</Form.Select.Option>
            </Form.Select>
            <Form.InputNumber
              min={0}
              max={1}
              field="quality"
              label="压缩质量(仅支持jpg)"
            ></Form.InputNumber>
          </Form>
        </Card>
      </Col>
      <Col lg={18} xs={24}>
        {currentImg ? (
          <div style={{ height: "calc(100vh - 170px)", overflow: "auto" }}>
            <Card
              title={`原图 【大小】：${(file?.size || 0) / 1024}KB`}
              styles={{ body: { textAlign: "center" } }}
              extra={
                <Button theme="solid" type="primary" onClick={resetImg}>
                  重新上传图片
                </Button>
              }
            >
              <Image height={350} src={currentImg} alt="preview" />
            </Card>
            <Card
              title={`压缩后图片 【大小】：${
                (compressingFile?.size || 0) / 1024
              }KB`}
              style={{ marginTop: "16px" }}
              styles={{ body: { textAlign: "center" } }}
              extra={
                <Button
                  theme="solid"
                  type="primary"
                  onClick={downLoadCompressing}
                >
                  下载
                </Button>
              }
            >
              <Image height={350} src={compressingImg} alt="preview" />
            </Card>
          </div>
        ) : (
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
            <p className="ant-upload-text">点击或拖拽上传图片</p>
          </Dragger>
        )}
      </Col>
    </Row>
  );
}
