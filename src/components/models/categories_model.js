angular.module('model.categories',[])
  .service('Categories', Categories);


function Categories(FIREBASE_URI, $resource, AuthParams){
  var url = FIREBASE_URI+'/categories.json';
  function REST(restUrl){
    restUrl = restUrl || url;
    return $resource(restUrl,{},{
      update: {method:'PUT', params: AuthParams()},
      save: {method:'POST', params: AuthParams()},
      delete: {method:'DELETE', params: AuthParams()}
    });
  }
  return {
      getAll:getAllCategories,
      add: addCategory,
      save: saveCategory,
      delete: deleteCategory

    };

  function getEmptyCategory(){
    return {
      "title":"",
      "descr":""
    };
  }

  function addCategory(newCategory){
     newCategory = newCategory || getEmptyCategory();

    return REST().save(newCategory);
  }

  function deleteCategory(categoryID){
    return REST(FIREBASE_URI+'categories/'+categoryID+'.json').delete();
  }

  function saveCategory(categoryID, category){
    category = category || getEmptyCategory();
    return REST(FIREBASE_URI+'categories/'+categoryID+'.json').update(category);
  }

  function getAllCategories(){

    return REST().get();

  }
}
