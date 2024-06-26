import { Button, Col,Space, Row } from "antd";
import { Typography } from '@douyinfe/semi-ui';
import { history } from "umi";
import bigLogo from "@/assets/img/biglogo1.svg";
import "./index.scss";
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
      <Row justify="center" align="middle" gutter={[20, 20]} style={{height:'100%'}}>
        <Col xs={22} lg={10}>
          <Title >专注工具，助力高效</Title>
          <Title heading={5} style={{ marginTop: 20 }} >完全本地化工具，无需云端，不担心隐私泄露</Title>
          <Space style={{ marginTop: 20 }}>
          <Button onClick={goHome} type="primary" size="large" style={{ margin: '8px 0' }}>开始使用</Button>
          <Button onClick={goGithub} size="large" style={{ margin: '8px 0' }}>Github</Button>
          </Space>
        </Col>
        <Col xs={22} lg={10}>
          <img style={{ width: '90%' }} src={bigLogo} alt="logo" />
        </Col>
      </Row>
    </div>
  );
}
