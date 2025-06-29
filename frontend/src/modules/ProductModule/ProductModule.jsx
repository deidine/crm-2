import { useLayoutEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import CreateForm from '@/components/CreateForm';
import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
import DataTable from '@/components/DataTable/DataTable';
import SearchItem from '@/components/SearchItem';

import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { CrudLayout } from '@/layout';

function FixHeaderPanel({ config }) {
  const addNewItem = () => {
    // Logic for adding a new product
  };

  return (
    <Row gutter={8}>
      <Col className="gutter-row" span={21}>
        <SearchItem config={config} />
      </Col>
      <Col className="gutter-row" span={3}>
        <Button onClick={addNewItem} block={true} icon={<PlusOutlined />}></Button>
      </Col>
    </Row>
  );
}

import { PRODUCT_API } from '@/config/productApiConfig';

const productConfig = {
  apiEndpoint: PRODUCT_API.FETCH_PRODUCTS,
  columns: [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
  ],
  pagination: { pageSize: 10 },
};

function ProductModule({ createForm, updateForm }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(crud.resetState());
  }, []);

  return (
    <CrudLayout
      config={config}
      fixHeaderPanel={<FixHeaderPanel config={config} />}
      sidePanelBottomContent={
        <CreateForm config={config} formElements={createForm} />
      }
      sidePanelTopContent={
        <UpdateForm config={config} formElements={updateForm} />
      }
    >
      <DataTable config={productConfig} />
      <DeleteModal config={config} />
    </CrudLayout>
  );
}

export default ProductModule;
