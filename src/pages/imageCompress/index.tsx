import { Tabs, TabPane } from '@douyinfe/semi-ui';
import SingleImageCompress from './singleImageCompress';
import BatchImageCompress from './batchImageCompress';

export default function ImageCompress() {
  return <div>
     <Tabs type="line">
       <TabPane tab="单个图片压缩" itemKey="1">
        <SingleImageCompress/>
       </TabPane>
       <TabPane tab="JPG批量压缩" itemKey="2">
        <BatchImageCompress />
       </TabPane>
     </Tabs>
  </div>;
}