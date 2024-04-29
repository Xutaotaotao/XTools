import { Button, Col,Space, Row } from "antd";
import { Typography } from '@douyinfe/semi-ui';
import { history } from "umi";
import "./index.scss";
import bigLogo from "@/assets/img/bigLogo.svg";
const { Title } = Typography;


export default function AppPage() {

  const goHome = () => {
    history.push('/home')
  }

  const goGithub = () => {
    window.open('https://github.com/xutaotaotao/XTools')
  }

  return (
    <div className="home-container">
      <Row style={{width: '100%',padding:"0 200px"}}>
        <Col span={12} style={{ display: 'flex', justifyContent: 'center',flexDirection: 'column' }}>
          <Title >专注工具，助力高效</Title>
          <Title heading={5} style={{ marginTop: 20 }} >完全本地化工具，无需云端，轻松实现跨平台工作效率</Title>
          <Space style={{ marginTop: 20 }}>
          <Button onClick={goHome} type="primary" size="large" style={{ margin: '8px 0' }}>开始使用</Button>
          <Button onClick={goGithub} size="large" style={{ margin: '8px 0' }}>Github</Button>
          </Space>
        </Col>
        <Col span={12} style={{textAlign: 'center' }}>
          <img style={{ width: '90%' }} src={bigLogo} alt="logo" />
        </Col>
      </Row>
    </div>
  );
}
