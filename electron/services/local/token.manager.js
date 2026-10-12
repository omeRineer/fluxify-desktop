const { getStore } = require('./store.manager');


async function set(token) {
    const store = await getStore();
    store.set('accessToken', token);
}

async function get() {
    const store = await getStore();
    return store.get('accessToken');
}

module.exports = {
    getAccessToken: get,
    setAccessToken: set
};