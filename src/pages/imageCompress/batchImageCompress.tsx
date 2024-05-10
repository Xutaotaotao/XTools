import { InboxOutlined } from "@ant-design/icons";
import { IconAlignBottom } from "@douyinfe/semi-icons";
import { Button, Form, Image } from "@douyinfe/semi-ui";
import { Col, Row, Space, Spin, Table, Upload, message } from "antd";
import Compressor from "compressorjs";
import { useRef, useState } from "react";
import { UploadFile, UploadProps } from "antd/lib/upload/interface";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";

const { Dragger } = Upload;

interface FileWithPreview extends UploadFile {
 url?: string;
 compressedFile?: Blob;
 compressedSize?: number;
 compressedUrl?: string;
}

export default function BatchImageCompress() {
 const api = useRef<FormApi | null>(null);
 const [fileList, setFileList] = useState<FileWithPreview[]>([]);
 const [selectedRows, setSelectedRows] = useState<FileWithPreview[]>([]);
 const [spinningStatus, setSpinningStatus] = useState<{
   spinning: boolean;
   tip: string;
 }>({
   spinning: false,
   tip: "",
 });

 const filesChange = (info: UploadProps) => {
   const { fileList = [] } = info;
   setSpinningStatus({
     spinning: true,
     tip: "选取图片中，请稍后...",
   });
   const updatedFileList = fileList.map((file: FileWithPreview) => {
     const reader = new FileReader();
     return new Promise<FileWithPreview>((resolve) => {
       reader.onload = () => {
         const fileUrl = reader.result as string;
         const fileWithPreview: FileWithPreview = {
           ...file,
           url: fileUrl,
         };
         resolve(fileWithPreview);
       };
       reader.readAsDataURL(file.originFileObj!);
     });
   });
   Promise.all(updatedFileList)
     .then((files) => {
       setFileList(files);
     })
     .finally(() => {
       setSpinningStatus({
         spinning: false,
         tip: "",
       });
     });
 };

 const downLoad = (record: FileWithPreview) => {
   const a = document.createElement("a");
   a.href = URL.createObjectURL(record.compressedFile!); // 创建对象超链接
   a.download = `${record.name}.jpg`; // 下载后文件名
   a.click();
 };

 const columns = [
   {
     title: "标题",
     dataIndex: "name",
     width: 300,
     render: (text: string, record: FileWithPreview, index: number) => {
       return (
         <div>
           <Image
             height={80}
             width={80}
             src={record.url}
             style={{ marginRight: 12 }}
             imgStyle={{ objectFit: "cover" }}
           ></Image>
           {text}
         </div>
       );
     },
   },
   {
     title: "原始大小",
     dataIndex: "size",
     render: (text: number) => {
       return `${(text / 1024).toFixed(2)}KB`;
     },
   },
   {
     title: "压缩后大小",
     dataIndex: "compressedSize",
     render: (text: number | undefined) => {
       return text ? `${(text / 1024).toFixed(2)}KB` : "-";
     },
   },
   {
     title: "压缩率",
     dataIndex: "compressRate",
     render: (text: number | undefined, record: FileWithPreview) => {
       const compressRate = (record.compressedSize! / (record.size || 1)) * 100;
       return record.compressedSize ? `${compressRate.toFixed(2)}%` : "-";
     },
   },
   {
     title: "压缩后图片",
     width: 200,
     dataIndex: "compressRate",
     render: (text: string | undefined, record: FileWithPreview, index: number) => {
       return (
         <div>
           <Image
             height={80}
             width={80}
             src={record.compressedUrl}
             style={{ marginRight: 12 }}
             imgStyle={{ objectFit: "cover" }}
           ></Image>
         </div>
       );
     },
   },
   {
     title: "操作",
     dataIndex: "operation",
     render: (_text: any, record: FileWithPreview) => {
       return (
         <Button
           disabled={!record.compressedSize}
           icon={<IconAlignBottom />}
           theme="borderless"
           onClick={() => downLoad(record)}
         />
       );
     },
   },
 ];

 const rowSelection = {
   onChange: (selectedRowKeys: React.Key[], selectedRows: FileWithPreview[]) => {
     setSelectedRows(selectedRows);
   },
 };

 const startCompress = () => {
   setSpinningStatus({
     spinning: true,
     tip: "压缩中，请稍后...",
   });
   const compressingPromise = fileList.map((file: FileWithPreview) => {
     return new Promise<FileWithPreview>((resolve) => {
       new Compressor(file.originFileObj!, {
         quality: api.current?.getValue("quality") || 0.6,
         success: (result) => {
           file.compressedFile = result;
           file.compressedSize = result.size;
           let reader = new FileReader();
           reader.readAsDataURL(result);
           reader.onload = function (e: ProgressEvent<FileReader>) {
             resolve({ ...file, compressedUrl: e.target?.result as string });
           };
         },
         error: (err) => {
           console.log(err.message);
         },
       });
     });
   });
   Promise.all(compressingPromise)
     .then((result) => {
       setFileList(result);
       message.success("压缩成功");
     })
     .finally(() => {
       setSpinningStatus({
         spinning: false,
         tip: "",
       });
     });
 };

  return (
    <div style={{ height: "calc(100vh - 170px)",width: "100%" }}>
      <Spin
        spinning={spinningStatus.spinning}
        tip={spinningStatus.tip}
        style={{ width: "100%", height: "100%" }}
      >
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          {fileList.length > 0 ? (
            <div style={{ height: "100%", width: "100%", padding: "16px" }}>
              <Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
                <Col span={12}>
                  <Form
                    getFormApi={(formApi) => (api.current = formApi)}
                    labelPosition="left"
                    initValues={{ quality: 0.6 }}
                  >
                    <Form.InputNumber
                      min={0}
                      max={1}
                      field="quality"
                      label="压缩质量"
                      defaultValue={0.6}
                    ></Form.InputNumber>
                  </Form>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Space>
                    <Button onClick={() => setFileList([])}>
                      重新上传图片
                    </Button>
                    <Button
                      theme="solid"
                      type="primary"
                      onClick={startCompress}
                    >
                      开始压缩
                    </Button>
                  </Space>
                </Col>
              </Row>
                <Table
                  rowKey={"name"}
                  columns={columns}
                  dataSource={fileList}
                  pagination={false}
                  scroll={{y: 'calc(100vh - 300px)'}}
                />
            </div>
          ) : (
            <Col span={24} style={{ height: "40vh" }}>
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
            </Col>
          )}
        </Row>
      </Spin>
    </div>
  );
}
