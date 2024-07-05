const shimmerContainer =  document.getElementsByClassName("shimmer-container")[0];//bcs we target the class name so it target in array form
const PaginationContainer = document.getElementById("pagination");

// this is an api key,where we created a object 
// options which has method which is GET type, and other is "headers"
// which have object accept which means what type of data I am 
// accepting which is in JSON format
const options ={
    method:"GET",
    headers:{
        accept:"application/json",    //bcs we get in json formate
        "x-cg-demo-api-key":"CG-mDVVqLm5xBDjvcVq523LnAmB"
    },
};


let coins = [];
let itemsPerPage = 15;
let currentPage = 1;

// 1st step is fetching the data from api

// here fetch returns the promise, 
//  we generally use async await inspite of promise
const fetchCoins = async()=>{
    try{
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",options);
            console.log(response);
           
            const coinsData = await response.json()
            return coinsData;
           
    }catch (error){
      console.error("error while fetching coins",error);

    }
} 
const fetchFavouriteCoins=()=>{
    return JSON.parse(localStorage.getItem("favourites"))|| [];
}
//save favourites
const saveFavouriteCoins =(favourites)=>{
    localStorage.setItem("favourites",JSON.stringify(favourites));

}
// for making favourites coin
const handlleFavClick = (coinId)=>{
    const favourites = [];
    favourites.push(coinId)
    // save the coin id 
    saveFavouriteCoins(favourites)

}
// for showing shimmer container
const showShimmer = ()=>{
    shimmerContainer.style.display = "flex";
}
// for hidding shimmerContainer
const hideShimmer =()=>{
    shimmerContainer.style.display = "none";
}
// for Pagination
const getCoinToDisplay =(coins,page)=>{
    const start = (page-1)*itemsPerPage;
    const end = start+itemsPerPage;
    return coins.slice(start,end);//slice take start index to end-1 index doesnt consider the last element

};
// render pagination
const renderPagination = (coins)=>{
    const totalPage = Math.ceil(coins.length / itemsPerPage);
    PaginationContainer.innerHTML ="";
    for(let i =1;i<=totalPage;i++){
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        //classList is an array, in future if we want multiple same classes should be added, yu can add once
        pageBtn.classList.add("page-button");

        if(i=== currentPage){
            pageBtn.classList.add("active");
        }
        // allow click over the btn
        pageBtn.addEventListener("click",()=>{
            currentPage = i;
            displayCoins(getCoinToDisplay(coins,currentPage),currentPage);
            updatePaginationButtons();

        })

        PaginationContainer.appendChild(pageBtn);
    }

}
// updating  active pagination button
const updatePaginationButtons = ()=>{
    const pageBtns = document.querySelectorAll(".page-button"); //uery selector gives list of aray of this class
    pageBtns.forEach((button,index)=>{
        if(index + 1 === currentPage){ //bcs array always stsart with 0th element thats why index+1
            button.classList.add("active");
        }else{
            button.classList.remove("active");
        }
    });


}
// 3rd is--> rendering the data on screen
// we hve to create the table first
const displayCoins =(coins,currentPage)=>{
    const start = (currentPage-1)*itemsPerPage+1;
    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML ="";
    coins.forEach((coin,index)=> {
        const row = document.createElement("tr");
        row.innerHTML=
          `
        <td>${start+index}</td>
         <td><img src = "${coin.image}" alt ="${coin.name}" width="24" height ="24"/></td>
         <td>${coin.name}</td>
         <td>$${coin.current_price}</td>
         <td>$${coin.total_volume}</td>
         <td>$${coin.market_cap}</td>
        <td><i class="fa-solid fa-star favourite-icon" data-id =" ${coin.id}"></i></td>
        `;
        row.querySelector(".favourite-icon").addEventListener("click",(event)=>{
            event.stopPropagation()  //for stop event bubbling-->it bubble the parent element
            handlleFavClick(coin.id);

            }
        )
        tableBody.appendChild(row);
       
    
    });

}


//2nd step displaying the data on page 

// window.onload = fetchCoins;

// one more way to loading Our Dom Page load
// which is Dom content loader

document.addEventListener("DOMContentLoaded",async()=>{
    // we cannt put dirrectly fetchCoins in coins bcs it is await so it resolve the promise 
    // so it might get error so we handle in try catch block
    // coins = await fetchCoins();
    try{
        showShimmer()
        coins = await fetchCoins();
        console.log(coins);
        displayCoins(getCoinToDisplay(coins,currentPage),currentPage);
        renderPagination(coins)
        hideShimmer();
    }catch(error){
        console.log(error);
        hideShimmer();

    }
    
})


