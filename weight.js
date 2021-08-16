function setWeight() {
    var ancestor = document.getElementsByClassName('ct-content-group')

    for (i = 0; i < ancestor.length; ++i) {
        const section_type = ancestor[i].children[1].children[0].className
        if (section_type === "ct-inventory") {
            const section = ancestor[i]
            const header = section.children[0].children[0].children[0].innerHTML
            const items = section.children[1].children[0].children[0].children
            var total_weight = 0
            for (e = 0; e < items.length; ++e) {
                const item_properties = items[e].children
                for (d = 0; d < item_properties.length; ++d) {
                    if (item_properties[d].className === 'ct-inventory-item__weight') {
                        const weight_number = item_properties[d].children[0]
                        if (weight_number != null) {
                            total_weight = total_weight + parseInt(weight_number.children[0].innerHTML);
                        }
                    }
                }
            }
            const new_weight = ` - Total Weight:  ${total_weight}LBS`
            const base = header.split(" - ")[0]
            section.children[0].children[0].children[0].innerHTML = base.concat(new_weight)
        }
    }
}

function getBagOfHolding() {
    const groups = $('.ct-content-group')
    var bag_of_holding
    for (i = 0; i < groups.length; ++i) {
        const section_type = groups[i].children[1].children[0].className
        if (section_type === "ct-inventory") {
            const section = groups[i]
            const header = section.children[0].children[0].children[0].innerHTML
            console.log(header)
            if (header.includes("Bag of Holding")) {
                bag_of_holding = section.children[1].children[0].children[0]
                console.log(bag_of_holding)
            }
        }
    }

    const items = $('.ct-inventory-item ')
    for (i = 0; i < items.length; ++i) {
        var value
        for (e = 0; e < items[i].children.length; ++e) {
            if (items[i].children[e].className.includes('ct-inventory-item__notes')) {
                value = items[i].children[e].children[0].children[0]
                if (typeof value !== 'undefined') {
                    if (value.innerHTML.includes("Bag of Holding")) {
                        bag_of_holding.insertBefore(items[i], bag_of_holding.children[bag_of_holding.childElementCount - 1])
                    }
                }
            }
        }
    }
}

var checkInventoryExist = setInterval(function() {
    // const weights = $('.ct-content-group')
    const $div = $('.ct-primary-box__tab--equipment');

    if ($div.length) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === "class") {
                    var attributeValue = $(mutation.target).prop(mutation.attributeName)
                    if (attributeValue.includes("is-active") && attributeValue.includes("equipment")) {
                        getBagOfHolding();
                        setWeight();
                    }
                }
            });
        });
        observer.observe($div[0], {
            attributes: true
        });
        clearInterval(checkInventoryExist);
    }
}, 100); // check every 100ms

var checkWeightExist = setInterval(function() {
    const weights = $('.ddbc-weight-number__number')
    if (weights.length) {
        weights.bind('DOMSubtreeModified', function () {
            setWeight()
        });
        clearInterval(checkWeightExist);
    }
}, 100); // check every 100ms