'use strict';

angular.module('grammatist')
  .controller('PhraseCtrl', function (Categories, Phrases, PhrasesUtils, $stateParams, $state) {
    var ctrl = this;

    ctrl.stateParamms = $stateParams;
    Phrases.get($stateParams.categoryID).$promise
      .then(function(phrases){
        ctrl.phrases = PhrasesUtils.toArray(phrases);
        if(isInvalidPhraseID()){
          ctrl.goToNextPhrase();
        }

        ctrl.currentPhrase = ctrl.phrases[$stateParams.phraseID];
      });

    ctrl.fire = function(){
      $stateParams.phraseID =  +$stateParams.phraseID  + 1;
      $state.go('phrase',$stateParams, {});
    };

    function isInvalidPhraseID() {
      return _.isNaN(+$stateParams.phraseID) || (+$stateParams.phraseID >= ctrl.phrases.length);
    }

    ctrl.goToNextPhrase = function(){
      var nextPhraseID;

      if(isInvalidPhraseID()){
        nextPhraseID = ctrl.phrases.length - 1;
      } else {
        nextPhraseID = +$stateParams.phraseID + 1;
      }


      $state.transitionTo('phrase', {
        categoryID: $stateParams.categoryID,
        phraseID: nextPhraseID
      }, { location: 'replace' });
    };
    ctrl.onNextCathegory = function(){
      $state.go('categories');
    };
    ctrl.thiIsTheLastPhrase = function(){
      return ctrl.phrases.length-1 === +$stateParams.phraseID;
    };

  });
