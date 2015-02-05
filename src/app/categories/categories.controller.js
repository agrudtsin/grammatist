'use strict';

angular.module('grammatist')
  .controller('CategoriesCtrl', function (Categories, $state) {
    var ctrl = this;
    ctrl.categories = Categories.getAll();
    ctrl.onSelectCategory = function(categoryID){
      $state.go('phrase',{
        categoryID:categoryID,
        phraseID:0
      });
    }

  });
