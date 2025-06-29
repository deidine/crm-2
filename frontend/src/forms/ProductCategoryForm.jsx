import { Form, Input, Upload, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import SelectAsync from '@/components/SelectAsync';

export default function ProductCategoryForm() {
  const translate = useLanguage();

  const uploadProps = {
    maxCount: 1,
    multiple: false,
    listType: "picture-card",
    accept: 'image/*',
    beforeUpload: (file) => {
      // Return false to prevent automatic upload
      return false;
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          {
            required: true,
          },
          {
            pattern: /^[a-zA-Z0-9\s-]+$/,
            message: translate('Name can only contain letters, numbers, spaces and hyphens'),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Description')}
        name="description"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={translate('Parent Category')}
        name="parent"
      >
        <SelectAsync 
          entity="category"
          displayLabels={['name']}
          searchFields="name"
          outputValue="_id"
          placeholder={translate('Select parent category')}
        />
      </Form.Item>

      <Form.Item
        label={translate('Photo')}
        name="photo"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList;
        }}
      >
        <Upload {...uploadProps}>
          {uploadButton}
        </Upload>
      </Form.Item>

      <Form.Item
        label={translate('Enabled')}
        name="enabled"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch />
      </Form.Item>
    </>
  );
}
