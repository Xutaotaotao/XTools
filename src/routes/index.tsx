import { IconImage, IconIntro } from "@douyinfe/semi-icons-lab";
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout';
import Home from "../pages/home";
import ImageSlicing from "../pages/imageSlicing";


 export const menu = [
  {
    itemKey: "/",
    text: "首页",
    icon: <IconIntro />,
    element: <Home />
  },
  {
    itemKey: "/imageSlicing",
    text: "图片分割",
    icon: <IconImage />,
    des:'将图片切割成多张小图片',
    element: <ImageSlicing />
  },
]

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {
          menu.map((item, index) => (
            <Route key={index} path={item.itemKey} element={item.element} />
          ))
        }
      </Route>
    </Routes>
  )
}

export default Router;