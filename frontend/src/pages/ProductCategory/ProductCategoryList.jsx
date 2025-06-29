import { useState } from 'react';
import { Button, Tag, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import  CrudModule   from '@/modules/CrudModule/CrudModule';
import { ErpLayout } from '@/layout';
import ProductCategoryForm from '@/forms/ProductCategoryForm';
import { request } from '@/request';

export default function ProductCategoryList() {
  const translate = useLanguage();
  const [treeData, setTreeData] = useState([]);
  const entity = 'category';

  const fetchCategories = async () => {
    const { result } = await request.get({ entity: entity + '/list' });
    console.log(result); // Replace with state update logic
  };

  const createCategory = async (categoryData) => {
    await request.post({
      entity: entity + '/create',
      jsonData: categoryData,
    });
    fetchCategories(); // Refresh category list after creation
  };

  const loadCategoryTree = async () => {
    const { result } = await request.get({ entity: entity + '/tree' });
    const transformData = (categories) => {
      return categories.map(cat => ({
        title: cat.name,
        key: cat._id,
        children: cat.subcategories ? transformData(cat.subcategories) : undefined
      }));
    };
    setTreeData(transformData(result));
  };

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name,description',
    outputValue: '_id',
  };
 

  const Labels = {
    PANEL_TITLE: translate('product_category'),
    DATATABLE_TITLE: translate('product_category_list'),
    ADD_NEW_ENTITY: translate('add_new_category'),
    ENTITY_NAME: translate('category'),
  };

  const configPage = {
    entity,
    ...Labels,
     fields: [
      { name: 'name', label: translate('Name'), type: 'text' },
      { name: 'description', label: translate('Description'), type: 'textarea' },
      { name: 'parent', label: translate('Parent Category'), type: 'select', options: [] },
      { name: 'enabled', label: translate('Status'), type: 'select', options: ['Enabled', 'Disabled'] },
    ]
  };

  return (
    <ErpLayout>
      <div className="category-layout">
        <aside className="category-tree">
          <div className="tree-header">
            <h3>{translate('Category Tree')}</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => loadCategoryTree()}
            >
              {translate('Refresh')}
            </Button>
          </div>
          <Tree
            treeData={treeData}
            defaultExpandAll
            showLine
            showIcon
          />
        </aside>
        <main className="category-content">
          <CrudModule
            createForm={<ProductCategoryForm />}
            updateForm={<ProductCategoryForm isUpdateForm={true} />}
            config={configPage}
            // afterCreate={loadCategoryTree}
            // afterUpdate={loadCategoryTree}
            // afterDelete={loadCategoryTree}
            // entityDisplayLabels={entityDisplayLabels}
            // searchConfig={searchConfig}
            // dataTableColumns={dataTableColumns}
          />
        </main>
      </div>
      <style jsx="true">{`
        .category-layout {
          display: flex;
          gap: 24px;
          height: 100%;
        }
        .category-tree {
          width: 300px;
          background: #fff;
          padding: 16px;
          border-radius: 8px;
        }
        .tree-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .tree-header h3 {
          margin: 0;
        }
        .category-content {
          flex: 1;
        }
      `}</style>
    </ErpLayout>
  );
}
