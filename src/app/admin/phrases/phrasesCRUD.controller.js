'use strict';

angular.module('grammatist')
  .controller('PhrasesCRUDCtrl',PhrasesCRUDCtrl);

function PhrasesCRUDCtrl(Phrases, Categories) {
  var ctrl = this;
  updatePhrases();
  ctrl.phraseToChange = undefined;
  ctrl.phraseIDToChange = undefined;
  ctrl.isChangeMode = false;
  ctrl.filterByCategory = undefined;

  ctrl.categories = Categories.getAll();

  ctrl.onDontSaveChanges = onDontSaveChanges;

  ctrl.onSelectCategory = function(categoryID, category){
    category.categoryID = categoryID;
    ctrl.filterByCategory = category;
    updatePhrases();
    onDontSaveChanges();
  };

  ctrl.tableOnSelect = function(phraseID, phrase){
    ctrl.phraseToChange = phrase;
    ctrl.phraseIDToChange = phraseID;
    ctrl.isChangeMode = true;
  };

  ctrl.removePhraseByID = function(phraseID){
    Phrases.delete(phraseID).$promise.
      then(function(){
        updatePhrases();
      });
  };

  ctrl.savePhrase = function(phraseID, phrase){

    phrase.categoryID = ctrl.filterByCategory.categoryID;
    console.log(phraseID, phrase);
    Phrases.save(phraseID, phrase).$promise
      .then(function(){
        updatePhrases();
      }).then(function(){
        onDontSaveChanges();
      });

  };

  ctrl.addPhrase = function(newPhrase) {
    newPhrase = newPhrase || Phrases.getEmptyPhrase();
    newPhrase.categoryID = ctrl.filterByCategory.categoryID;
    Phrases.add(newPhrase).$promise
      .then(function () {
        updatePhrases();
      })
      .then(function () {
        onDontSaveChanges();
      });
  };

  function onDontSaveChanges() {
    ctrl.phraseToChange = undefined;
    ctrl.phraseIDToChange = undefined;
    ctrl.isChangeMode = false;
  }

  function updatePhrases(){
    if(ctrl.filterByCategory){
      ctrl.phrases = Phrases.get(ctrl.filterByCategory.categoryID);
      return ctrl.phrases;
    }

  }

}
