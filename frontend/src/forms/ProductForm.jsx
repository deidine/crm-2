import { Form, Input, InputNumber, Select, Upload, Switch, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { useMoney, useDate } from '@/settings';
import SelectAsync from '@/components/SelectAsync';

export default function ProductForm({ current = null }) {
  const translate = useLanguage();
  const money = useMoney();
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
        label={translate('Category')}
        name="category"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <SelectAsync 
          entity="category"
          displayLabels={['name']}
          searchFields="name"
          outputValue="_id"
          placeholder={translate('Select category')}
        />
      </Form.Item>

      <Form.Item
        label={translate('SKU')}
        name="sku"
        rules={[
          {
            required: true,
          },
          {
            pattern: /^[A-Za-z0-9-]+$/,
            message: translate('SKU can only contain letters, numbers and hyphens'),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Barcode')}
        name="barcode"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Quantity')}
        name="quantity"
        initialValue={0}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label={translate('Minimum Quantity')}
        name="minQuantity"
        initialValue={0}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label={translate('Maximum Quantity')}
        name="maxQuantity"
        initialValue={0}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label={translate('Unit Price')}
        name="unitPrice"
        rules={[
          {
            required: true,
          },
        ]}
      >
       <InputNumber
                className="moneyInput"
                min={0}
                controls={false} 
                addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
                addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
              />
      </Form.Item>

      <Form.Item
        label={translate('Cost Price')}
        name="costPrice"
        rules={[
          {
            required: true,
          },
        ]}
      >
       <InputNumber
                className="moneyInput"
                min={0}
                controls={false} 
                addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
                addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
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
        label={translate('Status')}
        name="status"
        initialValue="in_stock"
      >
        <Select
          options={[
            { value: 'in_stock', label: translate('In Stock') },
            { value: 'out_of_stock', label: translate('Out of Stock') },
            { value: 'low_stock', label: translate('Low Stock') },
            { value: 'discontinued', label: translate('Discontinued') },
          ]}
        />
      </Form.Item>

      <Form.Item
        label={translate('Location')}
        name="location"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Supplier')}
        name="supplier"
      >
        <SelectAsync 
          entity="client"
          displayLabels={['name']}
          searchFields="name"
          outputValue="_id"
          placeholder={translate('Select supplier')}
        />
      </Form.Item>

      <Form.Item
        label={translate('Tags')}
        name="tags"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder={translate('Add tags')}
          options={[]}
        />
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
