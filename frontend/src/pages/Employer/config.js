export const fields = [
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    required: true,
  },
  {
    name: 'managerName',
    label: 'Manager First Name',
    type: 'text',
    required: true,
  },
  {
    name: 'managerSurname',
    label: 'Manager Last Name',
    type: 'text',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
];

export const config = {
  entity: 'employers',
  PANEL_TITLE: 'Employer',
  DATATABLE_TITLE: 'Employer List',
  ADD_NEW_ENTITY: 'Add New Employer',
  ENTITY_NAME: 'Employer',
  fields,
  searchConfig: {
    displayLabels: ['company'],
    searchFields: 'company',
  },
  deleteModalLabels: ['company'],
};
