class View {
    constructor(){
        this.git = document.getElementById('git')
        this.title = this.createElement('h1');

        this.searchLine = this.createElement('div', 'searchLine')
        this.searchInput = this.createElement('input', 'search-input')
        this.searchCounter = this.createElement('span', 'counter')
        this.searchLine.append(this.searchInput)
        this.searchLine.append(this.searchCounter)

        
        this.usersWrapper = this.createElement('div','users-wrapper')
        this.usersList = this.createElement('ul', 'users')
        this.usersWrapper.append(this.usersList)

        this.usersRepos = this.createElement('ul', 'repos')
        
        this.main = this.createElement('div','main')
        this.main.append(this.usersWrapper)

        this.git.append(this.title)
        this.git.append(this.searchLine)
        this.git.append(this.main)
        this.git.append(this.usersRepos)
    }

    createElement(elementTag, elementClass){
        const element = document.createElement(elementTag)
        if (elementClass) element.classList.add(elementClass)
        return element
    }

     createUser(owner){
        const userElement = this.createElement('li', 'user-prev')
        userElement.innerHTML = `<span class = "user-repositories">${owner.name}</span>`;
        userElement.addEventListener('click',()=>{
                                                    this.clearSearch()
                                                    let repositiries = this.createElement('div', 'info-repositiries')
                                                    repositiries.innerHTML = `<div > Name: ${owner.name}</div>
                                                                             <div > Owner: ${owner.owner.login}</div>
                                                                             <div > Stars: ${owner.stargazers_count}</div>`;
                                                    let delete_repositiries = this.createElement('div', 'delete')
                                                    delete_repositiries.innerHTML = `<img src="img/close.svg"  alt="закрыть">`
                                                    this.usersRepos.append(repositiries)
                                                    repositiries.append(delete_repositiries)
                                                    delete_repositiries.addEventListener('click', ()=> {
                                                        repositiries.remove()
                                                        delete_repositiries.remove()
                                                        })
        } )
    this.usersList.append(userElement) 
    }
    
    clearSearch(){
        document.querySelector('.search-input').value = ""
        document.querySelector('.users').innerHTML = ""
    }



    delite_repository(){

        let repos = document.querySelector('.info-repositiries')
        document.querySelector('.delete').addEventListener('click', ()=> {
            repos.remove('info-repositiries')
            console.log('kek')
            })
    } 
    
     
}

class Search {
    constructor(view){
   this.view = view         
   this.view.searchInput.addEventListener('keyup' , this.debounce(this.searchUsers.bind(this), 600))
    }

    async searchUsers(){
        
        if(this.view.searchInput.value){
            return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=5`)
            .then((res)=> {

                if (this.oldSearch != this.view.searchInput.value ) {this.clearRepositories() } 
                this.oldSearch = this.view.searchInput.value
                if (res.ok){
                    res.json().then(res=>{
                    res.items.forEach(user=>this.view.createUser(user))
                    })
                } 
            })
        } else {this.clearRepositories() }
    }

    clearRepositories(){
     this.view.usersList.innerHTML = ' '   
    }

    debounce = (fn, debounceTime) => {
        let time
        return function(){
           let func = ()=>{ fn.apply(this, arguments)}
           clearTimeout(time)
           time = setTimeout(func, debounceTime)  
        }
       };

}

new Search( new View)
