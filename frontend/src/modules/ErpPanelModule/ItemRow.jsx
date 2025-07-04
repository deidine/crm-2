import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Row, Col, Tooltip } from 'antd';
import { DeleteOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMoney } from '@/settings';
import calculate from '@/utils/calculate';
import AutoCompleteAsyncObject from '@/components/AutoCompleteAsyncObject';
 
export default function ItemRow({ field, remove, current = null }) {
  const [totalState, setTotal] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const money = useMoney();

  // Correct Redux state paths based on your structure
  const updateQt = (value) => {
    setQuantity(value);
  };

  const updatePrice = (value) => {
    setPrice(value);
  };

  // Handle product selection - receives product ID from AutoCompleteAsync
  const handleProductSelect = (productId, option) => {
    console.log('Selected product ID:', productId);
    console.log('Option data:', option);
    if (option) { 

      console.log('Dispatching crud.read with:', { entity: 'product', id: productId });

       updatePrice(option[0]["costPrice"])
    
    } else {
      // Reset if no product selected 
       updatePrice(0)
    }
  };

 
  useEffect(() => {
    if (current) {
      const { items, invoice } = current;
      if (invoice) {
        const item = invoice[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
         }
      } else {
        const item = items[field.fieldKey];
        if (item) {
          setQuantity(item.quantity);
          setPrice(item.price);
         }
      }
    }
  }, [current]);
  const calculTotale = () => {
    const currentTotal = calculate.multiply(price, quantity);
    setTotal(currentTotal);
  };
  useEffect(() => {
    calculTotale();
  }, [price, quantity]);

  return (
    <Row gutter={[12, 12]} style={{ position: 'relative' }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, 'itemName']}
          rules={[
            {
              required: true,
              message: 'Missing product selection',
            },
          ]}
        >
          <AutoCompleteAsyncObject
            entity={'product'}
            withRedirect
            displayLabels={['name']}
            searchFields={'name'}
            redirectLabel={'Add New Product'}
            urlToRedirect={'/product'}
            onChange={handleProductSelect}
            // placeholder="Select Product"
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, 'description']}>
          <Input placeholder="Description (auto-filled from product)" />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, 'quantity']} rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} onChange={updateQt} />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, 'price']} rules={[{ required: true }]}>
          <Tooltip title={'Select a product to load price automatically'} placement="top">          
            <InputNumber
              className="moneyInput"
              value={price}
              readOnly={true}
              disabled={true}
              onChange={updatePrice}
              min={0}
              controls={false}
              addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
              addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
              placeholder={'Select product first'}
            />
          </Tooltip>
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, 'total']}>
          <input type="hidden" readOnly value={totalState}  />
          <InputNumber
            readOnly
            className="moneyInput"
            value={totalState}
            min={0}
            controls={false}
            addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
            formatter={(value) =>
              money.amountFormatter({ amount: value, currency_code: money.currency_code })
            }
          />
        </Form.Item>
      </Col>

      <div style={{ position: 'absolute', right: '-20px', top: ' 5px' }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  );
}
