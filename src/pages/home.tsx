import { Card, Typography } from "@douyinfe/semi-ui";
import { Col, Row } from "antd";
import React from "react";
import { history } from "umi";
import { NavMap } from "../layouts/index";

const { Title,Text } = Typography;

const SIZE = "30px";

const Home = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {NavMap.filter((item) => item.itemKey !== "/home").map(
          (item, index) => (
            <Col
              key={item.itemKey}
              span={6}
              onClick={() => {
                history.push(item.itemKey);
              }}
            >
              <Card
                title={
                  <Title
                    heading={4}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {React.cloneElement(item.icon, {
                      style: {
                        fontSize: SIZE,
                        height: SIZE,
                        width: SIZE,
                        marginRight: "8px",
                      },
                    })}
                    {item.text}
                  </Title>
                }
                style={{ height: "100%" }}
                bodyStyle={{ height: "100%" }}
                shadows="hover"
              >
                <Text>{item.des}</Text>
              </Card>
            </Col>
          )
        )}
      </Row>
    </div>
  );
};

export default Home;
