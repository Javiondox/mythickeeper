export class Content{ //Base

	id: string;
	name: string;
	type: string;
	tags: string[];
	path: string;
	icon: string;
	image: boolean;
	color: string;
	//Type "Folder" o "Sheet"
	constructor(name:string, type:string, tags:string[], path:string, icon:string, image:boolean, color:string) {
		this.id = guidGenerator();
		this.name = name
		this.type = type
		this.tags = tags
		this.path = path
		this.icon = icon
		this.image = image
		this.color = color
	}

	getId () {
		return this.id
	}

	getName(){
		return this.name
	}

	setName (newName:string) {
		this.name = newName
	}

	getType(){
		return this.type
	}

	setType (newType:string) {
		this.type = newType
	}

	getTags () {
		return this.tags
	}

	setTags (newTags:string[]) {
		this.tags = newTags
	}

	addTag (newTag:string) {
		this.tags.push(newTag)
	}

	remTag (tag:string) {
		this.tags = this.tags.filter(e => e !== tag)
	}

	emptyTags () {
		this.tags = [];
	}

	getPath () {
		return this.path
	}

	setPath (newPath:string) {
		this.path = newPath
	}

	getIcon () {
		return this.icon
	}

	setIcon (newIcon:string) {
		this.icon = newIcon
	}

	getImage () {
		return this.image;
	}

	setImage (newImage:boolean) {
		this.image = newImage
	}

	getColor () {
		return this.color
	}

	setColor (newColor:string) {
		this.color = newColor
	}

}

export class SheetContent extends Content{ //Hojas de contenido

	constructor(name:string, type:string, tags:string[], path:string, icon:string, image:boolean, color:string) {
		super(name, type, tags, path, icon, image, color)
	}
}

export class FolderContent extends Content{ //Carpetas

	view: string;
	//View Grid o List
	constructor(name:string, type:string, tags:string[], path:string, icon:string, image:boolean, color:string, view:string) {
		super(name, type, tags, path, icon, image, color)
		this.view = view //List/Grid
	}

	getView () {
		return this.view
	}

	setView (newView:string) {
		this.view = newView
	}

	flipView () {
		if (this.view.length > 0) {
			if (this.view == 'Grid') {
				this.view = 'List';
			} else {
				this.view = 'Grid';
			}
		} else {
			console.log('¡Tried to flip empty folder view! Defaulting to grid...')
			this.view = 'Grid'
		}
	}
}

//Clase pollo usada para el breadcumbs
export class qBreadCumbsEl {
	label: string;
	icon: string;
	constructor(label: string, icon: string) {
		this.label = label
		this.icon = icon
	}
	
	getLabel () {
		return this.label
	}

	getIcon () {
		return this.icon
	}

}

function guidGenerator() {
    const S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}