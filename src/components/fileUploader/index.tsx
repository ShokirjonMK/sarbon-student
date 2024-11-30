import { Dispatch } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { AttachFilled } from '@fluentui/react-icons';
import { t } from 'i18next';

const props: UploadProps = {
  name: 'file',
  maxCount: 1,
  customRequest: ({onSuccess}: any)=> {onSuccess("ok")},
  // headers: {
  //   authorization: 'authorization-text',
  // },
  
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      info.file.status = 'done';
      message.error(`${info.file.name} file upload failed.`);
    }
  },

};

const FileUploader = ({passportFile, setPassportFile, title = "Click to Upload"}: {passportFile: UploadFile[], setPassportFile: Dispatch<UploadFile[]>, title: string}) => (

  <Upload {...props} fileList={passportFile} onChange={(e) => setPassportFile([{...e.fileList[0], status: "done"}])} >
    <Button icon={<AttachFilled className='text-[18px] mr-2' />} className='items-center flex'>{t(title)}</Button>
  </Upload>

);

export default FileUploader;