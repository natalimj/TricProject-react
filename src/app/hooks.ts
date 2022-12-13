import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Includes Redux Toolkit hooks
 * to dispatch actions to the store
 * and retrieve data from the store 
 * Redux Toolkit hooks are used throughout the app 
 * instead of plain `useDispatch` and `useSelector`
 * 
 * @ Daria-Maria Popa
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

