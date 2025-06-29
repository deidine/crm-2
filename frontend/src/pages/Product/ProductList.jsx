import { useState, useEffect } from 'react';
import { Button, Tag, Modal, InputNumber, Alert } from 'antd';
import { PlusOutlined, WarningOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import CrudModule from '@/modules/CrudModule/CrudModule';
import { ErpLayout } from '@/layout';
import ProductForm from '@/forms/ProductForm';
import { request } from '@/request';
import { useMoney } from '@/settings';

export default function ProductList() {
  const translate = useLanguage();
  const money = useMoney();
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockAction, setStockAction] = useState('add');
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
  const entity = 'product';

  useEffect(() => {
    // loadLowStockProducts();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { result } = await request.get({ entity: entity + '/list' });
    console.log(result); // Replace with state update logic
  };

  const createProduct = async (productData) => {
    await request.post({
      entity: entity + '/create',
      jsonData: productData,
    });
    fetchProducts(); // Refresh product list after creation
  };

  // const loadLowStockProducts = async () => {
  //   const { result } = await request.get({ entity: entity + '/low-stock' });
  //   setLowStockProducts(result);
  // };

  const updateStock = async () => {
    await request.patch({
      entity: entity + '/update-stock/' + selectedProduct._id,
      jsonData: { quantity: stockQuantity, type: stockAction }
    });
    setIsStockModalVisible(false);
    setSelectedProduct(null);
    setStockQuantity(0);
    // loadLowStockProducts();
  };

 
  const Labels = {
    PANEL_TITLE: translate('product'),
    DATATABLE_TITLE: translate('product_list'),
    ADD_NEW_ENTITY: translate('add_new_product'),
    ENTITY_NAME: translate('product'),
  };

  const searchConfig = {
    displayLabels: ['name', 'sku'],
    searchFields: 'name,sku,description',
  };

  const deleteModalLabels = ['name', 'sku'];

  const configPage = {
    entity,
    ...Labels,
    apiEndpoint: `${entity}/list`,
    readColumns: [
      { title: translate('Name'), dataIndex: 'name', key: 'name' },
      { title: translate('SKU'), dataIndex: 'sku', key: 'sku' },
      { title: translate('Description'), dataIndex: 'description', key: 'description' },
      { title: translate('Quantity'), dataIndex: 'quantity', key: 'quantity' },
      { title: translate('Unit Price'), dataIndex: 'unitPrice', key: 'unitPrice' },
      { title: translate('Status'), dataIndex: 'status', key: 'status' },
    ],
    dataTableColumns: [
      { title: translate('Name'), dataIndex: 'name', key: 'name' },
      { title: translate('SKU'), dataIndex: 'sku', key: 'sku' },
      { title: translate('Description'), dataIndex: 'description', key: 'description' },
      { title: translate('Quantity'), dataIndex: 'quantity', key: 'quantity' },
      { title: translate('Unit Price'), dataIndex: 'unitPrice', key: 'unitPrice' },
      { title: translate('Status'), dataIndex: 'status', key: 'status' },
    ],
    pagination: { pageSize: 10 },
    searchConfig,
    deleteModalLabels,
  };

  return (
    <ErpLayout>
      {lowStockProducts.length > 0 && (
        <Alert
          message={translate('Low Stock Warning')}
          description={
            <div>
              {translate('The following products are low on stock:')}
              <ul>
                {lowStockProducts.map(product => (
                  <li key={product._id}>
                    {product.name} ({product.quantity} {translate('left')})
                  </li>
                ))}
              </ul>
            </div>
          }
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 20 }}
        />
      )}
      
<CrudModule
        createForm={<ProductForm />}
        updateForm={<ProductForm isUpdateForm={true} />}
        config={configPage}
        // afterCreate={loadLowStockProducts}
        // afterUpdate={loadLowStockProducts}
/>

      <Modal
        title={translate(stockAction === 'add' ? 'Add Stock' : 'Remove Stock')}
        open={isStockModalVisible}
        onOk={updateStock}
        onCancel={() => {
          setIsStockModalVisible(false);
          setSelectedProduct(null);
          setStockQuantity(0);
        }}
      >
        <div style={{ padding: '20px 0' }}>
          <h3>{selectedProduct?.name}</h3>
          <p>{translate('Current Stock')}: {selectedProduct?.quantity}</p>
          <InputNumber
            min={1}
            value={stockQuantity}
            onChange={(value) => setStockQuantity(value)}
            style={{ width: '100%' }}
            placeholder={translate('Enter quantity')}
          />
        </div>
      </Modal>
    </ErpLayout>
  );
}
