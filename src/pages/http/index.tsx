import { useState } from "react"
import { Button, Card } from "@douyinfe/semi-ui"
import http from "@/http"
import { useTranslation } from "react-i18next";


const Http = () => {
  const { t } = useTranslation();

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
      <Button onClick={getFetchTest}>{t('Initiate Get request test')}</Button>
      <Card title={t('Get request test returns data')} style={{marginTop:10}}>
        {getResponse}
      </Card>
      <div style={{marginTop:20}}>
        <Button onClick={postFetchTest}>{t('Initiate Post request test')}</Button>
        <Card title={t('Post request test returns data')} style={{marginTop:10}}>
          {postResponse}
        </Card>
      </div>
      
    </div>
  )
}

export default Http