import { useState } from "react";
import { Col, Row, message } from "antd"
import { Input } from 'antd';
import ReactJson from 'react-json-view'
import './index.scss'
import { BODY_HEIGHT } from "@/utils/const";

const { TextArea } = Input;

const JsonFormatting = () => {
  const [jsonData, setJsonData] = useState({});

  const handleJsonData = (e:any) => {
    try {
      setJsonData(JSON.parse(e.target.value))
    } catch {
      message.error('请检查输入的JSON格式是否正确')
    }
  }

  return <Row gutter={[16, 16]}>
    <Col lg={10} xs={24}>
      <TextArea style={{height:BODY_HEIGHT}} placeholder="请输入想要格式化的数据" onChange={(e) => handleJsonData(e)}/>
    </Col>
    <Col lg={14} xs={24}>
      <div className="json-input">
        <ReactJson src={jsonData} theme={"monokai"}/>
      </div>
    </Col>
  </Row>
}

export default JsonFormatting