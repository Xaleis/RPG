var Window = function(id, parent){
        this.id = id;
        this.parent = parent;
        
        this.root = document.createElement("div");
        this.root.className = "window";
        this.root.setAttribute("id", this.id);
        this.parent.appendChild(this.root);
        
        this.menu = document.createElement("div");
        this.menu.className = "menu";
        this.root.appendChild(this.menu);
        
        this.ul = document.createElement("ul");
        this.menu.appendChild(this.ul);
        
        this.content = document.createElement("div");
        this.content.className = "content";
        this.root.appendChild(this.content);
        
        this.currentPage = null;
};
Window.prototype.addPage = function(title, page){
        var self = this;
        if(!(page instanceof Page)){
                throw page + " is not instanceof Page";
        }
        
        page.setVisible(false);
        this.content.appendChild(page.root);
        
        var li = document.createElement("li");
        li.innerHTML = title;
        li.page = page;
        this.ul.appendChild(li);
        
        li.addEventListener("click", function(){
                self.showPage(li);
        });
        
        if(this.currentPage == null){
                this.showPage(li);
        }
};

Window.prototype.showPage = function(elm){
        if(this.currentPage) {
                this.currentPage.page.setVisible(false);
                this.currentPage.setAttribute("class", "");
        }
        this.currentPage = elm;
        this.currentPage.page.setVisible(true);
        this.currentPage.setAttribute("class", "selected");
};