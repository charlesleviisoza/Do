function addParent(model:any,parent:{one:boolean,instance:any,as:string}){
    model.belongsTo(parent.instance,{
        as: parent.as,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}

export function addParents(model:any,parents:{one:boolean,instance:any,as:string}[]){
    if(parents){
        parents.forEach((parent)=>{
            addParent(model,parent)
        })
    }
}