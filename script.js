const search = document.getElementById("search");
const mobileSection = document.getElementById("mobile-sec");
const cartSection = document.getElementById("cart-sec");
const searchSection = document.getElementById("search-sec");
const mobileDetail = document.getElementById("mobdet");
const filterMinValue = document.getElementById("fltinpt");
const filterMaxValue = document.getElementById("maxfltinp");
const filterSection = document.getElementById("filter-sec");
const cart = document.getElementById("cart-icon");
const loader = document.getElementById("loader");
const div = document.getElementById("dropDown");
const ul = document.createElement("ul");
const paginate = document.getElementById("pagination");
let count = document.getElementById("tag");

filterSection.style.display = "none";
// filterSection.classList.remove("filter-sec");
//Variable Declaration;
let mobileData = [];
let searchValue = [];
let computerSearchValue = [];
let Saved = {};
let Skip = 0;

//Mobile Home
function domInsert(pera) {
  console.log(pera);
  searchSection.style.display = "none";
  let curr = pera === "mobileData" ? mobileData : Object.values(Saved);
  curr.forEach((mobileArray, i) => {
    const mob = document.createElement("div");
    mob.setAttribute("class", "mob1");
    if(pera === "Saved") {
      paginate.classList.add('hidden')
      mob.setAttribute("onclick", `moboDetail(${mobileArray.id},"remove")`);
    }else if(pera ==='mobileData') {
      console.log(pera)
      mob.setAttribute("onclick", `moboDetail(${mobileArray.id})`);
    }
    const model = document.createElement("h1");
    model.textContent = `${mobileArray.title}`;
    const release = document.createElement("h4");
    release.textContent = `${mobileArray.brand}`;
    const price = document.createElement("h6");
    price.textContent = `A${mobileArray.price}`;
    mob.append(model, release, price);
    mobileSection.append(mob);
  });
  if (pera === "Saved" && Object.keys(Saved).length > 0) {
    const btn = document.createElement("button");
    console.log(pera);
    btn.textContent = "Check Out";
    btn.classList.add("btn");
    btn.addEventListener("click", () => {
      alert("Thanks for Shopping");
    });
    mobileSection.append(btn);
    console.log(Object.keys(Saved).length);
  }
  if (pera === "Saved") {
  searchSection.style.display='none'
    const contiBtn = document.createElement("button");
    contiBtn.textContent = "Continue Shopping";
    contiBtn.classList.add("Cbtn");
    contiBtn.addEventListener("click", () => {
      mobileSection.textContent = "";
      domInsert("mobileData");
    });
    mobileSection.append(contiBtn);
  }
}
//MobileDetail
function moboDetail(id, rem) {
  console.log(id, rem);
  mobileDetail.textContent = "";
  mobileDetail.style.display = "flex";
  searchSection.style.display = "none";
  filterSection.style.display = "none";
  mobileData.forEach((data) => {
    if (id === data.id) {
      paginate.style.display = "none";
      mobileDetail.setAttribute("class", "mobdet");
      mobileSection.style.display = "none";
      const mob = document.createElement("div");
      mob.setAttribute("class", "mobile");
      const img = document.createElement("img");
      img.setAttribute("class", "imgDet");
      img.src = `${data.thumbnail}`;
      console.log(data.thumbnail);
      mob.append(img);
      const textContain = document.createElement("div");
      textContain.setAttribute("class", "text-content");
      const model = document.createElement("h1");
      model.textContent = `${data.title}`;
      const detail = document.createElement("h3");
      detail.textContent = `${data.description}`;
      const release = document.createElement("h4");
      release.textContent = `Brand (${data.brand})`;
      const price = document.createElement("h6");
      price.textContent = `RS : ${data.price}`;
      const btn = document.createElement("button");
      btn.setAttribute("class", "atc");
      if (rem === "remove") {
        btn.textContent = "Remove";
        btn.setAttribute("onclick", `Remove(${data.id})`);
      } else {
        btn.textContent = "Add to Cart";
        btn.setAttribute("onclick", `Save(${data.id})`);
      }
      const back = document.createElement("button");
      back.textContent = "Back ";
      back.setAttribute("class", "back");
      if (rem === "filter") {
        back.setAttribute("onclick", "Back('filter')");
      } else if(rem === "search") {
        back.setAttribute("onclick", "Back('search')");
      }else{
        back.setAttribute("onclick", "Back()");
      }
      textContain.append(model, detail, release, price, back, btn);
      mobileDetail.append(mob, textContain);
    }
  });
}

//Remove
function Remove(id) {
  mobileDetail.textContent = "";
  mobileSection.textContent = "";
  if (Saved[id]) delete Saved[id];
  localStorage.setItem("mobo", JSON.stringify(Saved));
  domInsert("Saved");
  Back();
  Counter();
}

//Back
function Back(swtich) {
  mobileSection.style.display = "flex";
  mobileDetail.style.display = "none";
  searchSection.style.display = "flex";
  
  if (swtich === "filter") {
    mobileSection.style.display = "none";
    filterSection.style.display = "flex";
    searchSection.style.display = "none";
  } else if(swtich === 'search') {
    // paginate.style.display = "none";
  }else{
    mobileSection.style.display = "flex";
    filterSection.style.display = "none";
  }
}

//LocalStorage
function Save(id) {
  mobileData.forEach((data) => {
    if (id === data.id && !Saved[id]) {
      Saved[id] = data;
      localStorage.setItem("mobo", JSON.stringify(Saved));
    }
  });
  console.log(localStorage.getItem("mobo"));
  Counter();
}

//activePagi
async function activePagi() {
  mobileSection.textContent = "";
  const request = await fetch(
    `https://dummyjson.com/products?limit=10&skip=${Skip}`
  );
  const response = await request.json();
  console.log(response);
  mobileData = response.products;
  domInsert("mobileData");
}

//Pagination
function pagination(id) {
  if (id === 1) {
    Skip = 10;
    activePagi();
  } else if (id === 2) {
    Skip = 20;
    activePagi();
  } else if (id === 3) {
    Skip = 30;
    activePagi();
  }
}

//getFromLocal
function CartData() {
  if (localStorage.getItem("mobo")) {
    loader.hidden = true;
    Saved = JSON.parse(localStorage.getItem("mobo"));
    count.textContent = Object.values(Saved).length;
  }
  
  paginate.classList.add('hidden')
  filterSection.style.display='none'
  mobileDetail.style.display='none'
  searchSection.style.display='none'
  mobileSection.textContent = "";
mobileSection.style.display='flex'
domInsert('Saved');
}
//Counter
function Counter() {
  if (localStorage.getItem("mobo")) {
    Saved = JSON.parse(localStorage.getItem("mobo"));
    count.textContent = Object.values(Saved).length;
  }
}
Counter();

//Search
function Search() {
  ul.textContent = "";
  searchSection.textContent = "";
  searchSection.style.display = "flex";
  searchValue = search.value;
  mobileDetail.style.display='none'
  // paginate.style.display = "none";

  if (searchValue && searchValue !== "") {
    filterSection.style.display = "none";
    // filterSection.classList.remove("filter-sec");
    mobileSection.textContent = "";
    mobileSection.style.display = "none";
    computerSearchValue.forEach((data) => {
      const { title } = data;
      if (searchValue === title.toLocaleLowerCase()) {
        SFDOM(data, "computerSearchValue");
      }
    });
  }
}
//creating Search and Filter Dom
function SFDOM(data, page) {
  console.log(data);
  console.log(page);
  searchSection.setAttribute("class", "mobile-sec");
  const mob = document.createElement("div");
  mob.setAttribute("class", "mob1");
  if (page === "filter") {
    mob.setAttribute("onclick", `moboDetail(${data.id},'filter')`);
  } else {
    mob.setAttribute("onclick", `moboDetail(${data.id} ,'search')`);
  }
  const model = document.createElement("h1");
  model.textContent = `${data.title}`;
  const release = document.createElement("h4");
  release.textContent = `${data.brand}`;
  const price = document.createElement("h6");
  price.textContent = `A${data.price}`;
  mob.append(model, release, price);
  if (page === "filter") {
    filterSection.append(mob);
  } else {
    searchSection.append(mob);
  }
}

//Filter
function filter(e) {
  filterSection.textContent = "";
  mobileDetail.style.display = "none";
  // paginate.style.display = "none";
  searchSection.style.display = "none";
  mobileSection.style.display = "none";
  filterSection.style.display='flex'
  filterSection.classList.add("filter-sec");

  let min = Number(filterMinValue.value);
  let max = Number(filterMaxValue.value);
  const alert = document.createElement("h");

  mobileData.forEach((data, i) => {
    console.log(data.price);
    if (data.price >= min && data.price <= max) {
      alert.style.display = "none";
      SFDOM(data, "filter");
    } else if (!min && !max) {
      alert.textContent = "Please ! range field is required";
      filterSection.appendChild(alert);
    } else {
      alert.textContent = "Sorry ! your range is not matched";
      filterSection.appendChild(alert);
    }
  });
}

//searching Fetch
async function Searching() {
  const request = await fetch("https://dummyjson.com/products/search?q=phone");
  const response = await request.json();
  computerSearchValue = response.products;
  Search();
}
Searching();

//Fetch
const getMoboData = async () => {
  loader.hidden = false;
  const request = await fetch(`https://dummyjson.com/products?limit=10`);
  const response = await request.json();
  if (response) {
    loader.hidden = true;
    console.log(response);
    mobileData = response.products;
    domInsert("mobileData");
  }
};
getMoboData();

//Search List
function Hah() {
  ul.textContent = "";
  mobileData.forEach((d, i) => {
    const li = document.createElement("li");
    li.classList.add("li");
    ul.classList.add("ul");
    li.textContent = `${d.title}`.toLocaleLowerCase();
    let text = li.textContent.toLocaleLowerCase();
    if (text.indexOf(search.value) > -1) {
      li.style.display = " ";
    } else {
      li.style.display = "none";
    }
    li.addEventListener("click", () => {
      search.value = li.textContent;
      Search();
    });
    if (search.value === "") {
      li.style.display = "none";
    }
    ul.append(li);
  });
  div.append(ul);
}
search.addEventListener("keyup", Hah);
search.addEventListener("change", Search);
cart.addEventListener("click", CartData);
