import { API_BASE_URL } from './serverApiConfig';

export const PRODUCT_API = {
  FETCH_PRODUCTS: `${API_BASE_URL}products`,
  CREATE_PRODUCT: `${API_BASE_URL}products/create`,
  UPDATE_PRODUCT: `${API_BASE_URL}products/update`,
  DELETE_PRODUCT: `${API_BASE_URL}products/delete`,
};
