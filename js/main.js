let elList = document.querySelector(".list")
let modalWrapper = document.querySelector(".modal-wrapper")
let modalInner = document.querySelector(".modal-inner")
elList.innerHTML = "Loading..."

const api = `https://fakestoreapi.com/products/`

const TOKEN = "7726296018:AAGVDUKMjfL1W3hl7e0_CMfR9xRgeSLbGY4"
const CHAT_ID = "-1002757556352"
const API_Message = `https://api.telegram.org/bot${TOKEN}/sendPhoto`


// Get products
const getProducts = () => axios(api).then(res => renderProducts(res.data, elList))
getProducts()

// Render products
function renderProducts(arr, list){
    list.innerHTML = null
    arr.forEach(item => {
        let elItem = document.createElement("li")
        elItem.className = "w-[300px] rounded-md p-3 overflow-hidden bg-white"
        elItem.innerHTML =`
            <img class="h-[250px] mx-auto mb-3" src="${item.image}" alt="Product img"/>
            <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${item.title}</h2>
            <p class="line-clamp-3 mb-1">${item.description}</p>
            <strong class="text-[20px] mb-2 inline-block">${item.price} $</strong>
            <button onclick="handleOrder(${item.id})" class="w-full cursor-pointer hover:scale-[1.02] duration-300 py-2 rounded-md bg-green-600 text-white font-semibold">Order</button>
        `
        list.append(elItem)
    })
}

function handleOrder(id){
    modalWrapper.classList.remove("scale-0")
    axios(`${api}/${id}`).then(res => {
        modalInner.innerHTML = `
            <div class="flex gap-[30px]">
                <img src="${res.data.image}" alt="" width="250" height="250"/> 
                <div class="flex flex-col gap-[10px] w-[300px]">
                    <div>
                        <h2 class="font-bold text-[20px] line-clamp-1 mb-2">${res.data.title}</h2>
                        <strong class="text-[20px] mb-2 inline-block">${res.data.price} $</strong>
                        <p class="line-clamp-3 mb-1">${res.data.description}</p>
                    </div>
                    <form class="order-form space-y-3" autocomplete="off">
                        <input required type="text" class="text-black p-3 rounded-md outline-none shadow-md focus:shadow-green-500 w-full" placeholder="Enter name" name="name"/>
                        <input required type="tel" class="text-black p-3 rounded-md outline-none shadow-md focus:shadow-green-500 w-full " placeholder="Enter phone number" name="phone"/>
                        <input required type="text" class="text-black  p-3 rounded-md outline-none shadow-md focus:shadow-green-500 w-full " placeholder="Enter address" name="address"/>
                        <button type="submit" class="w-full cursor-pointer hover:scale-[1.03] hover:bg-transparent hover:text-green-500 border-[2px] border-green-500 duration-300 py-2 rounded-md bg-green-500 text-white font-semibold ">Order</button>
                    </form>
                </div>
            </div>
        `

        let elOrderForm = document.querySelector(".order-form")
        elOrderForm.addEventListener("submit", function(evt) {
            evt.preventDefault()
            let message = `<b>Title: ${res.data.title}</b> \n`
            message += `<b>Description: ${res.data.description}</b> \n`
            message += `<b>Price: ${res.data.price}</b> \n`
            message += `--------------------------- \n`
            message += `<b>Name: ${evt.target.name.value}</b> \n`
            message += `<b>Phone: ${evt.target.phone.value}</b> \n`
            message += `<b>Address: ${evt.target.address.value}</b> \n`

            const data = {
                parse_mode:"html",
                chat_id:CHAT_ID,
                photo:res.data.image,
                caption:message
            }       
            
            axios.post(API_Message, data).then(() => modalWrapper.classList.add("scale-0"))
        })
    })
}

modalWrapper.addEventListener("click", (evt) => evt.target.id == "wrapper" ? modalWrapper.classList.add("scale-0") : "")