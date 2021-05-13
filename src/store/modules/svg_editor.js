import svg_helpers from "../../js/svg_helpers"






// Helper functions
function get_element_positions_helper(ele, curr) {
    let res = {}
    for (let i = 0; i < ele.length; i++) {
        const e = ele[i];
        if (e.id in res) {
            return false
        }
        let e_pos = JSON.parse(JSON.stringify(curr))
        e_pos.push(i)
        res[e.id] = e_pos
        if (e.type == 'group') {
            const group_res = get_element_positions_helper(e.elements, e_pos)
            for (let ee_id in group_res) {
                res[ee_id] = group_res[ee_id]
            }
        }
    }
    return res
}
function get_element_positions(ele) {
    return get_element_positions_helper(ele, [])
}






// input elements (from database)
let input_elements = [
    {
        id: 0,
        type: 'circle',
        transform: false
    },
    {
        id: 1,
        type: 'square',
        transform: false
    },
    {
        id: 2,
        type: 'group',
        elements: [
            {
                id: 3,
                type: 'circle',
                transform: false
            },
            {
                id: 4,
                type: 'circle',
                transform: false
            },
            {
                id: 5,
                type: 'circle',
                transform: false
            }
        ]
    },
]
input_elements = []

// Define state
const state = {
    user: false,
    user_token: false,
    svgElements: input_elements,
    svgElementPositions: get_element_positions(input_elements),
    svgElementDragging: false
}

const getters = {
    user: (state) => state.user,
    userToken: (state) => state.user_token,
    svgElementAll: (state) => state.svgElements,
    svgElementPositions: (state) => state.svgElementPositions,
    svgElement: (state) => (id) => {
        const element_position = state.svgElementPositions[id]
        let parent_element = state.svgElements
        let foundElement = null;
        for (let i = 0; i < element_position.length; i++) {
            if (i !== element_position.length - 1) {
                parent_element = parent_element[element_position[i]].elements
            } else {
                const e_index = element_position[i]
                foundElement = parent_element[e_index]
            }
        }
        foundElement.bboxTransformed = svg_helpers.matrixTransformBBox(foundElement.bbox, foundElement.transform)
        return foundElement
    },
    svgElementDragging: (state) => state.svgElementDragging
}

const actions = {
    startDrag({ commit }) {
        commit('setDrag', true)
    },
    endDrag({ commit }) {
        commit('setDrag', false)
    },
    logout({ commit }) {
        commit('setUserToken', false)
        commit('setUser', false)
    },
    svgElementAdd({ commit }, e) {
        commit('svgElementAdd', e)
    },
    svgElementUpdateTransform({ commit, getters }, { element_id, transform }) {
        console.log(getters.svgElement(element_id).transform)
        commit('svgElementSetTransform', { getters, element_id, transform })
    },
    svgElementDelete({ commit, dispatch }, id) {
        const element_position = state.svgElementPositions[id]
        let parent_element = state.svgElements
        for (let i = 0; i < element_position.length; i++) {
            if (i !== element_position.length - 1) {
                parent_element = parent_element[element_position[i]].elements
            } else {
                const e_index = element_position[i]
                let e = parent_element[e_index]
                if (e.type == 'group') {
                    for (let j = e.elements.length - 1; j >= 0; j--) {
                        dispatch("svgElementDelete", e.elements[j].id)
                    }
                }
            }
        }
        commit('svgElementDeleteLeaf', id)
    },
}

const mutations = {
    setDrag: (state, dragging) => (state.svgElementDragging = dragging),
    svgElementSetTransform: (state, { getters, element_id, transform }) => {
        const element = getters.svgElement(element_id)
        element.transform = transform
    },
    setUserToken: (state, token) => (state.user_token = token),
    setUser: (state, user) => (state.user = user),
    svgElementAdd: (state, e) => {
        if (!(e.id in state.svgElementPositions)) {
            const e_index = state.svgElements.push(e) - 1
            state.svgElementPositions[e.id] = [e_index]
        }
    },
    svgElementDeleteLeaf: (state, id) => {
        const element_position = state.svgElementPositions[id]
        let parent_element = state.svgElements
        for (let i = 0; i < element_position.length; i++) {
            if (i !== element_position.length - 1) {
                parent_element = parent_element[element_position[i]].elements
            } else {
                parent_element.splice(element_position[i], 1)
                delete state.svgElementPositions[id]
            }
        }
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}