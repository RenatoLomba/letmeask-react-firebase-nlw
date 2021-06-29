import toast from 'react-hot-toast';

export function useErrorToast(msg: string) {
  return toast.error(msg);
}
