import { Routes, Route } from 'react-router-dom';
import Layout from '@/layout';
import Home from "@/pages/home";
import ImageSlicing from "@/pages/imageSlicing";


 export const menu = [
  {
    itemKey: "/",
    element: <Home />
  },
  {
    itemKey: "/imageSlicing",
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