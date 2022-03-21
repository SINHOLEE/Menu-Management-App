import { useEffect, useReducer } from 'react';

type InitState<T> = { isLoading: boolean; error: string | null; data: T | null };
type Action<T> =
  | { type: 'FETCH' }
  | { type: 'SUCCESS'; payload: { data: T } }
  | { type: 'FAIL'; payload: { message: string } };
interface Reducer<T> {
  (state: InitState<T>, action: Action<T>): InitState<T>;
}

const reducer = <T>(state: InitState<T>, action: Action<T>): InitState<T> => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, isLoading: true };
    case 'SUCCESS':
      console.log(action.payload.data);
      return { ...state, isLoading: false, data: action.payload.data };
    case 'FAIL':
      return { data: null, isLoading: false, error: action.payload.message };
    default:
      throw new Error('type이 올 수 없는 친구가 왔어용.');
  }
};

const useFetch = <Data = any>(client: () => Promise<Data>): InitState<Data> => {
  const [state, dispatch] = useReducer<Reducer<Data>>(reducer, {
    isLoading: true,
    error: null,
    data: null,
  });
  useEffect(() => {
    dispatch({ type: 'FETCH' });
    const fetch = async () => {
      try {
        const res = await client();
        dispatch({ type: 'SUCCESS', payload: { data: res } });
      } catch (e: any) {
        dispatch({ type: 'FAIL', payload: { message: e.message } });
      }
    };
    fetch();
  }, []);

  return state;
};

export default useFetch;
