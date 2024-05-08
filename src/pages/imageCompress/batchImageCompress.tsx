import { InboxOutlined } from "@ant-design/icons";
import { IconAlignBottom } from "@douyinfe/semi-icons";
import { Button, Form, Image, Table } from "@douyinfe/semi-ui";
import { Col, Row, Space, Upload,Spin, message } from "antd";
import Compressor from "compressorjs";
import { useRef, useState } from "react";

const { Dragger } = Upload;

export default function BatchImageCompress() {
  const api = useRef<any>();
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [spinningStatus, setSpinningStatus] = useState({
    spinning: false,
    tip: "",
  })

  const filesChange = (info: any) => {
    const { fileList } = info;
    setSpinningStatus({
      spinning: true,
      tip: "选取图片中，请稍后..."
    })
    const updatedFileList = fileList.map((file: any) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          const fileUrl = reader.result;
          file.url = fileUrl;
          resolve(file);
        };
        reader.readAsDataURL(file.originFileObj);
      });
    });
    Promise.all(updatedFileList).then((files) => {
      setFileList(files);
    }).finally(() => {
      setSpinningStatus({
        spinning: false,
        tip: "",
      })
    })
  };

  const downLoad = (record: any) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(record.compressedFile); // 创建对象超链接
    a.download = `${record.name}.jpg`; // 下载后文件名
    a.click();
  };

  const columns = [
    {
      title: "标题",
      dataIndex: "name",
      render: (text: string, record: any, index: number) => {
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
      render: (text: number) => {
        return text ? `${(text / 1024).toFixed(2)}KB` : "-";
      },
    },
    {
      title: "压缩率",
      dataIndex: "compressRate",
      render: (text: number, record: any) => {
        const compressRate = (record.compressedSize / record.size) * 100;
        return record.compressedSize ? `${compressRate.toFixed(2)}%` : "-";
      },
    },
    {
      title: "压缩后图片",
      dataIndex: "compressRate",
      render: (text: string, record: any, index: number) => {
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
      render: (_text: any, record: any) => {
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
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRows(selectedRows);
    },
  };

  const startCompress = () => {
    setSpinningStatus({
      spinning: true,
      tip: "压缩中，请稍后..."
    })
    const compressingPromise = fileList.map((file: any) => {
      return new Promise((resolve) => {
        new Compressor(file.originFileObj, {
          quality: api.current.getValue("quality") || 0.6,
          success: (result) => {
            file.compressedFile = result;
            file.compressedSize = result.size;
            let reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = function (e: any) {
              resolve({ ...file, compressedUrl: e.target.result });
            };
          },
          error: (err) => {
            console.log(err.message);
          },
        });
      });
    });
    Promise.all(compressingPromise).then((result) => {
      setFileList(result);
      message.success("压缩成功");
    }).finally(() => {
      setSpinningStatus({
        spinning: false,
        tip: "",
      })
    })
  };

  return (
    <div style={{ height: "calc(100vh - 170px)" }}>
       <Spin spinning={spinningStatus.spinning} tip={spinningStatus.tip} style={{ width: "100%",height: "100%" }}>
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
                      <Button onClick={() => setFileList([])}>重新上传图片</Button>
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
                  style={{ marginTop: 16 }}
                  columns={columns}
                  dataSource={fileList}
                  pagination={false}
                  // rowSelection={rowSelection}
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
