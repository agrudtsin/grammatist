'use strict';

angular.module('grammatist')
  .controller('CategoriesCRUDCtrl',CategoriesCRUDCtrl);

function CategoriesCRUDCtrl(Categories) {
  var ctrl = this;
  updateCategories();
  ctrl.categoryToChange = undefined;
  ctrl.categoryIDToChange = undefined;
  ctrl.isChangeMode = false;

  ctrl.onDontSaveChanges = onDontSaveChanges;

  ctrl.tableOnSelect = function(categoryID, category){
    ctrl.categoryToChange = category;
    ctrl.categoryIDToChange = categoryID;
    ctrl.isChangeMode = true;
  };

  ctrl.removeCategoryByID = function(categoryID){
    Categories.delete(categoryID).$promise.
      then(function(){
        updateCategories();
      });
  };

  ctrl.saveCategory = function(categoryID, category){
    console.log(categoryID, category);
    Categories.save(categoryID, category).$promise
      .then(function(){
        updateCategories();
      }).then(function(){
        onDontSaveChanges();
      });

  };

  ctrl.addCategory = function(newCategory) {
    Categories.add(newCategory).$promise
      .then(function () {
        updateCategories();
      })
      .then(function () {
        onDontSaveChanges();
      });
  };

  function onDontSaveChanges() {
    ctrl.categoryToChange = undefined;
    ctrl.categoryIDToChange = undefined;
    ctrl.isChangeMode = false;
  }

  function updateCategories(){
    ctrl.categories = Categories.getAll();
    console.log(ctrl.categories);
    return ctrl.categories;
  }

}
