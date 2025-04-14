
const arcgis_default_view = (elem_id, default_center, default_scale) => {
    let elem = document.getElementById(elem_id)
    let config = { attributes: true };
    let callback = (mut_list, observer) => {
        for (const mut of mut_list) {
            if (mut.type !== "attributes") { continue; }
            elem.setAttribute("center", default_center)
            elem.setAttribute("scale", default_scale)
            observer.disconnect()
            return;
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(elem, config);
}

const generate_tabs = (container_id, inner_container_add_classes, elem_ids, friendly_names) => {
    if (elem_ids.length !== friendly_names.length) {
        console.error("The two provided arrays have different lengths. (generate_tabs())")
    }

    // create container div
    const container = document.createElement("div")
    container.setAttribute("class", "button-container " + inner_container_add_classes || "")
    
    // create all button elems
    const buttons = []
    for (let i = 0; i < elem_ids.length; ++i) {

        const button = document.createElement("button")
        button.innerText = friendly_names[i]
        buttons.push(button)

        // apply style and onclick to all button elems
        button.setAttribute("class", "tab-button")
        button.addEventListener("click", () => {
                select_tab(elem_ids, buttons, i)
            }
        )

        if (!i) {
            button.setAttribute("style", "border-left: none;")
        } else if (i == elem_ids.length - 1) {
            button.setAttribute("style", "border-right: none;")
        }

        // append buttons to container div
        container.appendChild(button)

    }

    // append container div to specified div (insert at front somehow?)
    const outer_container = document.getElementById(container_id)
    outer_container.insertBefore(container, outer_container.firstChild)

    // select first idx as default shown
    document.addEventListener("DOMContentLoaded", () => {
        select_tab(elem_ids, buttons, 0)
    })

}

const remove_all = (arr, val) => {
    if (!arr) return []
    if (!arr.includes(val)) return arr
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] === val) {
            arr = (arr.slice(0,i) + arr.slice(i+1)) || []
            if (arr && !Array.isArray(arr)) {
                arr = [arr]
            }
            --i
        }
    }
    return arr
}

const push_if_not_pres = (arr, val) => {
    if (!arr) return []
    if (!arr.includes(val)) arr.push(val)
    return arr
}

const select_tab = (elem_id_arr, button_arr, selected_idx) => {
    if (selected_idx >= elem_id_arr.length) {
        console.error("Tried to select invalid idx")
        return
    }
    for (let i = 0; i < elem_id_arr.length; ++i) {
        elem = document.getElementById(elem_id_arr[i])
    
        // split class by space
        classes = (elem.getAttribute("class") || "").split(" ")
        button_classes = (button_arr[i].getAttribute("class") || "").split(" ")

        if (i == selected_idx) {
            classes = remove_all(classes, "hidden")
            button_classes = push_if_not_pres(button_classes, "selected-tab")
        } else {
            classes = push_if_not_pres(classes, "hidden")
            button_classes = remove_all(button_classes, "selected-tab")
        }

        console.log(JSON.stringify(classes))
        console.log(JSON.stringify(button_classes))

        elem.setAttribute("class", classes.join(" "))
        button_arr[i].setAttribute("class", button_classes.join(" "))
    }
}