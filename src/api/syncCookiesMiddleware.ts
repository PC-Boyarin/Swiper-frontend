import Cookies from 'js-cookie';

const syncCookiesMiddleware = (store: any) => (next: any) => (action: any) => {
	const result = next(action);
	if (action.type === 'user/setUser') {
		Cookies.set('user', JSON.stringify(store.getState().user.user));
	} else if (action.type === 'user/clearUser') {
		Cookies.remove('user');
	}

	return result;
};

export default syncCookiesMiddleware;
