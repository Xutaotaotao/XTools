import { InboxOutlined } from "@ant-design/icons";
import { Card, Col, Image, Row, Spin, Upload } from "antd";
import { Button } from "@douyinfe/semi-ui";
import { useState } from "react";
import { createWorker } from "tesseract.js";

const { Dragger } = Upload;

export default function ImgScan() {
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [currentImg, setCurrentImg] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [spinning, setSpinning] = useState(false);

  const filesChange = (info: any) => {
    setFileList([info.file]);
    let reader = new FileReader();
    setSpinning(true);
    reader.readAsDataURL(info.file.originFileObj);
    reader.onload = async function (e: any) {
      setCurrentImg(e.target.result);
      const worker: any = await createWorker("chi_sim+eng");
      worker
        .recognize(e.target.result)
        .then((result: any) => {
          const extractedText = result.data.text;
          setExtractedText(extractedText);
          console.log("Extracted Text:", extractedText);
        })
        .catch((error: Error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          if (worker) worker.terminate();
          setSpinning(false);
        });
    };
  };

  return (
    <div>
      <Row gutter={16}>
        <Col lg={12} xs={24}>
          <Card
            title="图片上传"
            styles={{
              body: { height: `calc(100vh - 150px)`, overflow: "auto" },
            }}
            extra={currentImg ? <Button type="primary" onClick={() => {
              setFileList([]);
              setCurrentImg("");
              setExtractedText("");
            }}>重新上传图片</Button> : null}
          >
            {currentImg ? (
              <Image src={currentImg} />
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
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card
            title="识别结果"
            styles={{
              body: { height: `calc(100vh - 150px)`, overflow: "auto" },
            }}
          >
            <Spin spinning={spinning} tip="正在识别中...">
              <pre>{extractedText}</pre>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
