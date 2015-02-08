'use strict';

angular.module('grammatist')
  .controller('PhraseCtrl', function (Categories, Phrases, PhrasesUtils, $stateParams, $state, phrasesLegacy, $timeout) {
    var ctrl = this;

    ctrl.currentPhrase = {
      textEn:"",
      textRus:""
    };
    ctrl.phrases = [];
    ctrl.stateParamms = $stateParams;

    Phrases.get($stateParams.categoryID).$promise
      .then(function(phrases){
        ctrl.phrases = PhrasesUtils.toArray(phrases);
        if(isInvalidPhraseID()){
          ctrl.goToNextPhrase();
        }
        ctrl.currentPhrase = ctrl.phrases[$stateParams.phraseID];
      });

    ctrl.clearUserText = function(){
      ctrl.redText = "";
      ctrl.userText = "";
      ctrl.redText = "";
      ctrl.grayText = "";
      ctrl.underlinesText = phrasesLegacy.buildUnderlinedTextByString(ctrl.currentPhrase.textEn);
      ctrl.wrongSpaces = "";
    };
    ctrl.clearUserText();
    ctrl.onUserTextSpace = function(){
      ctrl.userText += " ";
      ctrl.onUserTextChange();
    };

    ctrl.onUserTextChange = function () {
      //Если пользователь исправил ошибку отменим таймауты автоматической подсказки
      if (ctrl.incorrectCharTimeout || ctrl.isPhrasesEqual()){
        $timeout.cancel(ctrl.incorrectWordTimeout);
        $timeout.cancel(ctrl.incorrectCharTimeout);
      }

      //Не даем вносить больше символов чем необходимо
      if(ctrl.currentPhrase.textEn.length < ctrl.userText.length){
        ctrl.userText = ctrl.userText.slice(0,ctrl.userText.length-1);
      }


      if(isContainErrors(ctrl.currentPhrase.textEn, ctrl.userText)){
        ctrl.redText = getBlankString(ctrl.userText.length - 1) + _.last(ctrl.userText);
        ctrl.userText = _.initial(ctrl.userText).join('');

        ctrl.incorrectCharTimeout = $timeout(function () {
          ctrl.grayText = getBlankString(ctrl.userText.length) + ctrl.currentPhrase.textEn[ctrl.userText.length];
          ctrl.redText = "";
        },2000);

        ctrl.incorrectWordTimeout = $timeout(function () {
          var correctUserWords =s.words(ctrl.userText);
          if(_.last(ctrl.userText) == ' '){
            correctUserWords.push(s.words(ctrl.currentPhrase.textEn)[correctUserWords.length]);
          } else {
            correctUserWords =_.initial(correctUserWords);
            correctUserWords.push(s.words(ctrl.currentPhrase.textEn)[correctUserWords.length]);
          }

          ctrl.grayText = correctUserWords.join(' ');
          ctrl.redText = "";
        },4000);
      } else {
        ctrl.redText = "";
      }

      function isContainErrors(targetPhrase, userPhrase){
        return !s.startsWith(targetPhrase, userPhrase);
      }
      function getBlankString(length){
        return s.repeat(' ', length);
      }
    };

    ctrl.isPhrasesEqual = function () {
      return ctrl.currentPhrase.textEn == ctrl.userText;
    };
    ctrl.isContainErrors = function () {
      return phrasesLegacy.isContainErrors(ctrl.redText);
    };
    ctrl.isContainErrorSpaces = function(){
      return phrasesLegacy.isContainErrors(ctrl.wrongSpaces);
    };
    ctrl.isWordFinished = function () {
      return phrasesLegacy.isWordFinished(ctrl.currentPhrase.textEn, ctrl.userText);
    };
    ctrl.buildRedText = function () {
      ctrl.redText = phrasesLegacy.buildRedText(ctrl.currentPhrase.textEn, ctrl.userText);
      ctrl.wrongSpaces = phrasesLegacy.buildWrongSpaces(ctrl.currentPhrase.textEn, ctrl.userText);
    };

    ctrl.onUserTextEnter = function () {
      if (useEnterInTheEndOfPhrase()) return;
      //if (useEntersToUnderlineText()) return;
      useEnterToShowGrayedText();

      function useEnterToShowGrayedText() {
        if (ctrl.isContainErrorSpaces()){
          ctrl.userText = _.str.rtrim(ctrl.userText);
        }
        if (ctrl.isContainErrors() || !ctrl.isWordFinished()) {
          ctrl.userText = phrasesLegacy.deleteLastWord(ctrl.userText);
        }
        ctrl.grayText = phrasesLegacy.buildGrayText(ctrl.currentPhrase.textEn, ctrl.userText);
        ctrl.buildRedText();
      }
      //function useEntersToUnderlineText() {
      //    if (isAllPhraseAlreadyUnderlined()) return false; //phrase already underined
      //    ctrl.underlinesText = phrasesLegacy.buildUnderlinedTextByString(ctrl.currentPhrase.text.en);
      //    return true;
      //}
      //function isAllPhraseAlreadyUnderlined() {
      //    return ctrl.currentPhrase.text.en.length == ctrl.underlinesText.length
      //}
      function useEnterInTheEndOfPhrase() {


        //var sound = new Audio("http://translate.google.com/translate_tts?tl=en&q="+
        //    ctrl.currentPhrase.text.en.split(' ').join('+'));
        //console.log(sound.load());
        //console.log(sound.play());

        if (ctrl.isPhrasesEqual()) {
          if (ctrl.currentPhrase != _.last(ctrl.phrasesList)) setNextPhrase();
          //else setNextCategory();
          return true;
        }
        return false;

        function setNextPhrase() {
          ctrl.phraseOnChange(ctrl.phrasesList[_.indexOf(ctrl.phrasesList, ctrl.currentPhrase) + 1])
        }
        //function setNextCategory() {
        //  if (ctrl.categories != _.last(ctrl.currentCategory)) {
        //    ctrl.categoryOnChange(ctrl.categories[_.indexOf(ctrl.categories, ctrl.currentCategory) + 1]);
        //  } else {
        //    ctrl.categoryOnChange(_.first(ctrl.categories));
        //  }
        //}
      }
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

