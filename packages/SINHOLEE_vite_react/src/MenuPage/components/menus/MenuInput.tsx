import { useNode } from '../../../NodeContext/hooks/useNode';
import { Category } from '../../../NodeContext/types';
import { GLOBAL_UNIQUE_TYPE } from '../../../NodeContext/constants';
import { LAYOUT } from '../../../css-constant';
import React, { FormEvent, useRef } from 'react';
import { menuService } from '../../../clients/fetchMenus';

export default function MenuInput({ categoryId }: { categoryId: string }) {
  const category = useNode<Category>({ type: GLOBAL_UNIQUE_TYPE.category, id: categoryId });
  const inputValueRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValueRef.current?.value) {
      const res = await menuService.add(inputValueRef.current.value, category);
      inputValueRef.current.value = '';
      if (res.result === 'success') {
        alert('성공했지롱.');
        return;
      }
      alert(res.reason);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <label className={LAYOUT.grid}>
        <input
          type="text"
          ref={inputValueRef}
          placeholder={`${category.title_ko}${category.postPosition} 등록하세요.`}
        />
        <input type="submit" value="등록" />
      </label>
    </form>
  );
}
