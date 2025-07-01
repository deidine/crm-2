import useLanguage from '@/locale/useLanguage';
  const translate = useLanguage();


export const fields = {
  company: {
    type: 'string',
  },
  managerName: {
    type: 'string',
    // color: 'red',
  },
  managerSurname: {
    type: 'string',
  },
  phone: {
    type: 'phone',
  },
  email: {
    type: 'email',
  },
};

  const entity = 'employers';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('employers'),
    DATATABLE_TITLE: translate('employers_list'),
    ADD_NEW_ENTITY: translate('add_new_employers'),
    ENTITY_NAME: translate('employers'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
 export const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };

 