import { Category, MenuItem } from '../../../NodeContext/types';
import { GLOBAL_UNIQUE_TYPE } from '../../../NodeContext/constants';
import { useNode } from '../../../NodeContext/hooks/useNode';
import MenuListHeader from './MenusHeader';
import MenuInput from './MenuInput';
import Menu from './MenuItem';
import React from 'react';
import useFetch from '../../../Hooks/useFetch';
import { fetchMenus } from '../../../clients/fetchMenus';

const useMenuListByCategory = ({ categoryId }: { categoryId: string }) => {
  const category = useNode<Category>({ type: GLOBAL_UNIQUE_TYPE.category, id: categoryId });
  const { isLoading, data, error } = useFetch<MenuItem[]>(() => fetchMenus(category));
  return {
    isLoading,
    error,
    menuList: data?.filter(item => item[GLOBAL_UNIQUE_TYPE.category] === categoryId),
  };
};

const MenuList = ({ categoryId }: { categoryId: string }) => {
  const { isLoading, error, menuList: menus } = useMenuListByCategory({ categoryId });
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <ul>
      {menus?.map(({ id }) => (
        <Menu id={id} key={id} />
      ))}
    </ul>
  );
};
export default function MenusContainer({ categoryId }: { categoryId: string }) {
  const category = useNode<Category>({ type: GLOBAL_UNIQUE_TYPE.category, id: categoryId });
  const { isLoading, error, menuList: menus } = useMenuListByCategory({ categoryId });
  if (isLoading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <MenuListHeader categoryTitle={category.title_ko} menusLength={menus.length} />
      <MenuInput categoryId={categoryId} />
      <MenuList categoryId={categoryId} />
    </>
  );
}
