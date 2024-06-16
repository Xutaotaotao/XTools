import { KeyValueStore } from '@/db';
import {IS_TAURI} from '@/utils/const'
export const getStore = async (key:string) => {
    if (IS_TAURI) {
        const store = new KeyValueStore();
        const val =   await store.get(key);
        return val
    } else {
        return localStorage.getItem(key)
    }
}

export const setStore = async (key:string,value:string) => {
    if (IS_TAURI) {
        const store = new KeyValueStore();
        await store.set(key,value);
    } else {
        localStorage.setItem(key,value)
    }
}