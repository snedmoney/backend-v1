import { customAlphabet } from 'nanoid';
const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 10);
export function generateStringId() {
    return nanoid();
}
