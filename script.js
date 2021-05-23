let input__field = document.getElementById('search__input');
let input__focus = document.getElementById('search__focus')
let search__expand = document.getElementById('search__bar')

input__focus.addEventListener('click', focusInput)

function focusInput() {
    // console.log('you clicked')
   input__field.focus();
}

const data = {
    "token" : "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",
    "username" : "Jojoarm"
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
            repositories(first: 20, orderBy: {field:NAME, direction:ASC}) {
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
                        languages(first:1){
                        nodes{
                            name
                        }
                        }
                }
                }
                }
            }
        }
	`,
};

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
    console.log(data.data)
})
