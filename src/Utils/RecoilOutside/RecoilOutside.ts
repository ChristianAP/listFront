import { useRecoilCallback } from 'recoil';
import { Subject } from 'rxjs';

const setRecoil = new Subject();
const finishSetRecoil = new Subject();

const getRecoil = new Subject();
const returnRecoil = new Subject();

// @ts-ignore
export const promiseSetRecoil = (recoilObj, value) => {
    return new Promise(async (resolve, reject) => {
        setRecoil.next({ recoilObj: recoilObj, value: value })
        finishSetRecoil.subscribe({
            next: (value) => {
                // @ts-ignore
                if (recoilObj === value.recoilObj) {
                    setTimeout(() => resolve(recoilObj), 10)

                }
            }
        });
    })
}

// @ts-ignore
export const promiseGetRecoil = (recoilObj) => {
    return new Promise(async (resolve, reject) => {
        getRecoil.next(recoilObj)
        returnRecoil.subscribe({
            next: (value) => {
                // @ts-ignore
                if (recoilObj === value.recoilObj) {
                    // @ts-ignore
                    resolve(value.value)
                }
            }
        });
    })
}

export default function RecoilOutside() {
    const setStore = useRecoilCallback(({ set }) => async (n) => {
        // @ts-ignore
        await set(n.recoilObj, () => (n.value));
        // @ts-ignore
        finishSetRecoil.next({ recoilObj: n.recoilObj })
    }, [])

    const getStore = useRecoilCallback(({ snapshot }) => async (recoilObj) => {
        // @ts-ignore
        const valueRecoilObj = await snapshot.getPromise(recoilObj);
        returnRecoil.next({ recoilObj: recoilObj, value: valueRecoilObj })
    }, [])

    setRecoil.subscribe({
        next: (value) => {
            setStore(value)
        }
    });

    getRecoil.subscribe({
        next: (recoilObj) => {
            getStore(recoilObj)
        }
    });

    return null;
}