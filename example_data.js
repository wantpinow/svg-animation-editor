// input elements (from database)
let elements = [
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

// get current element positions
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
            for (ee_id in group_res) {
                res[ee_id] = group_res[ee_id]
            }
        }
    }
    return res
}
function get_element_positions(ele) {
    return get_element_positions_helper(ele, [])
}
let element_positions = get_element_positions(elements)

// add to elements (and positions)
function add_element(e) {
    if (!e.id in element_positions) {
        const e_index = elements.push(e) - 1
        element_positions[e.id] = [e_index]
    }
}

// delete from elements (and positions)
function delete_element(e_id) {
    const element_position = element_positions[e_id]
    let parent_element = elements
    for (let i = 0; i < element_position.length; i++) {
        if (i !== element_position.length - 1) {
            parent_element = parent_element[element_position[i]].elements
        } else {
            const e_index = element_position[i]
            let e = parent_element[e_index]
            if (e.type == 'group') {
                for (let j = e.elements.length - 1; j >= 0; j--) {
                    delete_element(e.elements[j].id)
                }
            }
            parent_element.splice(element_position[i], 1)
            delete element_positions[e_id]
        }
    }
}

// get element (from position)
function get_element(e_id) {
    const element_position = element_positions[e_id]
    let parent_element = elements
    for (let i = 0; i < element_position.length; i++) {
        if (i !== element_position.length - 1) {
            parent_element = parent_element[element_position[i]].elements
        } else {
            const e_index = element_position[i]
            return parent_element[e_index]
        }
    }
}

// TESTING
console.log(elements)
console.log(element_positions)
console.log('------------')
console.log(get_element(4))



