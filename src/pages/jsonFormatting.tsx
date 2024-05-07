import { useState } from "react";
import { Col, Row, message } from "antd"
import { Input } from 'antd';
import ReactJson from 'react-json-view'
import './index.scss'

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
    <Col span={10}>
      <TextArea placeholder="请输入想要格式化的数据" className="json-input" onChange={(e) => handleJsonData(e)}/>
    </Col>
    <Col span={14}>
      <div className="json-input">
        <ReactJson src={jsonData} theme={"monokai"}/>
      </div>
    </Col>
  </Row>
}

export default JsonFormatting