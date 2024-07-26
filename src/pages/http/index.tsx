import { useState } from "react"
import { Button, Card } from "@douyinfe/semi-ui"
import http from "@/http"


const Http = () => {

  const [getResponse, setGetResponse] = useState<string>('')
  const [postResponse,setPostResponse] = useState<string>('')
  const getFetchTest = () => {
    http.get("/posts/2").then(res => {
      setGetResponse(JSON.stringify(res))
    })
  }

  const postFetchTest = () => {
    http.post("/posts",{
      "id":1,
      "title":"foo",
      "body":"bar",
    }).then(res => {
      setPostResponse(JSON.stringify(res))
    })
  }

  return (
    <div>
      <Button onClick={getFetchTest}>发起Get请求测试</Button>
      <Card title="Get请求测试返回数据" style={{marginTop:10}}>
        {getResponse}
      </Card>
      <div style={{marginTop:20}}>
        <Button onClick={postFetchTest}>发起Post请求测试</Button>
        <Card title="Post请求测试返回数据" style={{marginTop:10}}>
          {postResponse}
        </Card>
      </div>
      
    </div>
  )
}

export default Http