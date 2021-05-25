let input__field = document.getElementById('search__input');
let input__focus = document.getElementById('search__focus')
let search__expand = document.getElementById('search__bar')
let avatarImg = document.getElementById('avatar__img1')
let avatarImg2 = document.getElementById('avatar__img2')
let avatarImg3 = document.getElementById('avatar__img3')
let userName = document.getElementById('name')
let userLogin = document.getElementById('username')
let userBio = document.getElementById('description')
let userAddress = document.getElementById('address')
let userEmail = document.getElementById('email')
let userTwitter = document.getElementById('twitter__username')
let repoCount = document.getElementById('repo__count')
let repoList = document.getElementById('repo__list')

input__focus.addEventListener('click', focusInput)

function focusInput() {
    // console.log('you clicked')
   input__field.focus();
}

const data = {
    "token" : " a0a0d662537690fa1b827a82d9d818d220b8f93d",
    "username" : "Jojoarm"
    // "token" : "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",
    // "username" : "Jojoarm"
}

// const fetch = requirejs(["node-fetch"]);

const query_repo = {
  query: `
        query { 
            user(login: "Jojoarm") { 
            name,
                
            avatarUrl,
                    login,
                    bio, 
                    twitterUsername,
                    location,
                    email,
            repositories(first: 20, orderBy: {field:UPDATED_AT, direction:DESC}) {
            pageInfo {hasNextPage, endCursor}
                totalCount,
            nodes{
                ... on Repository{
                    id
                        name,
                updatedAt, 
                forkCount,
                stargazerCount,
                        createdAt,
                        url,
                        description,
                        isFork,
                primaryLanguage {
                    name, color
                },
                    
                }
                }
                }
            }
        }
	`,
};

//A function to determine how long the repository was last updated
const getTime = (repo__time) => {
    let datePast = new Date(`${repo__time }`);
    let dateNow = new Date();

    let years = dateNow.getFullYear() - datePast.getFullYear()

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let seconds = Math.abs((dateNow - datePast)/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

    if (days>365) {
        return (`on ${years} ago`)
    } else if (days>=31 && days<365){
        return (`on ${months[datePast.getMonth()]} ${datePast.getDate()}`)
    } else if (days< 31 && days>0){
        return (`${days + 1} days ago`)
    } else if (hours < 24 && hours > 0){
        return ( `${hours} hours ago`)
    } else if (minutes < 60 && minutes > 0){
        return (`${minutes} minutes ago`)
    } else if (seconds < 60 && seconds > 0){
        return (`${seconds} seconds ago`)
    } else return ('now')
}

const getLanguageIcon = (language) => {
    if (language === 'JavaScript'){
        return ('javascript__icon')
    } else if (language === 'HTML'){
        return ('html__icon')
    } else if (language === 'CSS'){
        return ('css__icon')
    } else return ('other__icon')
} 

//Posting to github GraphQl api
const baseUrl = 'https://api.github.com/graphql'
const headers = {
    'Content-Type': 'application/json',
    Authorization: 'bearer '+data.token
}

fetch(baseUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(query_repo)
}).
then(res => res.json())
.then(data => {
    const repo__data = data.data
    const repositories = data.data.user.repositories.nodes

    //Attach the data from the api to their respective Dom element
    avatarImg.src = repo__data.user.avatarUrl
    avatarImg2.src = repo__data.user.avatarUrl
    avatarImg3.src = repo__data.user.avatarUrl
    userName.innerText = repo__data.user.name
    userLogin.innerText = repo__data.user.login
    userBio.innerText = repo__data.user.bio
    userAddress.innerText = repo__data.user.location
    userEmail.innerText = repo__data.user.email
    userTwitter.innerText = `@${repo__data.user.twitterUsername}`
    repoCount.innerText = repo__data.user.repositories.totalCount
    console.log(repositories.length)

    repoList.innerHTML = ''
    repositories.map(repository => {
        repoList.innerHTML += `
            <div class='repo__box'>
            <div class='repo__title'>
                <p class='repo__name' id='repo__name'>${repository.name}</p>
                <div class="search__option">
                    <p>Star</p>
                    <i class='bx bx-star' ></i>
                </div>
            </div>
            <div class='repo__info'>
                <div class='repo__languageBox'>
                    <span class='repo__languageIcon' style="background-color:${repository.primaryLanguage?.color};" id='repo__languageIcon'></span>
                    <p  class='repo__language' id='repo__language'>${repository.primaryLanguage?.name}</p>
                </div>
                <div class='repo__rating'>
                    <i class='bx bx-star' ></i>
                    <p id='repo__star'>${repository.stargazerCount}</p>
                </div>
                <div class='repo__rating'>
                    <i class='bx bx-git-repo-forked'></i>
                    <p id='repo__fork'>${repository.forkCount}</p>
                </div>
                <p class='repo__update'>Updated <span id='repo__update'>${getTime(repository.updatedAt)}</span></p>
            </div>
        `
    })
})

let sideAvatar1 = document.querySelector(".header2__description");
let sideAvatar2 = document.querySelector(".avatar__container");

let element1 = sideAvatar2.offsetHeight + sideAvatar2.offsetTop

//When you scroll above sideAvatar2 then sideAvatar1 should be displayed
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > element1 || document.documentElement.scrollTop > element1) {
    sideAvatar1.classList.add("show")

  } else {
    sideAvatar1.classList.remove("show")
  }
}
