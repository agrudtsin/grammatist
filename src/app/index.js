'use strict';

angular.module('grammatist',
  ['ui.router',
    'ngResource',
    'firebase',
    'model.users',
    'model.categories',
    'model.phrases'])
.factory('dataProvider', ['$http', DataProvider])
.factory('phrasesLegacy', ['$http', 'dataProvider', Phrases])
.directive('ngEnter', ngEnter)
.directive('googleTts', ['$document',googleTts])
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('categories', {
        url: '/categories',
        templateUrl: 'app/categories/categories.html',
        controller: 'CategoriesCtrl',
        controllerAs: 'ctrl'
      })
      .state('phrase', {
        url: '/category/{categoryID}/phrase/{phraseID}',
        templateUrl: 'app/phrase/phrase.html',
        controller: 'PhraseCtrl',
        controllerAs: 'ctrl'
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'app/auth/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'vm'
      })
      .state('categories_crud', {
        url: '/admin/categories',
        templateUrl: 'app/admin/categories/categoriesCRUD.html',
        controller: 'CategoriesCRUDCtrl',
        controllerAs: 'ctrl'
      })
      .state('phrases_crud', {
        url: '/admin/phrases',
        templateUrl: 'app/admin/phrases/phrasesCRUD.html',
        controller: 'PhrasesCRUDCtrl',
        controllerAs: 'ctrl'
      });

    $urlRouterProvider.otherwise('/');
  });



function DataProvider($http) {
  return {
    getCategories: function () {
      return $http.get('phrases/phrases.json');
    },
    getPhrasesByID: function (id) {
      return $http.get('phrases/' + id + '.json');
    },
    getPhrasesArrayById: function (id) {
      $http.get('phrases/' + id + '.json').
        success(function (data) {
          return data;
        }).
        error(function () {
          return [];
        }
      );
    }
  }
}
function Phrases($http, dataProvider) {
  var phrasesObj = {
    currentPhrase: {
      text: {
        ru: "Стандартная фраза",
        en: "Default phrase"
      }
    },
    deleteLastWord: function (userText) {
      var lastSpacePosition = s.rtrim(userText, " ").lastIndexOf(' ');
      if (lastSpacePosition > 0) return _.initial(s.words(userText," ")).join(" ") + " ";
      return "";
    },
    deleteLastSpace: function (text) {
      return s.rtrim(text, ' ');
    },
    buildUnderlinedTextByString: function (userText) {
      var underlinedText = "";
      for (var curChar = 0; curChar < userText.length; curChar += 1) {
        if (userText[curChar] == " ") {
          underlinedText += " ";
        } else {
          underlinedText += this.underlineOrPunctuationМark(userText[curChar]);
        }
      }
      return underlinedText;
    },
    underlineOrPunctuationМark: function (character) {
      var punctuationMarks = [',', '.', ';', ':', '?', '!'];
      if (_.contains(punctuationMarks, character)) {
        return character
      } else {
        return "_";
      }
    },

    buildRedText: function (targetPhrase, userText) {
      var redText = "";
      for (var i = 0; i < userText.length; i += 1) {
        if (targetPhrase[i] !== userText[i]) {
          redText += userText[i];
        } else {
          redText += " ";
        }
      }
      return redText;

    },
    buildGrayText:function(targetPhrase, userText){
      var grayText = "";
      grayText =_.reduce(s.trim(userText), function(memo,context){return memo+=" "},"");//replace all chars by spaces
      grayText += " "+ s.words(targetPhrase)[s.words(userText).length];// add next word from targetPhrase
      if(s.words(userText).length == 0) grayText = grayText.slice(1);//remove first space if no words in user text
      return grayText;
    },
    buildWrongSpaces:function(targetPhrase, userText){
      var wrongSpaces = "";
      for (var i = 0; i < userText.length; i += 1) {
        if(userText[i] == " " && userText[i] != targetPhrase[i]){
          wrongSpaces += "█";
        } else {
          wrongSpaces += " ";
        };
      };
      return wrongSpaces;
    },
    isContainErrors: function (redText) {
      return ' ' != _.uniq(redText).toString() && '' != _.uniq(redText).toString()
    },
    isWordFinished: function(targetPhrase, userText){
      if(userText=="") return true;
      var targetPhraseWords = s.words(targetPhrase);
      return _.reduce(s.words(userText), function(result, value, key){
        return result && (value == targetPhraseWords[key])
      },true);
    },
    cropUserTextIfContainErrors: function (targetPhrase, userText) {
      var isContainErrors = this.isContainErrors(this.buildRedText(targetPhrase, userText));
      var isContainErrorsInPreviousWord = this.isContainErrors(this.buildRedText(targetPhrase, this.deleteLastWord(userText)));
      if (isContainErrors && isContainErrorsInPreviousWord) {
        return this.deleteLastWord(userText)
      } else {
        return userText;
      }
    },
    getCurrent: function () {
      return this.currentPhrase;
    },
    categories: [],
    phrasesList: []
  };

  dataProvider.getCategories().success(function (data) {
    phrasesObj.categories = data;
  });

  return phrasesObj;
}
function ngEnter() {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
      if (event.which === 32) {
        scope.$apply(function () {
          scope.$eval("onUserTextSpace()");
        });
        event.preventDefault();
      }
    });
  };
}
function googleTts($document){
  return function(scope, element, attrs) {
    var section   = $document[0].getElementById("googleTTS");
    var frame = $document[0].createElement("iframe" );
    section.appendChild( frame );
    // http://jsfiddle.net/royriojas/SE6ET/
    scope.$on('TTS', function(event, userText) {
      frame.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=en&q='+userText.split(' ').join('+');
      console.log('Play', frame.src);
    });
  };
}
