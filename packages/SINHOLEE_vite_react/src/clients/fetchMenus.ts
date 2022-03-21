import axios from 'axios';
import { Category, ClientMenuItem, MenuItem } from '../NodeContext/types';
import { GLOBAL_UNIQUE_TYPE } from '../NodeContext/constants';

export async function fetchMenus(category: Category) {
  const res = await axios(`api/v1/category/${category.name}/menu`);
  if (res.status !== 200) {
    throw new Error(`fetch menu by category ${category.name} is failed`);
  }
  return parseMenus(category, res.data as ClientMenuItem[]);
}

export async function addMenu(menuName: string, category: Category) {
  const res = await axios(`api/v1/category/${category.name}/menu`, {
    method: 'post',
    data: { name: menuName },
  });
  // axios 문제인가?
  if (res.status !== 200) {
    throw new Error(`${res.data.message}`);
  }
}

type SuccessResult<T> = {
  result: 'success';
  data?: T;
};
type FailResult = {
  result: 'fail';
  reason: string;
};

type Result<T = any> = SuccessResult<T> | FailResult;
export const menuService = {
  add: async (menuName: string, category: Category): Promise<Result> => {
    try {
      await addMenu(menuName, category);
      return {
        result: 'success',
      };
    } catch (e: any) {
      return {
        result: 'fail',
        reason: e?.response?.data?.message ?? 'error',
      };
    }
  },
};

export const parseMenus = (category: Category, clientMenus: ClientMenuItem[]): MenuItem[] => {
  return clientMenus?.map(item => ({
    ...item,
    type: GLOBAL_UNIQUE_TYPE.menuItem,
    '@category': category.type,
  }));
};
