function addParent(model:any,parent:{one:boolean,instance:any,as?:string, foreignKey?: string}){
    model.belongsTo(parent.instance,{
        ...( parent.foreignKey && {as: parent.foreignKey} ),
        ...( parent.as && {as: parent.as} ),
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}

export function addParents(model:any,parents:{one:boolean,instance:any,as?:string, foreignKey?: string}[]){
    if(parents){
        parents.forEach((parent)=>{
            addParent(model,parent)
        })
    }
}