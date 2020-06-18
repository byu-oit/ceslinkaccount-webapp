const state = <%= JSON.stringify(options.state) %>

const store = {
    namespaced: true,
    state,
    getters: {
        user (state) {
            return state.user
        },
        username (state) {
            return state.username
        },
        authenticated (state) {
            return state.authenticated
        },
        alert (state) {
            return state.alert
        }
    },
    mutations: {
        setToken (state, token) {
            if (!token) return
            state.token = token
        },
        authenticate (state, user) {
            if (!user) return
            state.authenticated = true
            state.user = user
            if (user.name !== undefined) {
                state.username = user.name.displayName
            }
        },
        createAlert (state, opts) {
            state.alert = opts
        },
        clearAlert (state) {
            state.alert = null
        }
    },
    actions: {
        authenticate ({ commit }, user) {
            commit('authenticate', user)
        },
        raiseAlert({ commit, state }, opts) {
            if (state.alert) {
                commit('clearAlert')
                setTimeout(() => commit('createAlert', opts), 500)
            } else {
                commit('createAlert', opts)
            }
        },
        clearAlert({ commit }) {
            commit('clearAlert')
        }
    }
}

export default function (ctx) {
    ctx.store.registerModule('root', store)
}
