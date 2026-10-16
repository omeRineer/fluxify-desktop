const { getStore } = require('./store.manager');


async function set(token) {
    const store = await getStore();
    store.set('accessToken', token);
}

async function get() {
    const store = await getStore();
    return store.get('accessToken');
}

async function remove() {
    const store = await getStore();
    return store.delete('accessToken');
}

module.exports = {
    getAccessToken: get,
    setAccessToken: set,
    removeAccessToken: remove
};