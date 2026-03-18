import {useEffect, useState} from "react";
import {type IDBPDatabase, openDB } from 'idb';
import type {User} from "../../types/userType.ts";

export function useIndexDB() {
    const [db, setDb] = useState<IDBPDatabase | null>(null)

    useEffect(() => {
        const initDB = async () => {
            const database = await openDB('swiper', 1, {
                upgrade(db) {

                    if(!db.objectStoreNames.contains('user')) {
                        db.createObjectStore('user', { keyPath: 'id' })
                    }

                    if (!db.objectStoreNames.contains('messages')) {
                        const store = db.createObjectStore('messages', { keyPath: 'id' });
                        store.createIndex('roomId', 'roomId');
                    }
                }
            })
            setDb(database);
        }
        initDB();
    }, [])

    const saveUser = async (user: User) => {
        if (!db) return;
        await db.put('user', user);
    };

    const getUser = async (id: string | number) => {
        if (!db) return null;
        return await db.get('user', id);
    };

    return { db, saveUser, getUser };
}

