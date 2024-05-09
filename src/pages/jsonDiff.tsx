import { Button } from "@douyinfe/semi-ui";
import { Col, Input, Row, Space, message } from "antd";
import { Differ, Viewer } from "json-diff-kit";
import "json-diff-kit/dist/viewer.css";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

const { TextArea } = Input;

export default function JsonDiff() {
  const [data,setData] = useState('');
  const [newData,setNewData] = useState('');
  const [jsonData, setJsonData] = useState({});
  const [newJsonData, setNewJsonData] = useState({});
  const [diff, setDiff] = useState<any>([[], []]);

  const viewerProps = {
    detectCircular: true, // default `true`
    maxDepth: Infinity, // default `Infinity`
    showModifications: true, // default `true`
    arrayDiffMethod: "lcs",
    indent:4,
    lineNumbers: true,
    highlightInlineDiff: true,

  };

  useEffect(() => {
    const d = new Differ({
      detectCircular: true,
      maxDepth: 8,
      showModifications: true,
      arrayDiffMethod: "lcs",
      ignoreCase: false,
      ignoreCaseForKey: false,
      recursiveEqual: true,
    });
    const diff = d.diff(jsonData, newJsonData);
    setDiff(diff);
  }, [jsonData, newJsonData]);

  const handleJsonData = (e: any, type = "old") => {
    if (type === "old") {
      setData(e.target.value);
    }
    if (type === "new") {
      setNewData(e.target.value);
    }
    try {
      if (type === "old") {
        setJsonData(JSON.parse(e.target.value));
      }
      if (type === "new") {
        setNewJsonData(JSON.parse(e.target.value));
      }
    } catch {
      if (e.target.value) {
        message.error("请检查输入的JSON格式是否正确");
      }
    }
  };
  return (
    <div style={{height: `calc(100vh - 84px)`,overflow:"auto"}}>
       <Row gutter={[16, 16]} >
      <Col lg={10} xs={24}>
        <TextArea
          value={data}
          placeholder="请输入JSON"
          style={{ height: 500 }}
          onChange={(e) => handleJsonData(e)}
        />
      </Col>
      <Col lg={4} xs={24} style={{ textAlign: "center" }}>
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="22546"
          width="32"
          height="32"
        >
          <path
            d="M327.516 634.924c-6.597 21.343-10.548 42.65-11.853 61.454h-1.305c-1.305-18.803-5.257-38.876-10.548-60.219L187.853 207.185H63.993L248.46 813.04h129.116l185.807-605.856H443.473l-115.957 427.74z m602.187-91.58c-19.755-28.857-56.655-56.444-109.36-81.526-46.108-22.578-73.8-40.146-85.654-53.94-11.853-12.558-17.11-27.587-17.11-42.65 0-20.073 7.903-35.136 25.048-46.425s39.546-17.568 67.203-17.568c48.754 0 90.91 13.793 126.47 41.415V220.978c-35.56-15.063-79.057-22.577-131.761-22.577-63.253 0-113.312 15.063-151.517 46.425-38.206 31.362-56.656 75.247-56.656 131.69 0 76.518 42.157 135.466 125.165 175.612 52.704 25.082 85.653 45.155 98.812 58.949 13.194 13.793 18.45 30.092 18.45 46.425 0 18.803-7.902 35.101-23.706 46.425-15.805 12.559-39.511 18.803-69.85 18.803-55.35 0-104.104-20.073-147.566-60.219v129.187c39.546 22.577 89.605 33.866 151.517 33.866 67.204 0 118.603-15.063 155.503-46.425 36.9-30.092 55.35-75.247 55.35-132.961-0.034-40.11-10.582-75.212-30.338-102.834z m0 0"
            fill="#333333"
            p-id="22547"
          ></path>
        </svg>
        <div style={{ marginTop: 10 }}>
          <Space>
            <Button onClick={() => {
              setData('');
              setNewData('');
              setJsonData({});
              setNewJsonData({});
              setDiff([[], []]);
            }}>清空</Button>
          </Space>
        </div>
      </Col>
      <Col lg={10} xs={24}>
        <TextArea
          value={newData}
          placeholder="请输入需要对比的JSON"
          style={{ height: 500 }}
          onChange={(e) => handleJsonData(e, "new")}
        />
      </Col>
      <Col lg={24} xs={24} style={{ marginTop: 20 }}>
        {
          Object.keys(jsonData).length ?  <Viewer {...viewerProps} diff={diff} /> : null
        }
      </Col>
    </Row>
    </div>
   
  );
}
